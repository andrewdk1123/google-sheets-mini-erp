/**
 * Google Apps Script codes to Create, Read, Update, and Delete a record in a Google Spreadsheet
 * By: andrewdklee.com
 * Github: https:github.com/andrewdk1123/google-sheets-crud-app
 * REF:
 * https://developers.google.com/sheets/api/guides/values#append_values
 * https://developers.google.com/sheets/api/guides/values#read
 * https://developers.google.com/sheets/api/guides/values#write_to_a_single_range
 * https://developers.google.com/sheets/api/guides/batchupdate
 * https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
 */

/**
 * Append a new record to a Google Sheet.
 * @param {string} spreadsheetId - Google Sheet ID.
 * @param {string} sheetName - Name of the sheet within the spreadsheet.
 * @param {Array} data - Data to be added to the sheet.
 */
function createRecord(spreadsheetId, sheetName, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);

    // Check if data is an object, and convert it to an array of values
    const values = Array.isArray(data) ? data : Object.values(data);
    
    // Append a new row with the provided data
    sheet.appendRow(values);
    
    Logger.log("New record added successfully.");
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}

/**
 * Read records from a Google Spreadsheet, optionally including the header row.
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {Boolean} includeHeader - True if you want to include the header row in the resulting array. Default is true.
 * @param {String} firstColumn - The first column in the Google Sheets range to read. 
 * @param {String} lastColumn - The last column in the Google Sheets range to read. 
 * @return {Array} dataArray - An Array of data from the Google Sheet.
 */
function readRecord(spreadsheetId, sheetName, includeHeader = true, firstColumn, lastColumn) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);

    const columnRange = firstColumn + ':' + lastColumn;
    const dataRange = sheet.getRange(columnRange);
    
    // Find the last non-empty cell in the column
    const lastNonEmptyCell = dataRange.getNextDataCell(SpreadsheetApp.Direction.DOWN);
    
    // Get the values in the range up to the last non-empty cell
    const numRows = lastNonEmptyCell.getRow();
    const values = sheet.getRange(1, 1, numRows, dataRange.getNumColumns()).getValues();

    return includeHeader ? values : values.slice(1);

  } catch (err) {
    console.error('Failed with error: %s', err.message);
    return [];
  }
}

/**
 * Generate a key value for a row
 * @return {String} key -  A unique identifier to specify the record
 */
function generateKey() {
  let key = Utilities.getUuid();
  return key;
}

/**
 * Validate a key value in a Google Spreadsheet.
 * @param {String} keyValue - Unique identifier to specify the record.
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {String} keyCol - Column where key values are stored, e.g., "A".
 * @return {Boolean} - True if the key value exists, false otherwise.
 */
function isValidKey(keyValue, spreadsheetId, sheetName, keyCol) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getRange(keyCol + '1:' + keyCol + sheet.getLastRow()).getValues().flat();
  return data.includes(keyValue);
}


/**
 * Check if a value is an integer
 * @param {Number} value - A Number value to check
 * @return {Boolean} - true if the value is an integer
 */
function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

/**
 * Returns the last n records in a sheet
 * @param {Number} n - An integer value of length up to the number of rows in the data table to read
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {String} firstCol - A Character value to set the starting column for read range. Required when readByCol is true.
 * @param {String} lastCol - A Character value to set the last column for read range. Required when readByCol is true.
 * @return {Array} tailRows - An Array of data read from the given Google Sheet
 */
function getTailRows(n, spreadsheetId, sheetName, firstCol, lastCol) {
  try {
    if (!isInt(n)) {
      throw new Error("Please enter an Integer value!");
    }    

    const dataArray = readRecord(spreadsheetId, sheetName, false, firstCol, lastCol);
    const numRows = dataArray.length;
    const startRowIdx = numRows - Math.min(numRows, n);
    const tailRows = dataArray.slice(startRowIdx, numRows);

    return tailRows;
  } catch (err) {
    console.error("Failed with error: %s", err.message);
    return [];
  }
}

/**
 * Find a row with a matching key value, retrieve the range of the row, and return the data, row index, and range.
 * @param {String} key - The key value to search for in the specified sheet.
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {String} keyCol - The column where key values are stored, e.g., "A".
 * @param {String} firstCol - The first column in the row, e.g., "A".
 * @param {String} lastCol - The last column in the row, e.g., "G".
 * @return {Object} result - An object containing rowData, rowIndex, and range.
 */
function searchRecordByKey(key, spreadsheetId, sheetName, keyCol, firstCol, lastCol) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    // Read the key values and data from the specified columns
    const keyValues = sheet.getRange(keyCol + ":" + keyCol).getValues();
    const dataRange = sheet.getRange(firstCol + ":" + lastCol);
    const dataValues = dataRange.getValues();

    // Find the rowIndex of the matching key
    const rowIndex = keyValues.findIndex(item => item[0] === key);

    if (rowIndex === -1) {
      return { rowData: null, rowIndex: -1, range: null }; // Key not found
    }

    // Extract the row data and range
    const rowData = dataValues[rowIndex];
    const range = `${firstCol}${rowIndex + 1}:${lastCol}${rowIndex + 1}`;

    return {
      rowData, 
      rowIndex: rowIndex + 1, 
      range 
    };
  } catch (err) {
    console.error('Failed with error: %s', err.message);
    return {
      rowData: null,
      rowIndex: -1,
      range: null
    };
  }
}

/**
 * Update values in a specified range of a Google Spreadsheet.
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {Array} headerArray - Headers in the sheet
 * @param {String} range - Spreadsheet range to update values. Do not include sheet name in the range! Example usage: "A1:G15"
 * @param {Object} valueObject - Values to replace with in a row. Object attributes MUST match the actual column names!
 */
function updateRecord(spreadsheetId, sheetName, headerArray, range, valueObject) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    const updaterange = sheet.getRange(range)
    
    const values = headerArray.map(headerArray => valueObject[headerArray]);
    updaterange.setValues([values]);
  } catch (err) {
    console.log("Failed with error %s", err.message);
  }
}

/**
 * Delete a row in a Google Spreadsheet by matching a key value in a specified column.
 * @param {String} spreadsheetId - Google Sheet ID
 * @param {String} sheetName - Sheet name in the spreadsheet
 * @param {String} key - Key value to match for row deletion
 * @param {String} keyColumn - Header of the column containing the key values
 */
function deleteRecord(spreadsheetId, sheetName, key, keyColumn) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  // Find the index of the key column
  var keyColumnIndex = data[0].indexOf(keyColumn);

  if (keyColumnIndex === -1) {
    throw new Error("Key column not found in the spreadsheet");
  }

  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][keyColumnIndex] === key) {
      sheet.deleteRow(i + 1); // Adjust for 1-based index
    }
  }
}

