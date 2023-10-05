/**
 * Test cases for the functions in Crud.js
 * By: andrewdklee.com
 * Github: https:github.com/andrewdk1123/google-sheets-crud-app
 */

// Set constants
const SPREADSHEET = "18grurtwkjYCNo2OoANzt6Dr2Q2H4fpHCv5MT9EoiNz4";
const SHEET_NAME = "Test Sheet";
const KEY_COL = "A"

// Test cases for the generateKey function
function testGenerateKey() {
  // Test case 1: Generate a key
  console.log('Test case 1:');
  const key1 = GasCrud.generateKey();
  console.log(`Generated Key 1: ${key1}`);
  
  // Test case 2: Generate another key
  console.log('Test case 2:');
  const key2 = GasCrud.generateKey();
  console.log(`Generated Key 2: ${key2}`);
  
  // Test case 3: Generate multiple keys
  console.log('Test case 3:');
  for (let i = 0; i < 5; i++) {
    const key = GasCrud.generateKey();
    console.log(`Generated Key ${i + 3}: ${key}`);
  }
  
  console.log('Test cases completed.');
}

// Test the createRecord function
function testCreateRecord() {
  try{
    // Case 1: Using an array of values
    const dataArray = [GasCrud.generateKey(), "John", "Doe", "Bloomington", "IN"];
    GasCrud.createRecord(SPREADSHEET, SHEET_NAME, dataArray);

    // Case 2: Using an object with key-value pairs
    const dataObject = {
      id: GasCrud.generateKey(),
      firstName: "Jane",
      lastName: "Doe",
      city: "Indianapolis",
      state: "IN"
    };
    GasCrud.createRecord(SPREADSHEET, SHEET_NAME, dataObject);

    // Case 3: The number of attributes in an Object is smaller than expected
    const smallObject = {
      id: GasCrud.generateKey(),
      firstName: "Mary",
      lastName: "Major"
    };
    GasCrud.createRecord(SPREADSHEET, SHEET_NAME, smallObject);
  
    Logger.log("createRecord test cases completed successfully.");
  } catch (err) {
    console.error("Error in testCreateRecord:", err.message);
  }
}

// Helper function to assert values
function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message);
  }
}

// Test readRecord
function testReadRecord() {

  const readRange = "A1:E3";
  const startColumn = 'A';
  const endColumn = 'E';
  
  // Test reading data without including the header row.
  const expectedArrayWithoutHeader = [
    ["7d62d7ed-b89a-4a8d-b24f-b2900bcb5e58", "John", "Doe", "Bloomington", "IN"],
    ["a12a0088-3021-4eaf-b3b7-54e6eea3be7f", "Jane", "Doe", "Indianapolis", "IN"]
  ];
  const dataArrayWithoutHeader = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, readRange, false);
  assertEqual(dataArrayWithoutHeader, expectedArrayWithoutHeader, "Test case: Reading data without header.");
  
  // Test reading data including the header row.
  const expectedArrayWithHeader = [
    ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"],
    ["7d62d7ed-b89a-4a8d-b24f-b2900bcb5e58", "John", "Doe", "Bloomington", "IN"],
    ["a12a0088-3021-4eaf-b3b7-54e6eea3be7f", "Jane", "Doe", "Indianapolis", "IN"]
  ];
  const dataArrayWithHeader = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, readRange, true);
  assertEqual(dataArrayWithHeader, expectedArrayWithHeader, "Test case: Reading data with header.");
  
  // Test reading data by columns without including the header row.
  const expectedColumnDataWithoutHeader = [
    ["7d62d7ed-b89a-4a8d-b24f-b2900bcb5e58", "John", "Doe", "Bloomington", "IN"],
    ["a12a0088-3021-4eaf-b3b7-54e6eea3be7f", "Jane", "Doe", "Indianapolis", "IN"]
  ];
  const columnDataArrayWithoutHeader = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, '', false, true, startColumn, endColumn);
  assertEqual(columnDataArrayWithoutHeader, expectedColumnDataWithoutHeader, "Test case: Reading column data without header.");
  
  // Test reading data by columns including the header row.
  const expectedColumnDataWithHeader = [
    ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"],
    ["7d62d7ed-b89a-4a8d-b24f-b2900bcb5e58", "John", "Doe", "Bloomington", "IN"],
    ["a12a0088-3021-4eaf-b3b7-54e6eea3be7f", "Jane", "Doe", "Indianapolis", "IN"]
  ];
  const columnDataArrayWithHeader = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, '', true, true, startColumn, endColumn);
  assertEqual(columnDataArrayWithHeader, expectedColumnDataWithHeader, "Test case: Reading column data with header.");
}

