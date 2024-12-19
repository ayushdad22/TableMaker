const setupColumnsBtn = document.getElementById('setupColumnsBtn');
const columnsForm = document.getElementById('columnsForm');
const columnsConfigDiv = document.getElementById('columnsConfig');
const generateBtn = document.getElementById('generateBtn');
const tableContainer = document.getElementById('tableContainer');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');
const downloadBtn = document.getElementById('downloadBtn');

setupColumnsBtn.addEventListener('click', setupColumns);
generateBtn.addEventListener('click', generateTable);
downloadBtn.addEventListener('click', downloadAsDoc);
rowsInput.addEventListener('change', resetColumnsConfig);
columnsInput.addEventListener('change', resetColumnsConfig);

function resetColumnsConfig() {
    columnsConfigDiv.innerHTML = '';
    columnsForm.classList.add('hidden');
    tableContainer.innerHTML = '';
    downloadBtn.classList.add('hidden');
}

function setupColumns() {
    const columns = parseInt(columnsInput.value);
    const rows = parseInt(rowsInput.value);

    if (columns <= 0 || rows <= 0) {
        alert('Please enter valid numbers for rows and columns.');
        return;
    }

    columnsConfigDiv.innerHTML = '';

    for (let i = 1; i <= columns; i++) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column-config';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = `Column ${i} Name:`;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = `columnName${i}`;
        nameInput.id = `columnName${i}`;
        nameInput.placeholder = `Enter name for Column ${i}`;

        const label = document.createElement('label');
        label.textContent = `Column ${i} Type:`;

        const select = document.createElement('select');
        select.name = `columnType${i}`;
        select.id = `columnType${i}`;
        select.addEventListener('change', (e) => toggleCustomValuesInput(e, i));

        const options = ['Incrementing Values', 'Duplicate Column', 'Static Value', 'Custom Text', 'Custom Values'];
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText.replace(/\s+/g, '').toLowerCase();
            option.textContent = optionText;
            select.appendChild(option);
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.name = `columnValue${i}`;
        input.id = `columnValue${i}`;
        input.placeholder = 'Enter starting value or text';

        const incrementOptionsDiv = document.createElement('div');
        incrementOptionsDiv.className = 'increment-options hidden';
        incrementOptionsDiv.id = `incrementOptionsDiv${i}`;

        const numeralSystemLabel = document.createElement('label');
        numeralSystemLabel.textContent = 'Numeral System:';

        const numeralSystemSelect = document.createElement('select');
        numeralSystemSelect.name = `numeralSystem${i}`;
        numeralSystemSelect.id = `numeralSystem${i}`;

        ['Decimal', 'Hexadecimal', 'Binary'].forEach(system => {
            const option = document.createElement('option');
            option.value = system.toLowerCase();
            option.textContent = system;
            numeralSystemSelect.appendChild(option);
        });

        const paddingLabel = document.createElement('label');
        paddingLabel.textContent = 'Padding Length:';
        const paddingInput = document.createElement('input');
        paddingInput.type = 'number';
        paddingInput.name = `paddingLength${i}`;
        paddingInput.id = `paddingLength${i}`;
        paddingInput.min = '0';
        paddingInput.value = '0';

        incrementOptionsDiv.appendChild(numeralSystemLabel);
        incrementOptionsDiv.appendChild(numeralSystemSelect);
        incrementOptionsDiv.appendChild(paddingLabel);
        incrementOptionsDiv.appendChild(paddingInput);

        const customValuesDiv = document.createElement('div');
        customValuesDiv.className = 'custom-values hidden';
        customValuesDiv.id = `customValuesDiv${i}`;

        columnDiv.appendChild(nameLabel);
        columnDiv.appendChild(nameInput);
        columnDiv.appendChild(label);
        columnDiv.appendChild(select);
        columnDiv.appendChild(input);
        columnDiv.appendChild(incrementOptionsDiv);
        columnDiv.appendChild(customValuesDiv);

        columnsConfigDiv.appendChild(columnDiv);
    }

    columnsForm.classList.remove('hidden');
}

