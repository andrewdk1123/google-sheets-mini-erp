/**
 * Google Apps Script codes to register products using Google Forms
 * By: andrewdklee.com
 * Github: https:github.com/andrewdk1123/google-sheets-mini-erp
 * 
 * @OnlyCurrentDoc
 * The above comment directs Apps Script to limit the scope of file access for this codes only.
 * It specifies that the codes will only attempt to read or modify the files in which the functions below are used, and not all of the user's files.
 * The authorization request message presented to users will reflect this limited scope.
 */

// Set Constants
FORM_ID = "1CAqPut9N5iOxG8-vJYRoVOoqkcTzULUKtODp_ABupEE";
SPREADSHEET_ID = "1qAWHt4JsQxZsUnuV_MI9l_X8zB20fHG9GuvYc6ZDosw";
REFERENCE_SHEET = "Customer Info";
RESPONSE_SHEET = "Product Info";

/**
 * Triggered when the Google Forms for product registration is opened.
 * Populates dropdown for customer selection.
 */
function onOpen() {
  populateCustomerDropdown();
}

/**
 * Get customer names from the Google Spreadsheet
 * @returns {Array} customerNames - A list of customer names
 */
function getCustomerNames() {
  const customerNames = GasCrud.readRecord(SPREADSHEET_ID, REFERENCE_SHEET, false, 'A', 'A');
  
  return customerNames;
}

// Populate the customer dropdown list
function populateCustomerDropdown() {
  const form = FormApp.openById(FORM_ID);
  const customerNames = getCustomerNames(); 

  const item = form.getItems(FormApp.ItemType.LIST);
  const dropdown = item[0].asListItem();
  let choices = [];

  customerNames.forEach(function(customer) {
    choices.push(customer[0]);
  });

  dropdown.setChoiceValues(choices);
}

