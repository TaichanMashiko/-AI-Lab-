import { Student } from '../types';

// The ID from the provided URL: https://docs.google.com/spreadsheets/d/1FhYzD_CBGVbuge4jQOuxe8JwXMjA8s_fK80jCYTCfvo/edit
const SHEET_ID = '1FhYzD_CBGVbuge4jQOuxe8JwXMjA8s_fK80jCYTCfvo';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

/**
 * Fetches the student data from the Google Sheet.
 * Note: The sheet must be "Published to the Web" or accessible via link for this to work without auth headers.
 * If CORS errors occur, ensure the sheet is published: File > Share > Publish to web.
 */
export const findStudentByEmail = async (email: string): Promise<Student | null> => {
  try {
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Columns: Name(0), Email(1), Number(2), ID(3), PW(4)
    // We skip the header row (index 0) usually, but the logic below checks email matching so header won't match.
    
    const normalizedInputEmail = email.trim().toLowerCase();

    const matchedRow = rows.find(row => {
      // Safety check for row length
      if (row.length < 5) return false;
      
      const rowEmail = row[1]?.trim().toLowerCase();
      return rowEmail === normalizedInputEmail;
    });

    if (matchedRow) {
      return {
        name: matchedRow[0]?.trim() || '',
        email: matchedRow[1]?.trim() || '',
        studentNumber: matchedRow[2]?.trim() || '',
        id: matchedRow[3]?.trim() || '',
        pw: matchedRow[4]?.trim() || '',
      };
    }

    return null;

  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error;
  }
};

/**
 * Parses CSV text into a 2D array.
 * Handles quoted fields correctly, allowing for spaces/commas inside quotes.
 */
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  // Normalize line endings
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const nextChar = normalizedText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Double quote inside quotes means a literal quote
          currentField += '"';
          i++; // Skip next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push the last field/row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
};