function toggleCustomValuesInput(event, index) {
    const selectedType = event.target.value;
    const inputField = document.getElementById(`columnValue${index}`);
    const customValuesDiv = document.getElementById(`customValuesDiv${index}`);
    const incrementOptionsDiv = document.getElementById(`incrementOptionsDiv${index}`);
    const rows = parseInt(rowsInput.value);

    customValuesDiv.innerHTML = '';

    if (selectedType === 'customvalues') {
        inputField.classList.add('hidden');
        incrementOptionsDiv.classList.add('hidden');

        const useSingleTextboxLabel = document.createElement('label');
        useSingleTextboxLabel.textContent = 'Use single textbox:';
        const useSingleTextboxCheckbox = document.createElement('input');
        useSingleTextboxCheckbox.type = 'checkbox';
        useSingleTextboxCheckbox.id = `useSingleTextbox${index}`;
        useSingleTextboxCheckbox.name = `useSingleTextbox${index}`;

        customValuesDiv.appendChild(useSingleTextboxLabel);
        customValuesDiv.appendChild(useSingleTextboxCheckbox);

        const singleTextboxDiv = document.createElement('div');
        singleTextboxDiv.className = 'single-textbox hidden';
        singleTextboxDiv.id = `singleTextboxDiv${index}`;

        const singleTextboxLabel = document.createElement('label');
        singleTextboxLabel.textContent = 'Enter values separated by commas:';
        const singleTextbox = document.createElement('input');
        singleTextbox.type = 'text';
        singleTextbox.name = `singleTextbox${index}`;
        singleTextbox.id = `singleTextbox${index}`;
        singleTextbox.placeholder = 'Value1, Value2, Value3, ...';

        singleTextboxDiv.appendChild(singleTextboxLabel);
        singleTextboxDiv.appendChild(singleTextbox);

        const multipleInputsDiv = document.createElement('div');
        multipleInputsDiv.className = 'multiple-inputs';
        multipleInputsDiv.id = `multipleInputsDiv${index}`;

        for (let i = 0; i < rows; i++) {
            const customValueLabel = document.createElement('label');
            customValueLabel.textContent = `Row ${i + 1} Value:`;

            const customValueInput = document.createElement('input');
            customValueInput.type = 'text';
            customValueInput.name = `customValue${index}_${i}`;
            customValueInput.id = `customValue${index}_${i}`;
            customValueInput.className = 'custom-value-input';

            multipleInputsDiv.appendChild(customValueLabel);
            multipleInputsDiv.appendChild(customValueInput);
        }

        customValuesDiv.appendChild(singleTextboxDiv);
        customValuesDiv.appendChild(multipleInputsDiv);

        useSingleTextboxCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                singleTextboxDiv.classList.remove('hidden');
                multipleInputsDiv.classList.add('hidden');
            } else {
                singleTextboxDiv.classList.add('hidden');
                multipleInputsDiv.classList.remove('hidden');
            }
        });

        customValuesDiv.classList.remove('hidden');
    } else if (selectedType === 'incrementingvalues') {
        inputField.placeholder = 'Enter starting value';
        inputField.classList.remove('hidden');
        incrementOptionsDiv.classList.remove('hidden');
        customValuesDiv.classList.add('hidden');
    } else {
        inputField.placeholder = 'Enter value or text';
        inputField.classList.remove('hidden');
        incrementOptionsDiv.classList.add('hidden');
        customValuesDiv.classList.add('hidden');
    }
}

