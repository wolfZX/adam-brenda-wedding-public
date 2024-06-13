import { google } from 'googleapis';
import { ZodError } from 'zod';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new google.auth.JWT(
      "", // NOTE: YOUR GOOGLE API CLIENT EMAIL HERE
      null,
      "", // NOTE: YOUR GOOGLE API PRIVATE KEY HERE
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    const sheets = google.sheets({ version: 'v4', auth: client });

    try {
      const body = req.body;
      // Object to Sheets
      const rows = Object.values(body);
  
      // The API automatically detect duplicates and wont append into sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: "", // NOTE: YOUR GOOGLE SHEET ID HERE
        range: 'RSVP!A2:F',
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        requestBody: {
          values: [rows],
        },
      });
      res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error });
      }
    }
  }

  return res.status(404).json({ error: "The requested endpoint was not found or doesn't support this method." });
}