# Google Forms Product Registration

This directory contains Google Apps Script codes for a product registration utilizing Google Forms and Google Spreadsheet integration. It retrieves customer names from a reference sheet and populates a dropdown list within the Google Form. This, in turn, validates customer names and simplifies the registration process for client-specific products that will be used in [SalesWebApp](https://github.com/andrewdk1123/google-sheets-mini-erp).

## Code Description

- `onOpen()`: This function is triggered when the form is opened and it calls `populateCustomerDropdown()` to populate the customer dropdown.

- `getCustomerNames()`: Retrieves customer names from the Google Spreadsheet. It utilizes the `GasCrud` library to read data from the spreadsheet.

- `populateCustomerDropdown()`: Populates a dropdown list in the Google Form with customer names. It sets retrieved customer names from `getCustomerNames()` as choice in the dropdown.

## Setup

Before using this code, you need to set the followings in the Google Contacts.

- The Contacts owner may delegate access to the accounts to whom who are actually manage sales connections. 

- Sales representative have to add Contacts with a custom field as pre-defined (e.g., key: Connections, values: Sales). Then the customer lists will be retrieved from the Google Contacts to the Google Sheets. For more information about customer list retrieval, please see `getSalesConnections()` and `refreshCustomerInfo()` at [Code.js](../SalesWebApp/Code.js) in the SalesWebApp.

- Do not limit the number of submissions and allow response editing. This will allow sales info manager to register multiple products and update product info.
![](https://github.com/andrewdk1123/google-sheets-mini-erp/blob/main/setup-google-forms.jpg)

Also set up constants at the beginning of the script:

- `FORM_ID`: The ID of the Google Form you want to populate with customer names.

- `SPREADSHEET_ID`: The ID of the Google Spreadsheet where customer information is stored.

- `REFERENCE_SHEET`: The name of the sheet in the spreadsheet containing customer information.

## Usage

1. Ensure that you have the necessary permissions to access and modify the Google Form and Spreadsheet specified in the constants.

2. Set the constants at the beginning of the script with the appropriate IDs and sheet names.

3. Share the Google Form with users who need to register products, and the responses will be used in the [SalesWebApp](https://github.com/andrewdk1123/google-sheets-mini-erp).
