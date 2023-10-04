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
 * Create a new row
 * @param {String} workbookId - A String value to specify Google Sheet ID for the workbook
 * @param {String} insertRange - A String value to specify a range where the valueArray to be appended. e.g., "Sheet!A2:G"
 * @param {Array} valueArray - Entry values submitted from the client-side code
 */
function createRecord(workbookId, insertRange, valueArray) {
  try {
    // Create a new row data object
    let newRowRange = Sheets.newRowData();
    newRowRange.values = valueArray;

    // Create an append request
    let appendRequest = Sheets.newAppendCellsRequest();
    appendRequest.sheetId = workbookId;
    appendRequest.rows = newRowRange;

    Sheets.Spreadsheets.Values.append(newRowRange, workbookId, insertRange, {valueInputOption: "RAW"});
  } catch (err) {
    console.error("Failed with error: %s", err.message);
  }
}

/**
 * Validate a key value in a Google Spreadsheet.
 * @param {String} keyValue - A unique identifier to specify the record.
 * @param {String} workbookId - A String value to specify the Google Sheet ID for the workbook.
 * @param {String} sheetName - A String value to specify the name of the sheet.
 * @param {String} keyCol - A Character value indicating the column where key values are stored, e.g., "A".
 * @return {Boolean} - True if the key value exists, false otherwise.
 */
function checkId(keyValue, workbookId, sheetName, keyCol) {
    // Read the key values from the specified column and check if keyValue exists
    const keyList = readRecord(workbookId, sheetName, '', false, true, keyCol, keyCol).flat();
    return keyList.includes(keyValue);
}

/**
 * Read records from a Google Spreadsheet, optionally including the header row.
 * @param {String} workbookId - A String value to specify Google Sheet ID for the workbook.
 * @param {String} sheetName - A String value to specify the name of the sheet.
 * @param {String} readRange - A String value to specify a range to read values, e.g., "A1:G15".
 * @param {Boolean} includeHeader - A Boolean value indicating whether to include the header row in the result. Default is false.
 * @param {Boolean} readByColumn - A Boolean value indicating whether to read data by columns. Default is false.
 * @param {String} startColumn - A Character value to set the starting column for read range. Required when readByColumn is true.
 * @param {String} endColumn - A Character value to set the last column for read range. Required when readByColumn is true.
 * @return {Array} dataArray - An Array of data from the Google Sheet.
 */
function readRecord(workbookId, sheetName, readRange = '', includeHeader = true, readByColumn = false, startColumn = '', endColumn = '') {
  try {
    if (readByColumn && (!startColumn || !endColumn)) {
      throw new Error('When readByColumn is true, startColumn and endColumn are required.');
    }

    if (!readRange && !readByColumn) {
      throw new Error('At least one of the readRange or readByColumn should be provided!');
    }

    const workbook = SpreadsheetApp.openById(workbookId);
    const sheet = workbook.getSheetByName(sheetName);
    let dataArray;

    if (readByColumn) {
      const columnRange = startColumn + ':' + endColumn;
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
 * Returns the last parts of a data table
 * @param {Number} n - An integer value of length up to the number of rows in the data table to read
 * @param {String} workbookId - A String value to specify Google Sheet ID for the workbook
 * @param {String} sheetName - A String value to specify the name of the sheet
 * @param {String} readRange - A String value to specify a range where the valueArray to be appended. e.g., "A1:G15"
 * @param {Boolean} readByCol - A Boolean value indicating whether to read data by columns. Default is false.
 * @param {String} startCol - A Character value to set the starting column for read range. Required when readByCol is true.
 * @param {String} endCol - A Character value to set the last column for read range. Required when readByCol is true.
 * @return {Array} dataArray - An Array of data read from the given Google Sheet
 */
function getTailRows(n, workbookId, sheetName, dataRange = '', byCol = false, startCol = '', endCol = '') {
  try {
    const dataArray = readRecord(workbookId, sheetName, dataRange, false, byCol, startCol, endCol);
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
 * Return data and range from column A to the lastCol, as well as the row index.
 * @param {String} key - The key value to search for in the specified sheet.
 * @param {String} workbookId - A String value to specify the Google Sheet ID for the workbook.
 * @param {String} sheetName - A String value to specify the name of the sheet.
 * @param {String} keyCol - A Character value indicating the column where key values are stored, e.g., "A".
 * @param {String} startCol - A Character value indicating the first column in the row, e.g., "A".
 * @param {String} endCol - A Character value indicating the last column in the row, e.g., "G".
 * @return {Object} result - An object containing rowData, rowIndex, and range.
 */
function searchRecordByKey(key, workbookId, sheetName, keyCol, startCol, endCol) {
  // Read the key values from the specified column and find the rowIndex of the matching key
  const keyList = readRecord(workbookId, sheetName, '', false, true, keyCol, keyCol);
  const rowIndex = keyList.findIndex(item => item[0] === key);

  if (rowIndex === -1) {
    return { rowData: null, rowIndex: -1, range: null }; // Key not found
  }

  // Define the range and retrieve rowData for the matching row
  const range = `${sheetName}!${startCol}${rowIndex + 2}:${endCol}${rowIndex + 2}`;
  const rowData = readRecord(workbookId, sheetName, range);
  return { rowData, rowIndex: rowIndex + 2, range };
}

/**
 * Update values in a specified range of a Google Spreadsheet.
 * @param {Array} values - An array of values to be updated.
 * @param {String} workbookId - A String value specifying the Google Sheet ID for the workbook.
 * @param {String} updateRange - A String value specifying the range where the values should be updated, e.g., "Sheet1!A1:B5".
 */
function updateRecord(values, workbookId, updateRange) {
    try {
      // Create a new ValueRange object and set the values to be updated
      let valueRange = Sheets.newValueRange();
      valueRange.values = values;
  
      // Use the Sheets API to update the specified range with the new values
      Sheets.Spreadsheets.Values.update(valueRange, workbookId, updateRange, { valueInputOption: "RAW" });
    } catch (err) {
      console.log('Failed with error %s', err.message);
    }
}
 
/**
 * Delete a record by key value from a Google Spreadsheet.
 * @param {String} key - A unique identifier to specify the record to be deleted.
 * @param {String} keyCol - A Character value indicating the column where key values are stored, e.g., "A".
 */
function deleteRecord(key, keyCol) {
  // Search for the rowIndex of the record with the specified key
  const rowIndex = searchRecordByKey(key, workbookId, sheetName, '', false, keyCol, keyCol).rowIndex;

  // Define a delete request object to remove the specified row
  const deleteRequest = {
    "deleteDimension": {
      "range": {
        "sheetId": workbookId,
        "dimension": "ROWS",
        "startIndex": rowIndex,
        "endIndex": rowIndex + 1
      }
    }
  };

  // Use the Sheets API to batch update and delete the row
  Sheets.Spreadsheets.batchUpdate({ "requests": [deleteRequest] }, workbookId);
}

