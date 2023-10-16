/**
 * Test cases for the functions in Crud.js
 * By: andrewdklee.com
 * Github: https:github.com/andrewdk1123/google-sheets-crud-app
 */

// Set constants
const SPREADSHEET = "18grurtwkjYCNo2OoANzt6Dr2Q2H4fpHCv5MT9EoiNz4";
const SHEET_NAME = "Test Sheet";
const KEY_COL = "A"

// Test the createRecord function
function testCreateRecord() {
  try{
    // Case 1: Using an array of values
    const dataArray = [GasCrud.generateKey(), "John", "Doe", "Mundelein", "IL"];
    GasCrud.createRecord(SPREADSHEET, SHEET_NAME, dataArray);

    // Case 2: Using an object with key-value pairs
    const dataObject = {
      id: GasCrud.generateKey(),
      firstName: "Jane",
      lastName: "Doe",
      city: "Chicago",
      state: "IL"
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
function assertEqual(actualArray, expectedArray, message) {
  if (JSON.stringify(actualArray) !== JSON.stringify(expectedArray)) {
    throw new Error(message);
  }
}

// Test readRecord
function testReadRecord() {

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstColumn = 'A';
  const lastColumn = 'E';
  const firstKey = GasCrud.generateKey();
  const secondKey = GasCrud.generateKey();
  const thirdKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);

  const secondRow = {
    id: secondKey,
    firstName: "Jane",
    lastName: "Doe",
    city: "Chicago",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, secondRow);

  const thirdRow = {
    id: thirdKey,
    firstName: "Mary",
    lastName: "Major"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, thirdRow);

  // Test reading data.
  const dataArray = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, true, firstColumn, lastColumn);
  
  const expectedArray = [
    ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"],
    [firstKey, "John", "Doe", "Mundelein", "IL"],
    [secondKey, "Jane", "Doe", "Chicago", "IL"],
    [thirdKey, "Mary", "Major", "", ""]
  ];

  assertEqual(dataArray, expectedArray, "Something went wrong...");
}

// Test cases for the checkId function
function testIsValidKey() {
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);
  
  // Test case 1: Check for an existing key
  const existingKey = firstKey;
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
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstKey = GasCrud.generateKey();
  const secondKey = GasCrud.generateKey();
  const thirdKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);

  const secondRow = {
    id: secondKey,
    firstName: "Jane",
    lastName: "Doe",
    city: "Chicago",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, secondRow);

  const thirdRow = {
    id: thirdKey,
    firstName: "Mary",
    lastName: "Major"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, thirdRow);

  try {
    // Test case 1: Retrieve the last 2 rows of data by columns from "A" to "C"
    const result = GasCrud.getTailRows(2, SPREADSHEET, SHEET_NAME, "A", "C");
    console.log("Test Case 1 Result:", result);

    // Test case 2: Retrieve the last "2" rows of data by columns from "A" to "C"
    const result2 = GasCrud.getTailRows("2", SPREADSHEET, SHEET_NAME, "A", "C");
    console.log("Test Case 2 Result:", result2);

    // Test case 3: Retrieve the last 5 rows, when there are only 3.
    const result3 = GasCrud.getTailRows(5, SPREADSHEET, SHEET_NAME, "A", "C");
    console.log("Test Case 3 Result:", result3);
  
  } catch (err) {
    console.error("Error in testGetTailRows:", err.message);
  }
}

// Test cases for the searchRecordByKey function
function testSearchRecordByKey() {
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstKey = GasCrud.generateKey();
  const secondKey = GasCrud.generateKey();
  const thirdKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);

  const secondRow = {
    id: secondKey,
    firstName: "Jane",
    lastName: "Doe",
    city: "Chicago",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, secondRow);

  const thirdRow = {
    id: thirdKey,
    firstName: "Mary",
    lastName: "Major"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, thirdRow);
 
  const firstCol = 'A';
  const lastCol = 'E';

  // Test case 1: Search for an existing record by key
  const existingKey = firstKey;
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
    
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstKey = GasCrud.generateKey();
  const secondKey = GasCrud.generateKey();
  const thirdKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);

  const secondRow = {
    id: secondKey,
    firstName: "Jane",
    lastName: "Doe",
    city: "Chicago",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, secondRow);

  const thirdRow = {
    id: thirdKey,
    firstName: "Mary",
    lastName: "Major"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, thirdRow);
 
  const updateRange = GasCrud.searchRecordByKey(firstKey, SPREADSHEET, SHEET_NAME, KEY_COL, 'A', 'E').range; 
  const dataObject = {
    "ID": "Temporary-ID-for-test",
    "FIRST NAME": "James",
    "LAST NAME": "Doe",
    "CITY": "Seoul",
    "STATE": "Korea"
  };

  // Call the updateRecord function
  GasCrud.updateRecord(SPREADSHEET, SHEET_NAME, headers, updateRange, dataObject);

  // Retrieve the updated values from the spreadsheet
  const updatedValues = [GasCrud.searchRecordByKey("Temporary-ID-for-test", SPREADSHEET, SHEET_NAME, KEY_COL, 'A', 'E').rowData];

  // Replace these assertions with your specific test case expectations
  const expectedValues = [["Temporary-ID-for-test", "James", "Doe", "Seoul", "Korea"]];
  assertEqual(updatedValues, expectedValues, "Values were not updated correctly.");
}

function testDeleteRecord() {
      
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Clear all existing data
  sheet.clear();

  // Restore the header row
  const headers = ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"];
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, headers);

  // Set test case
  const firstKey = GasCrud.generateKey();
  const secondKey = GasCrud.generateKey();
  const thirdKey = GasCrud.generateKey();

  const firstRow = {
    id: firstKey,
    firstName: "John",
    lastName: "Doe",
    city: "Mundelein",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, firstRow);

  const secondRow = {
    id: secondKey,
    firstName: "Jane",
    lastName: "Doe",
    city: "Chicago",
    state: "IL"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, secondRow);

  const thirdRow = {
    id: thirdKey,
    firstName: "Mary",
    lastName: "Major"
  }
  GasCrud.createRecord(SPREADSHEET, SHEET_NAME, thirdRow);

  console.log(`Deleting row with key: ${firstKey}`);
  GasCrud.deleteRecord(SPREADSHEET, SHEET_NAME, firstKey);

  // Test reading data.
  const dataArray = GasCrud.readRecord(SPREADSHEET, SHEET_NAME, true, 'A', 'E');
  
  const expectedArray = [
    ["ID", "FIRST NAME", "LAST NAME", "CITY", "STATE"],
    [secondKey, "Jane", "Doe", "Chicago", "IL"],
    [thirdKey, "Mary", "Major", "", ""]
  ];

  assertEqual(dataArray, expectedArray, "Something went wrong...");
}