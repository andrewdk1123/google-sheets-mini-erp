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
 * @param {Array|Object} data - Data to be added to the sheet.
 */
function createRecord(spreadsheetId, sheetName, data) {
  try {
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

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
 * @param {String} readRange - Spreadsheet range to read values. Do not include sheet name in the range! Example usage: "A1:G15"
 * @param {Boolean} includeHeader - True if you want to include the header row in the resulting array. Default is false.
 * @param {Boolean} readByColumn - True if you want to set range to read data by columns. Default is false.
 * @param {String} firstColumn - The first column to read range. Required when readByColumn is true.
 * @param {String} lastColumn - The last column to read range. Required when readByColumn is true.
 * @return {Array} dataArray - An Array of data from the Google Sheet.
 */
function readRecord(spreadsheetId, sheetName, readRange = '', includeHeader = true, readByColumn = false, firstColumn = '', lastColumn = '') {
  try {
    if (readByColumn && (!firstColumn || !lastColumn)) {
      throw new Error("When readByColumn is true, startColumn and endColumn are required.");
    }

    if (!readRange && !readByColumn) {
      throw new Error("At least one of the readRange or readByColumn should be provided!");
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    let dataArray;

    if (readByColumn) {
      const columnRange = firstColumn + ':' + lastColumn;
      dataArray = sheet.getRange(columnRange).getValues();
      const numColumns = dataArray[0].length;

      // Iterate through rows in dataArray and check if all values in a row are empty
      for (let row = 0; row < dataArray.length; row++) {
        let allEmpty = true;
        for (let col = 0; col < numColumns; col++) {
          if (dataArray[row][col] !== null && dataArray[row][col] !== "") {
            allEmpty = false;
            break; // Exit the inner loop when a non-null value is found in a row
          }
        }
        if (allEmpty) {
          // If all values in a row are null, stop reading and return the data up to this point
          dataArray = dataArray.slice(0, row);
          break;
        }
      }
    } else {
      dataArray = sheet.getRange(readRange).getValues();
    }

    return includeHeader ? dataArray : dataArray.slice(1);

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
    // Read the key values from the specified column and check if keyValue exists
    const keyList = readRecord(spreadsheetId, sheetName, '', false, true, keyCol, keyCol).flat();
    return keyList.includes(keyValue);
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
      throw new Error("When readByColumn is true, startColumn and endColumn are required.");
    }    

    const dataArray = readRecord(spreadsheetId, sheetName, '', false, true, firstCol, lastCol);
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
  // Read the key values from the specified column and find the rowIndex of the matching key
  const keyList = readRecord(spreadsheetId, sheetName, '', false, true, keyCol, keyCol);
  const rowIndex = keyList.findIndex(item => item[0] === key);

  if (rowIndex === -1) {
    return { rowData: null, rowIndex: -1, range: null }; // Key not found
  }

  // Define the range and retrieve rowData for the matching row
  const range = `${sheetName}!${firstCol}${rowIndex + 2}:${lastCol}${rowIndex + 2}`;
  const rowData = readRecord(spreadsheetId, sheetName, range);
  return { rowData, rowIndex: rowIndex + 2, range };
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
 * @param {String} keyColumn - Column letter (e.g., "A") containing the key values
 */
function deleteRecord(spreadsheetId, sheetName, key) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] === key) {
      sheet.deleteRow(i + 1); // Adjust for 1-based index
    }
  }
}
