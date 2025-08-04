// csvUtils.js
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * Parse a CSV buffer into an array of objects.
 * @param {Buffer} fileBuffer
 * @param {function} normalizeFn - function to normalize each row
 * @returns {Promise<Array>}
 */
export function parseCSV(fileBuffer, normalizeFn = x => x) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(fileBuffer);
    stream
      .pipe(csv())
      .on('data', (data) => results.push(normalizeFn(data)))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(new Error(`CSV parsing failed: ${error.message}`)));
  });
}