// Test cases for the checkId function
function testIsValidKey() {
  
  // Test case 1: Check for an existing key
  const existingKey = '7d62d7ed-b89a-4a8d-b24f-b2900bcb5e58';
  console.log('Test case 1:');
  console.log(`Checking for an existing key: ${existingKey}`);
  const result1 = GasCrud.isValidKey(existingKey, SPREADSHEET, SHEET_NAME, KEY_COL);

  assertEqual(result1, true, "Test case: Check for an existing key.");
  
  // Test case 2: Check for a non-existing key
  const nonExistingKey = 'pseudo-key';
  console.log('Test case 2:');
  console.log(`Checking for a non-existing key: ${nonExistingKey}`);
  const result2 = GasCrud.isValidKey(nonExistingKey, SPREADSHEET, SHEET_NAME, KEY_COL);

  assertEqual(result2, false, "Test case: Check for a non-existing key.");
  
  console.log('Test cases completed.');
}
  

// Test getTailRows
function testGetTailRows() {
  try {
    // Test case1: Retrieve the last 2 rows of data by columns from "A" to "C"
    const result = GasCrud.getTailRows(2, SPREADSHEET, SHEET_NAME, "A", "C");
    console.log("Test Case 2 Result:", result);

    // Test case2: Retrieve the last "2" rows of data by columns from "A" to "C"
    const result2 = GasCrud.getTailRows("2", SPREADSHEET, SHEET_NAME, "A", "C");
    console.log("Test Case 2 Result:", result2);
  
  } catch (err) {
    console.error("Error in testGetTailRows:", err.message);
  }
}

// Test cases for the searchRecordByKey function
function testSearchRecordByKey() {
  
  const firstCol = 'A';
  const lastCol = 'E';

  // Test case 1: Search for an existing record by key
  const existingKey = "c5f3ef0b-6574-488a-9f81-9c0bb8cc3173";
  console.log('Test case 1:');
  console.log(`Searching for an existing record with key: ${existingKey}`);
  const result1 = GasCrud.searchRecordByKey(existingKey, SPREADSHEET, SHEET_NAME, KEY_COL, firstCol, lastCol);
  console.log('Result:', result1);
  
  // Test case 2: Search for a non-existing record by key
  const nonExistingKey = 'pseudo-key';
  console.log('Test case 2:');
  console.log(`Searching for a non-existing record with key: ${nonExistingKey}`);
  const result2 = GasCrud.searchRecordByKey(nonExistingKey, SPREADSHEET, SHEET_NAME, KEY_COL, firstCol, lastCol);
  console.log('Result:', result2);
  
  console.log('Test cases completed.');
}

// Test case function for updateRecord function.
function testUpdateRecord() {

  const headerArray = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  const keyLastRow = GasCrud.getTailRows(1, SPREADSHEET, SHEET_NAME, 'A', 'E')[0][0];
  const updateRange = GasCrud.searchRecordByKey(keyLastRow, SPREADSHEET, SHEET_NAME, KEY_COL, 'A', 'E').range; 
  const dataObject = {
    "ID": keyLastRow,
    "FIRST NAME": "James",
    "LAST NAME": "Doe",
    "CITY": "Seoul",
    "STATE": "Korea"
  };

  // Call the updateRecord function
  GasCrud.updateRecord(SPREADSHEET, SHEET_NAME, headerArray, updateRange, dataObject);

  // Retrieve the updated values from the spreadsheet
  const updatedValues = GasCrud.searchRecordByKey(keyLastRow, SPREADSHEET, SHEET_NAME, KEY_COL, 'A', 'E').rowData;

  // Replace these assertions with your specific test case expectations
  const expectedValues = [[keyLastRow, "James", "Doe", "Seoul", "Korea"]];
  assertEqual(updatedValues, expectedValues, "Values were not updated correctly.");
}

function testDeleteRecord() {

  const keyToDelete = GasCrud.getTailRows(1, SPREADSHEET, SHEET_NAME, 'A', 'E')[0][0];

  console.log(`Deleting row with key: ${keyToDelete}`);
  GasCrud.deleteRecord(SPREADSHEET, SHEET_NAME, keyToDelete);
  console.log('Test case completed.');
}