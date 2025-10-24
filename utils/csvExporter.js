// utils/csvExporter.js
import { Parser } from 'json2csv';

export const exportToCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};
