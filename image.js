// Importing PDFDocument from pdf-lib available through CDN import
const { PDFDocument } = PDFLib;

async function imagesToPDF() {
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
        alert('Please select images to convert.');
        return;
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
        let imageBytes;
        let mimeType = file.type;

        // Fallback to determine type based on file extension if mimeType is blank
        if (!mimeType) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.heic')) {
                mimeType = 'image/heic';
            } else if (fileName.endsWith('.png')) {
                mimeType = 'image/png';
            } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                mimeType = 'image/jpeg';
            } else {
                console.warn(`Unsupported file type for file: ${file.name}`);
                continue; // Skip unsupported file types
            }
        }

        try {
            // Convert HEIC files if necessary
            if (mimeType === 'image/heic') {
                const convertedImage = await heic2any({ blob: file, toType: 'image/jpeg' });
                imageBytes = await convertedImage.arrayBuffer();
                mimeType = 'image/jpeg'; // Assuming successful conversion to JPEG
            } else {
                imageBytes = await file.arrayBuffer();
            }

            // Embed based on the determined mimeType
            let image;
            if (mimeType === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else if (mimeType === 'image/jpeg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else {
                console.warn(`Unsupported file type after processing: ${mimeType}`);
                continue;
            }

            // Add a page with dimensions of the image
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        } catch (error) {
            console.error('Error processing file:', file.name, error);
        }
    }

    // Save and download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'images.pdf';
    link.click();
}
