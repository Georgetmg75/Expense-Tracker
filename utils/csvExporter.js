// utils/csvExporter.js
import { Parser } from 'json2csv';

/**
 * Converts an array of objects into CSV format.
 * @param {Array<Object>} data - The data to convert.
 * @param {Array<string>} fields - The fields to include in the CSV.
 * @returns {string} - The resulting CSV string.
 */
export const exportToCSV = (data, fields) => {
  try {
    const parser = new Parser({ fields });
    return parser.parse(data);
  } catch (err) {
    console.error('❌ CSV export failed:', err.message);
    throw new Error('Failed to export data to CSV');
  }
};
