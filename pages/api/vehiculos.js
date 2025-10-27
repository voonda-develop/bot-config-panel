import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Hoja1!A1:Z1000?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) return res.status(200).json([]);

    const headers = data.values[0];
    const rows = data.values.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] || ''));
      return obj;
    });

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error leyendo datos de Google Sheets' });
  }
}