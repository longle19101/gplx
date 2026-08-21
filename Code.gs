/**
 * CCCD Scanner backend.
 * Deploy this as a Web App (Deploy > New deployment > Web app).
 *   Execute as: Me
 *   Who has access: Anyone (or "Anyone with Google account" if you want to restrict it)
 * Copy the resulting /exec URL into the scanner web app's "Google Sheet settings" field.
 */

const SHEET_NAME = "Data";
const HEADERS = ["Timestamp", "Ho ten", "So CCCD", "So CMND cu", "Ngay sinh", "Gioi tinh", "Dia chi", "Ngay cap", "Nguon"];

function doPost(e) {
  try {
    const sheet = getSheet_();
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.idNumber || "",
      data.oldId || "",
      data.dob || "",
      data.gender || "",
      data.address || "",
      data.issueDate || "",
      data.source || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("CCCD Scanner API is running.");
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
