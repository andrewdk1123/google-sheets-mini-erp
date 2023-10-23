/**
 * Part of server-side codes for Google Sheets sales management webapp with CRUD operations.
 * This script is designed to provide server-side functionality for a web application that manages sales data in a Google Sheets document and includes constants for defining settings on Google Sheets and functions to display the web interface.
 * By: andrewdklee.com
 * Github: https://github.com/andrewdk1123/google-sheets-mini-erp
 */

// Set Constants
const SPREADSHEET = "1qAWHt4JsQxZsUnuV_MI9l_X8zB20fHG9GuvYc6ZDosw";
const FORM = "1CAqPut9N5iOxG8-vJYRoVOoqkcTzULUKtODp_ABupEE";

const INVOICE = "Invoices";
const INVOICE_KEY_COL = "A";
const INVOICE_FIRST_COL = "A";
const INVOICE_LAST_COL = "N";

const PO = "Production Order";
const PO_KEY_COL = "A";
const PO_FIRST_COL = "A";
const PO_LAST_COL = "I";

const CUSTOMER_INFO = "Customer Info";
const CUSTOMER_KEY_COL = "B";
const CUSTOMER_FIRST_COL = "A";
const CUSTOMER_LAST_COL = "B";

const PRODUCT_INFO = "Product Info";
const PRODUCT_KEY_COL = "E";
const PRODUCT_FIRST_COL = "A";
const PRODUCT_LAST_COL = "M";
const PRODUCT_RESPONSE_URL = "B";

// Display HTML page.
function doGet(request) {
  let html = HtmlService.createTemplateFromFile('Index').evaluate();
  let htmlOutput = HtmlService.createHtmlOutput(html);
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');

  return htmlOutput;
}

// Include HTML parts.
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Formatting Date values to a String with KST (Korea Standard Time).
 * @param {Date} date - The Date object to be formatted.
 * @returns {string} formattedDate - The formatted date in the "yyyy-MM-dd" format with KST.
 */
function convertDateToYYYYMMDD(date) {
  const formattedDate = Utilities.formatDate(date, "Asia/Seoul", "yyyy-MM-dd").toString();
  return formattedDate;
}

/**
 * Get an Array of customer Objects with id and name attributes from the Customer Info sheet.
 * @return {Array} customerList - An Array of objects containing customer Objects.
 */
function getCustomerList() {
  const customerData = GasCrud.readRecord(SPREADSHEET, CUSTOMER_INFO, false, CUSTOMER_FIRST_COL, CUSTOMER_LAST_COL);
  const customerList = customerData.map(function(row) {
    return {
      id: row[1],
      name: row[0]
    }
  });

  return customerList;
}

// Declare a global variable to store customerList.
var customers = getCustomerList();

/**
 * Get an Array of product data containing id, name, price, and number of product configuring items for a given customer ID.
 * @param {string} selectedCustomerId - Customer ID provided from customerSelect form.
 * @return {Array} productList - An array of Objects containing product data.
 */
function getProductList(selectedCustomerId) {
  const prodData = GasCrud.readRecord(SPREADSHEET, PRODUCT_INFO, false, PRODUCT_FIRST_COL, PRODUCT_LAST_COL);

  const productList = prodData
    .filter((row) => row[2] === selectedCustomerId)
    .map((row) => ({
      id: row[4],
      name: row[5],
      price: row[7],
      numChikuwa: row[9],
      numJakoten: row[10],
      numKamaboko: row[11],
      numNarutomaki: row[12]
    }));

  return productList;
}

/**
 * Triggered when the Google Forms for product registration is submitted.
 * Generates a unique identifier for the newly submitted product, and maps customer ID for the submitted customer name.
 * Enter Google Forms response edit url into the Google Sheets.
 * @param {Object} event - The event object triggered by the form submission.
 */
function onFormSubmit(event) {
  
  // Set an identifier for the new submission.
  setProductId();

  // Find customerId for submitted customerName.
  var customerName = event.values[1]; 
  var customerId = getCustomerId(customerName);
    
  if (customerId !== null) {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
    const sheet = spreadsheet.getSheetByName(PRODUCT_INFO);
    const lastRow = sheet.getLastRow();
    const customerIDColumn = 3; // Google Sheets column indexing starts from one.
    sheet.getRange(lastRow, customerIDColumn).setValue(customerId);
  }

  // Set response url for the submission.
  setResponseUrl();
}

/**
 * Get customer ID based on customer name values from Google Forms.
 * @param {String} customerName - Name of the customer (organization name).
 */
function getCustomerId(customerName) {
  for (const customerId in customers) {
    if (customers[customerId].name === customerName) {
      return customers[customerId].id;
    }
  }
}

// Set Product Id for newly submitted record in Product Info sheet.
function setProductId() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(PRODUCT_INFO);
  const productId = GasCrud.generateKey();
  const lastRow = sheet.getLastRow();
  const productIDColumn = 5; // Google Sheets column indexing starts from one.
  
  // Write the Product ID to the last row in the "Product ID" column.
  sheet.getRange(lastRow, productIDColumn).setValue(productId);
}

// Set Google Forms url for response editing.
function setResponseUrl() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(PRODUCT_INFO);
  const lastRow = sheet.getLastRow(); 
  const urlCol = 2; // Google Sheets column indexing starts from one.
  const timestamp = sheet.getSheetValues(lastRow, 1, 1, 1)[0][0];
  const form = FormApp.openById(FORM);
  const formResponse = form.getResponses(timestamp)[0];
  sheet.getRange(lastRow, urlCol).setValue(formResponse.getEditResponseUrl())
}
