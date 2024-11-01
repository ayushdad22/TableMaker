const textBox = document.getElementById("textBox");
const output = document.getElementById("output");

const checkValue = (text, startChar, endChar) => {
    const regex = new RegExp(`\\${startChar}(.*?)\\${endChar}`, 'g');
    let matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        let extractedValue = match[1];
        let base = 10; // Default base is decimal
        let paddingLength = 0; // Default padding length is 0

        extractedValue = extractedValue.trim().toLowerCase();

        // Determine the base and strip the base identifier
        if (extractedValue.startsWith('hex')) {
            base = 16;
            extractedValue = extractedValue.slice(3).trim();
            if(extractedValue.startsWith('convert')) {
                
                extractedValue = extractedValue.slice(7).trim();
                extractedValue = parseInt(extractedValue).toString(16);
                console.log(extractedValue);
            }
        } else if (extractedValue.startsWith('binary')) {
            base = 2;
            extractedValue = extractedValue.slice(6).trim();
        }

        // Extract padding length if specified
        let paddingMatch = extractedValue.match(/(.*)num(\d+)/);
        let initialValue = extractedValue;
        if (paddingMatch) {
            initialValue = paddingMatch[1].trim();
            paddingLength = parseInt(paddingMatch[2], 10);
        }

        // If initialValue is empty, default to '0'
        if (!initialValue) {
            initialValue = '0';
        }

        matches.push({ value: initialValue, base: base, padding: paddingLength });
    }
    return matches;
};

const incrementValue = (values, n) => {
    let result = [];
    values.forEach(item => {
        let { value, base, padding } = item;
        let incrementedValues = [];

        // Parse the initial value with the correct base
        value = parseInt(value, base);

        for (let i = 0; i <= n; i++) {
            let incrementedValue = value + i;
            let formattedValue = incrementedValue.toString(base);

            // Pad with leading zeros if padding is specified
            if (padding > 0) {
                formattedValue = formattedValue.padStart(padding, '0');
            }

            incrementedValues.push(formattedValue);
        }
        result.push(incrementedValues);
    });
    return result;
};

function printSentenceWithIncrements(sentence, increments, startChar, endChar) {
    let fullOutput = "";

    if (increments.length === 0 || increments[0].length === 0) {
        fullOutput = "No valid values found between the specified characters.";
        return fullOutput;
    }

    const n = increments[0].length;

    const placeholderRegex = new RegExp(`\\${startChar}(.*?)\\${endChar}`, 'g');
    const placeholders = [];
    let match;
    while ((match = placeholderRegex.exec(sentence)) !== null) {
        placeholders.push(match[0]);
    }

    for (let i = 0; i < n; i++) {
        let modifiedSentence = sentence;
        for (let j = 0; j < placeholders.length; j++) {
            const placeholder = placeholders[j];
            const value = increments[j][i];
            modifiedSentence = modifiedSentence.replace(placeholder, value);
        }
        fullOutput += `${modifiedSentence}\n`;
    }
    return fullOutput;
}

function myFunction() {
    const originalText = textBox.value;

    const startChar = document.getElementById("startChar").value.trim();
    const endChar = document.getElementById("endChar").value.trim();
    const numValue = parseInt(document.getElementById("numValue").value);

    if (!startChar || !endChar) {
        output.innerHTML = "Please provide both start and end characters.";
        return;
    }

    const values = checkValue(originalText, startChar, endChar);

    if (values.length === 0) {
        output.innerHTML = "No valid values found between the specified characters.";
        return;
    }

    const increments = incrementValue(values, numValue);

    output.innerHTML = printSentenceWithIncrements(originalText, increments, startChar, endChar);
}