function generateTable() {
    const rows = parseInt(rowsInput.value);
    const columns = parseInt(columnsInput.value);
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    const columnConfigs = [];
    for (let i = 1; i <= columns; i++) {
        const columnName = document.getElementById(`columnName${i}`).value || `Column ${i}`;
        const columnType = document.getElementById(`columnType${i}`).value;
        const columnValue = document.getElementById(`columnValue${i}`).value;
        let customValues = [];
        let numeralSystem = 'decimal';
        let paddingLength = 0;
        let useSingleTextbox = false;
        let singleTextboxValues = [];

        if (columnType === 'customvalues') {
            const useSingleTextboxCheckbox = document.getElementById(`useSingleTextbox${i}`);
            useSingleTextbox = useSingleTextboxCheckbox ? useSingleTextboxCheckbox.checked : false;

            if (useSingleTextbox) {
                const singleTextbox = document.getElementById(`singleTextbox${i}`);
                if (singleTextbox) {
                    singleTextboxValues = singleTextbox.value.split(',').map(val => val.trim());
                }
            } else {
                for (let j = 0; j < rows; j++) {
                    const customValueInput = document.getElementById(`customValue${i}_${j}`);
                    customValues.push(customValueInput.value);
                }
            }
        } else if (columnType === 'incrementingvalues') {
            numeralSystem = document.getElementById(`numeralSystem${i}`).value;
            paddingLength = parseInt(document.getElementById(`paddingLength${i}`).value) || 0;
        }

        columnConfigs.push({
            name: columnName,
            type: columnType,
            value: columnValue,
            customValues: customValues,
            singleTextboxValues: singleTextboxValues,
            useSingleTextbox: useSingleTextbox,
            numeralSystem: numeralSystem,
            paddingLength: paddingLength
        });
    }

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (let i = 0; i < columns; i++) {
        const th = document.createElement('th');
        th.textContent = columnConfigs[i].name;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');

        columnConfigs.forEach((config, index) => {
            const td = document.createElement('td');
            let cellValue = '';

            switch (config.type) {
                case 'incrementingvalues':
                    let startValue = config.value.trim() === '' ? 0 : config.value.trim();
                    let base = 10;

                    if (config.numeralSystem === 'hexadecimal') {
                        base = 16;
                        startValue = parseInt(startValue, base);
                    } else if (config.numeralSystem === 'binary') {
                        base = 2;
                        startValue = parseInt(startValue, base);
                    } else {
                        startValue = parseInt(startValue, 10);
                    }

                    let incrementedValue = startValue + i;
                    let formattedValue = incrementedValue.toString(base);

                    if (config.paddingLength > 0) {
                        formattedValue = formattedValue.padStart(config.paddingLength, '0');
                    }

                    cellValue = formattedValue;
                    break;

                case 'duplicatecolumn':
                    const sourceColumnIndex = parseInt(config.value) - 1;
                    if (sourceColumnIndex >= 0 && sourceColumnIndex < index) {
                        cellValue = tr.children[sourceColumnIndex].textContent;
                    } else {
                        cellValue = 'N/A';
                    }
                    break;

                case 'staticvalue':
                    cellValue = config.value;
                    break;

                case 'customtext':
                    cellValue = config.value.replace(/\{i\}/g, i + 1);
                    break;

                case 'customvalues':
                    if (config.useSingleTextbox) {
                        if (i < config.singleTextboxValues.length) {
                            cellValue = config.singleTextboxValues[i];
                        } else {
                            cellValue = '';
                        }
                    } else {
                        if (i < config.customValues.length) {
                            cellValue = config.customValues[i];
                        } else {
                            cellValue = '';
                        }
                    }
                    break;

                default:
                    cellValue = '';
            }

            td.textContent = cellValue;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
    downloadBtn.classList.remove('hidden');
}

function downloadAsDoc() {
    const tableHTML = tableContainer.innerHTML;
    const css = '<style>' +
        'table { border-collapse: collapse; width: 100%; } ' +
        'table, th, td { border: 1px solid #333; } ' +
        'th, td { padding: 8px; text-align: left; }' +
    '</style>';

    const htmlContent = '<html><head>' + css + '</head><body>' + tableHTML + '</body></html>';

    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });

    saveAs(blob, 'table.doc');
}

function saveAs(blob, fileName) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
