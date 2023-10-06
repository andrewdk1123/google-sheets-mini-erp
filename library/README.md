# GasCrud Library

GasCrud is a Google Apps Script library that allows you to perform Create, Read, Update, and Delete (CRUD) operations on Google Spreadsheets easily.

## Features

- **Create Records:** Append new records to a Google Sheet.
- **Read Records:** Read records from a Google Spreadsheet with options for specifying the range, including headers, and more.
- **Update Records:** Update values in a specified range of a Google Spreadsheet.
- **Delete Records:** Delete rows by matching a key value in a specified column.

## Getting Started

To use this library, you can follow these steps:

1. **Create the Library**:
   - Open your Google Apps Script project at [https://script.google.com](https://script.google.com)
   - Click on "New project" in the top menu.
   - Copy and paste Crud.js file
   - Click on "Deploy" and "New deployment"
   - Deploy as a library
   - Go to Project Settings on the left panel and copy "Script ID"

2. **Import the Library**:
   - Create a new Google Sheets document
   - Click on "Extensions" in the top menu and select "Apps Script".
   - Click "+" button next to "Libraries"
   - In the "Script ID" field, paste the script ID of the library you created in the first step. 
   - Click "Add a Version" and select the latest version.
   - Click "Save."

3. **Usage**:
   - You can call the library functions in your Google Apps Script project by using the library's namespace (e.g., `GasCrud.createRecord(...)`).

## Functions

Here's a brief overview of the functions provided by this library:

- `createRecord(spreadsheetId, sheetName, data)`: Appends a new record to a specified sheet in a Google Spreadsheet.

- `readRecord(spreadsheetId, sheetName, readRange, includeHeader, readByColumn, firstColumn, lastColumn)`: Reads records from a Google Spreadsheet, allowing you to specify various options.

- `generateKey()`: Generates a unique key value to specify a record.

- `isValidKey(keyValue, spreadsheetId, sheetName, keyCol)`: Validates whether a given key value exists in a specified column of a Google Spreadsheet.

- `isInt(value)`: Checks if a value is an integer.

- `getTailRows(n, spreadsheetId, sheetName, firstCol, lastCol)`: Returns the last `n` records from a specified sheet, optionally specifying columns.

- `searchRecordByKey(key, spreadsheetId, sheetName, keyCol, firstCol, lastCol)`: Searches for a row with a matching key value and retrieves its data, row index, and range.

- `updateRecord(spreadsheetId, sheetName, headerArray, range, valueObject)`: Updates values in a specified range of a Google Spreadsheet, allowing you to provide values by column name.

- `deleteRecord(spreadsheetId, sheetName, key)`: Deletes a row in a Google Spreadsheet by matching a key value in a specified column.

## Demo Google Sheet

You can access a demo Google Sheet to test and experiment with this library.

[Open Demo Google Sheet](https://docs.google.com/spreadsheets/d/18grurtwkjYCNo2OoANzt6Dr2Q2H4fpHCv5MT9EoiNz4/edit?usp=drive_link)
