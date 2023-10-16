# Google Sheets CRUD Library

A Google Apps Script library for Create, Read, Update, and Delete (CRUD) operations in Google Sheets. This library provides a set of functions to interact with Google Sheets, making it easy to manage data in your spreadsheet.

## Features

- **Create Records:** Append new records to a Google Sheet.
- **Read Records:** Read records from a Google Sheet and returns only non-empty cells, with options excluding headers.
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

- **`createRecord(spreadsheetId, sheetName, data)`**:
  - Append a new record to a Google Sheet.

- **`readRecord(spreadsheetId, sheetName, includeHeader, firstColumn, lastColumn)`**:
  - Read records from a Google Sheet and return only non-empty cells. You can choose to include or exclude headers in the result.

- **`updateRecord(spreadsheetId, sheetName, headerArray, range, valueObject)`**:
  - Update values in a specified range of a Google Spreadsheet. The `headerArray` should match the actual column names, and `valueObject` should contain the values to replace with.

- **`deleteRecord(spreadsheetId, sheetName, key)`**:
  - Delete rows by matching a key value in a specified column.

- **Additional Functions**:
  - This library also includes other helpful functions for generating keys, validating keys, and more. Refer to the library source code for details on each function.

## Demo Google Sheet

You can access a demo Google Sheet to test and experiment with this library.

[Open Demo Google Sheet](https://docs.google.com/spreadsheets/d/18grurtwkjYCNo2OoANzt6Dr2Q2H4fpHCv5MT9EoiNz4/edit?usp=drive_link)
