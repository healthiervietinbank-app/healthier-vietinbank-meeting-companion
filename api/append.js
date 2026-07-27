import { sheetsRequest } from "./_google.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { tab, values } = req.body ?? {};
    if (!tab || !Array.isArray(values)) return res.status(400).json({ ok: false, error: "tab and values are required" });
    const data = await sheetsRequest("/values/" + encodeURIComponent(tab) + "!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS", { method: "POST", body: JSON.stringify({ values: [values] }) });
    res.status(200).json({ ok: true, updatedRange: data.updates?.updatedRange ?? null });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
