# Google Sheets Mini ERP

Welcome to the Google Sheets Mini ERP repository. This project was created to support my family's small fishcake factory in South Korea. The factory's bookkeepers handle tasks such as managing registered customers and products, taking orders, and making production orders on a daily basis. Unfortunately, maintaining data integrity can be challenging due to the manual nature of these operational processes. To address this issue, I have developed a library that enables CRUD (Create, Read, Update, Delete) operations on Google Sheets. Additionally, I have created a web application that streamlines the factory's operations. I hope this can provide a solution to anyone facing similar challenges.

## Table of Contents

- [Overview](#overview)
- [GasCrud](#gascrud)
  - [Getting Started](#gettingstarted)
  - [Main Features](#mainfeatures)
  - [Functions](#functions)
- [Google Forms Product Registration](#productregistration)
  - [Code Description](#codedescription)
  - [Setup](#setup)
- [SalesWebApp](#saleswebapp)
  - [Configurations](#configurations)
  - [Server-Side Script](#server-side-script)
    - [Invoice Tab](#invoicestab)
    - [Production Order Tab](#productionordertab)
    - [Sales Info Tab](#salesinfotab)
  - [Web Interface](#web-interface)
- [Contributing](#contributing)
- [License](#license)

## Overview

The project consists of two main components: GasCrud and SalesWebApp. GasCrud is the Google Apps Script library designed for CRUD (Create, Read, Update, Delete) operations, and SalesWebApp is a web application that facilitates the daily operations in the factory.

## GasCrud

This is a Google Apps Script library for Create, Read, Update, and Delete (CRUD) operations in Google Sheets. This library provides a set of functions to interact with Google Sheets, making it easy to manage data in your spreadsheet.

### Getting Started

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

4. **Test cases**:
   - Additionally, I created some functions including test cases. You can copy codes in the `TestCases.js` and paste it in your Google Sheets Apps Script to run the codes.

### Main Features

- **Create Records:** Append new records to a Google Sheet.
- **Read Records:** Read records from a Google Sheet and returns only non-empty cells, with options excluding headers.
- **Update Records:** Update values in a specified range of a Google Spreadsheet.
- **Delete Records:** Delete rows by matching a key value in a specified column.

### Functions

Here's a brief overview of the functions provided by this library:

- **`createRecord(spreadsheetId, sheetName, data)`**:
  - Append a new record to a Google Sheet.

- **`readRecord(spreadsheetId, sheetName, includeHeader, firstColumn, lastColumn)`**:
  - Read records from a Google Sheet and return only non-empty cells. You can choose to include or exclude headers in the result.

- **`updateRecord(spreadsheetId, sheetName, range, valueObject)`**:
  - Update values in a specified range of a Google Spreadsheet. 

- **`deleteRecord(spreadsheetId, sheetName, key)`**:
  - Delete rows by matching a key value in a specified column.

- **Additional Functions**:
  - This library also includes other helpful functions for generating keys, validating keys, and more. Refer to the library source code for details on each function.

## Google Forms Product Registration

This code contains Google Apps Script codes for a product registration utilizing Google Forms and Google Spreadsheet integration. It retrieves customer names from a reference sheet and populates a dropdown list within the Google Form. This, in turn, validates customer names and simplifies the registration process for client-specific products that will be used in SalesWebApp.

### Code Description
- **`onOpen()`**: This function is triggered when the form is opened and it calls populateCustomerDropdown() to populate the customer dropdown.

- **`getCustomerNames()`**: Retrieves customer names from the Google Spreadsheet. It utilizes the GasCrud library to read data from the spreadsheet.

- **`populateCustomerDropdown()`**: Populates a dropdown list in the Google Form with customer names. It sets retrieved customer names from getCustomerNames() as choice in the dropdown.

### Setup
Before using this code, you need to set the followings in the Google Contacts.

- The Contacts owner may delegate access to the accounts to whom who are actually manage sales connections.

- Sales representative have to add Contacts with a custom field as pre-defined (e.g., key: Connections, values: Sales). Then the customer lists will be retrieved from the Google Contacts to the Google Sheets. For more information about customer list retrieval, please see getSalesConnections() and refreshCustomerInfo() at Code.js in the SalesWebApp.

- Do not limit the number of submissions and allow response editing. This will allow sales info manager to register multiple products and update product info. 

<a href="https://imgur.com/TxVAABK"><img src="https://i.imgur.com/TxVAABK.jpg" title="source: imgur.com" /></a>

Also set up constants at the beginning of the script:

`FORM_ID`: The ID of the Google Form you want to populate with customer names.

`SPREADSHEET_ID`: The ID of the Google Spreadsheet where customer information is stored.

`REFERENCE_SHEET`: The name of the sheet in the spreadsheet containing customer information.

## Sales Web App

### Configurations

Before using SalesWebApp, you should configure the following constants in the `Utilities.gs` script to match your Google Sheets setup:

- `SPREADSHEET`: The ID of your Google Sheets document.
- `FORM`: The ID of the Google Form for product registration.
- Constants related to data sheet names and column identifiers (e.g., `INVOICE`, `CUSTOMER_INFO`, `PRODUCT_INFO`).

Additionally, you may need to adjust timezone for the function `convertDateToYYYYMMDD(date)` in the Utilities.js file. It is a function to convert Date value stored in the Google Sheet into a String with KST. Feel free to adjust timezone.

```
function convertDateToYYYYMMDD(date) {
  const formattedDate = Utilities.formatDate(date, "Asia/Seoul", "yyyy-MM-dd").toString();
  return formattedDate;
}
```

### Server-Side Script

There are two server-side script files, `Utilities.js` and `Databases.js`. 

The `Utilities.js` provides the server-side functionality for handling sales data. The script includes functions for:

- Formatting date values to a string with KST (Korea Standard Time).
- Retrieving a list of customers from the Google Sheets document.
- Mapping customer IDs for submitted customer names from Google Forms.
- Generating unique product IDs and associating them with customer IDs.
- Splitting product configurations and writing them to the sheet.
- Setting Google Forms URLs for response editing.

The `Databases.js` provides server-side functionality for CRUD operations in the Google Sheets. The script includes functions for:

- Process submitted order entry forms.
- Retrieve the last 10 records for order, P.O., and product registrations.
- Search records.
- Filter records.
- Delete records.

### Web Interface

[SalesWebApp](https://script.google.com/macros/s/AKfycbx9HzfsSn5MVL7sW2a_MieWYmn1OZOJ8GdltI2cIe_Ed9wwF2cdLQp-nOhrJsoBFnjy/exec)

SalesWebApp also offers a web interface for user interaction. This interface is served through Google Apps Script and Google Apps Script HTML service. 

In the header, there are three green-colored buttons: `Reload Customer List`, `Register New Customers`, and `Register New Products`, respectively.

The `Reload Customer List` retrieves customer names and source ID values from the Google Contacts, after applying filter on the user-defined field. In the case when the account owner of the Google Contacts and the actual sales representative is different, the account owner may delegate access to the Contacts to the responsible person.

<a href="https://imgur.com/cvIpE2D"><img src="https://i.imgur.com/cvIpE2D.jpg" title="source: imgur.com" /></a>

`Register New Customers` and `Register New Products` provides links to Google Contacts app and Google Forms, respectively.

The SalesWebApp also includes three tabs:

#### Invoices Tab
<a href="https://imgur.com/nx4PQSW"><img src="https://i.imgur.com/nx4PQSW.jpg" title="source: imgur.com" /></a>

The invoices tab is where the bookkeepers take new orders or update/delete an existing orders.

In the tab, the `Products` dropdown is dependent on `Customers`, so that depending on the user selection on the customer, it provides different set of registered products. This helps maintaining data integration, especially when the price or other configurations of a product is dependent on the customer.

The default setting for the Order Date is to use the _**shipping date**_. The shipping date is defined as follows: If today is a Saturday, please add 2 days to the Order Date; otherwise, add 1 day. This is the setting that how my factory operates. So, you may need to change the settings in the `JavaScript.html` file, `getShippingDate()` function.

Additionally, the tap provides an interface to filter and search past order records on the right side.

#### Production Order Tab
<a href="https://imgur.com/avJqKHf"><img src="https://i.imgur.com/avJqKHf.jpg" title="source: imgur.com" /></a>

The production order tab is where the GAS calculates the amount of product configuring items. For each product of sellings, there are pre-defined sets of numbers for the configuring items. For example, in the fake demo data I registered, there is a product named "Premium Fishcake Mix 400g" which is configured by: 

<a href="https://imgur.com/0PfW829"><img src="https://i.imgur.com/0PfW829.jpg" title="source: imgur.com" /></a>

For each date of orders, the P.O. tab aggregates each configuring items to produce.

Please note that you MUST enter the left over from the yesterday first.

Also note that when you create Stock leftover record, production date is the actual date when the item is produced, which is one or two day before the order date from the invoices tab.

You can also update the amount of P.O. by clicking the blue conveyor belt button on the top right side. This allows users to update the P.O. in the middle of the day.

#### Sales Info Tab
<a href="https://imgur.com/85a68lw"><img src="https://i.imgur.com/85a68lw.jpg" title="source: imgur.com" /></a>

The sales info tab is where you can search and edit/delete product registrations. To register a new product, you should click the green-colored `Register New Products` button in the header.

If you hit the `Edit` button for a product registration, it will open the associated Google Forms link, so that you can update the product information.

If you hit the `Delete` button for a product registration, it will delete the record in the Google Sheet, so that users will no longer see the product when he/she tries to take a new order. Note that deleting product registration will not delete any previous invoice records. Also note that it will not delete the response from the Google Forms; it will only delete the record in the Google Sheets.

## Contributing

We welcome contributions to improve and extend SalesWebApp. If you have ideas for new features, bug fixes, or other enhancements, please feel free to contribute. 

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For more information and updates, visit the [GitHub repository](https://github.com/andrewdk1123/google-sheets-mini-erp).
