
import crypto from "node:crypto";

const base64Url = (value) => Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!raw || !spreadsheetId) throw new Error("Google Sheets environment variables are not configured");
  return { credentials: JSON.parse(raw), spreadsheetId };
}

async function accessToken() {
  const { credentials } = getCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({ iss: credentials.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const unsigned = header + "." + claim;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(credentials.private_key, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + signature }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || "Google authentication failed");
  return data.access_token;
}

export async function sheetsRequest(path, options = {}) {
  const { spreadsheetId } = getCredentials();
  const token = await accessToken();
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetId + path, { ...options, headers: { authorization: "Bearer " + token, "content-type": "application/json", ...(options.headers || {}) } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Google Sheets request failed");
  return data;
}
