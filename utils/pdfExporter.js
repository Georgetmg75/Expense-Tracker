// utils/pdfExporter.js
import PDFDocument from 'pdfkit';

/**
 * Converts an array of objects into a formatted PDF.
 * @param {Array<Object>} data - The data to include in the PDF.
 * @param {string} title - The title of the document.
 * @returns {Buffer} - The generated PDF as a buffer.
 */
export const exportToPDF = (data, title = 'Summary') => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Title
  doc.fontSize(20).text(title, { align: 'center' }).moveDown(2);

  // Table-like formatting
  data.forEach((item, index) => {
    doc.fontSize(12).fillColor('black').text(`${index + 1}.`, { continued: true });

    Object.entries(item).forEach(([key, value]) => {
      doc.font('Helvetica-Bold').text(`${key}: `, { continued: true });
      doc.font('Helvetica').text(`${value}`);
    });

    doc.moveDown();
  });

  doc.end();
  return Buffer.concat(buffers);
};
////