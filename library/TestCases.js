/**
 * Test cases for the functions in Crud.js
 * By: andrewdklee.com
 * Github: https:github.com/andrewdk1123/google-sheets-crud-app
 */

// Test cases for CreateRecord
function testCreateRecord() {
  // Test case 1: Insert a new row with sample data
  const workbookId = 'your_workbook_id';
  const insertRange = 'Sheet1!A2:G';
  const valueArray = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6', 'Value7'];

  console.log('Test case 1:');
  console.log('Inserting a new row with sample data...');
  createRecord(workbookId, insertRange, valueArray);

  // Test case 2: Insert a new row with empty data
  const emptyValueArray = [];

  console.log('Test case 2:');
  console.log('Inserting a new row with empty data...');
  createRecord(workbookId, insertRange, emptyValueArray);

  // Add more test cases as needed

  console.log('Test cases completed.');
}

// Test cases for the checkId function
function testCheckId() {
  const workbookId = 'your_workbook_id'; // Replace with the actual workbook ID
  const sheetName = 'Sheet1'; // Replace with the actual sheet name
  const keyCol = 'A'; // Replace with the actual key column

  // Test case 1: Check for an existing key
  const existingKey = '123456'; // Replace with an existing key in your sheet
  console.log('Test case 1:');
  console.log(`Checking for an existing key: ${existingKey}`);
  const result1 = checkId(existingKey, workbookId, sheetName, keyCol);
  console.log('Result:', result1);

  // Test case 2: Check for a non-existing key
  const nonExistingKey = '987654'; // Replace with a key that doesn't exist in your sheet
  console.log('Test case 2:');
  console.log(`Checking for a non-existing key: ${nonExistingKey}`);
  const result2 = checkId(nonExistingKey, workbookId, sheetName, keyCol);
  console.log('Result:', result2);

  // Add more test cases as needed

  console.log('Test cases completed.');
}

// Test readRecord
function testReadRecord() {
  // Replace these values with your own Google Sheet ID, sheet name, and range.
  const workbookId = "YOUR_WORKBOOK_ID";
  const sheetName = "Sheet1";
  const readRange = "A1:C5";


  // Test reading data without including the header row.
  const dataArray = readRecord(workbookId, sheetName, readRange, false);
  Logger.log("Data Array (without header):");
  Logger.log(dataArray);


  // Test reading data including the header row.
  const dataArrayWithHeader = readRecord(workbookId, sheetName, readRange, true);
  Logger.log("Data Array (with header):");
  Logger.log(dataArrayWithHeader);


  // Test reading data by columns without including the header row.
  const startColumn = 'A';
  const endColumn = 'C';
  const columnDataArray = readRecord(workbookId, sheetName, readRange, false, true, startColumn, endColumn);
  Logger.log("Column Data Array (without header):");
  Logger.log(columnDataArray);


  // Test reading data by columns including the header row.
  const columnDataArrayWithHeader = readRecord(workbookId, sheetName, readRange, true, true, startColumn, endColumn);
  Logger.log("Column Data Array (with header):");
  Logger.log(columnDataArrayWithHeader);
}

// Test getRailRows
function testGetTailRows() {
  try {
    const wb = "YOUR_WORKBOOK_ID";
    const sheet = "Sheet1";


    // Test case 1: Retrieve the last 3 rows of data in a range "A1:C5" without reading by columns
    const result1 = getTailRows(3, wb, sheet, "A1:C5");
    console.log("Test Case 1 Result:", result1);


    // Test case 2: Retrieve the last 2 columns of data by columns from "A" to "C"
    const result2 = getTailRows(2, wb, sheet, "", true, "A", "C");
    console.log("Test Case 2 Result:", result2);


  } catch (err) {
    console.error("Error in testGetTailRows:", err.message);
  }
}

// Test cases for the searchRecordByKey function
function testSearchRecordByKey() {
  const workbookId = 'your_workbook_id'; // Replace with the actual workbook ID
  const sheetName = 'Sheet1'; // Replace with the actual sheet name
  const keyCol = 'A'; // Replace with the actual key column
  const startCol = 'A'; // Replace with the actual start column
  const endCol = 'G'; // Replace with the actual end column

  // Test case 1: Search for an existing record by key
  const existingKey = '123456'; // Replace with an existing key in your sheet
  console.log('Test case 1:');
  console.log(`Searching for an existing record with key: ${existingKey}`);
  const result1 = searchRecordByKey(existingKey, workbookId, sheetName, keyCol, startCol, endCol);
  console.log('Result:', result1);

  // Test case 2: Search for a non-existing record by key
  const nonExistingKey = '987654'; // Replace with a key that doesn't exist in your sheet
  console.log('Test case 2:');
  console.log(`Searching for a non-existing record with key: ${nonExistingKey}`);
  const result2 = searchRecordByKey(nonExistingKey, workbookId, sheetName, keyCol, startCol, endCol);
  console.log('Result:', result2);

  // Add more test cases as needed

  console.log('Test cases completed.');
}

// Test case function for updateRecord function.
function testUpdateRecord() {
  try {
    const workbookId = 'YOUR_WORKBOOK_ID_HERE';
    const updateRange = 'Sheet1!A1:B5';

    // Test case 1: Update values in a specified range with valid data.
    const values1 = [
      ['New Value 1', 'New Value 2'],
      ['Updated Value 1', 'Updated Value 2'],
      ['Modified Value 1', 'Modified Value 2'],
      ['Changed Value 1', 'Changed Value 2'],
      ['Revised Value 1', 'Revised Value 2'],
    ];
    updateRecord(values1, workbookId, updateRange);
    console.log('Test Case 1: Values updated successfully.');

    // Test case 2: Update values in a specified range with empty data.
    const values2 = [
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
    ];
    updateRecord(values2, workbookId, updateRange);
    console.log('Test Case 2: Empty values updated successfully.');
  } catch (err) {
    console.error('Error in testUpdateRecord:', err.message);
  }
}  

// Test case function for deleteRecord function.
function testDeleteRecord() {
  try {
    const keyToDelete = 'c0003';
    const keyCol = 'A';

    // Test case 1: Delete a record with a valid key.
    deleteRecord(keyToDelete, keyCol);
    console.log(`Test Case 1: Record with key '${keyToDelete}' deleted.`);

    // Test case 2: Try to delete a record with an invalid key.
    const invalidKeyToDelete = 'c9999';
    deleteRecord(invalidKeyToDelete, keyCol);
    console.log(`Test Case 2: Attempted to delete record with key '${invalidKeyToDelete}'.`);
  } catch (err) {
    console.error('Error in testDeleteRecord:', err.message);
  }
}
