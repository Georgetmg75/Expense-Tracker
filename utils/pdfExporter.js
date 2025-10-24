// utils/pdfExporter.js
import PDFDocument from 'pdfkit';

export const exportToPDF = (data, title = 'Summary') => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text(title, { align: 'center' }).moveDown();

  data.forEach((item, i) => {
    doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item)}`);
  });

  doc.end();
  return Buffer.concat(buffers);
};
