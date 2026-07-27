import { sheetsRequest } from "./_google.js";

export default async function handler(_req, res) {
  try {
    const data = await sheetsRequest("?fields=spreadsheetId,properties.title,sheets.properties.title");
    res.status(200).json({ ok: true, spreadsheetId: data.spreadsheetId, title: data.properties?.title, tabs: data.sheets?.map((sheet) => sheet.properties?.title) ?? [] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
