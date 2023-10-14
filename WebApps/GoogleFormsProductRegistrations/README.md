# Google Forms Product Registration

This directory contains Google Apps Script code for registering products in a Google Spreadsheet using Google Forms.

## Overview

This Google Apps Script is part of the [Google Sheets Mini ERP project](https://github.com/andrewdk1123/google-sheets-mini-erp) by [andrewdklee.com](https://andrewdklee.com/). It enables you to create a registration form that populates a Google Form dropdown list with customer names from a Google Spreadsheet.

## Code Description

- `onOpen()`: This function is triggered when the form is opened and it calls `populateCustomerDropdown()` to populate the customer dropdown.

- `getCustomerNames()`: Retrieves customer names from the Google Spreadsheet. It utilizes the `GasCrud` library to read data from the spreadsheet.

- `populateCustomerDropdown()`: Populates a dropdown list in the Google Form with customer names. It retrieves customer names using `getCustomerNames()` and sets them as choices in the dropdown.

## Setup

Before using this code, you need to set the followings in the Google Contacts.

- The Contacts owner may delegate access to the accounts to whom who are actually manage sales connections. 

- Sales representative have to add Contacts with a custom field as pre-defined (e.g., key: Connections, values: Sales). Then the customer lists will be retrieved from the Google Contacts to the Google Sheets. For more information about customer list retrieval, please see `getSalesConnections()` and `refreshCustomerInfo()` at [Code.js](../SalesWebApp/Code.js) in the SalesWebApp.

Also set up constants at the beginning of the script:

- `FORM_ID`: The ID of the Google Form you want to populate with customer names.

- `SPREADSHEET_ID`: The ID of the Google Spreadsheet where customer information is stored.

- `REFERENCE_SHEET`: The name of the sheet in the spreadsheet containing customer information.

## Usage

1. Ensure that you have the necessary permissions to access and modify the Google Form and Spreadsheet specified in the constants.

2. Set the constants at the beginning of the script with the appropriate IDs and sheet names.

3. Share the Google Form with users who need to register products, and they will see the customer names in the dropdown.

## License

This code is provided under the terms of the [LICENSE](../LICENSE) included in this repository.

For more information and updates, please visit the [Google Sheets Mini ERP project on GitHub](https://github.com/andrewdk1123/google-sheets-mini-erp).

For support and inquiries, please reach out to [andrewdk1123@gmail.com](andrewdk1123@gmail.com).

Happy product registration!
