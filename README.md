# Google Sheets Sales Management Web Application (SalesWebApp)

SalesWebApp is a web application designed to manage sales data in a Google Sheets document. It provides a server-side script that handles CRUD (Create, Read, Update, Delete) operations for sales data, integrates with Google Forms for product registration, and includes various utility functions. This web application is part of a larger project available on [GitHub](https://github.com/andrewdk1123/google-sheets-mini-erp).

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Server-Side Script](#server-side-script)
- [Web Interface](#web-interface)
- [Contributing](#contributing)
- [License](#license)

## Overview

SalesWebApp is a Google Sheets-based sales management solution that offers features like lead management, opportunity tracking, customer information storage, and product registration. The project includes a server-side script (Utilities.gs) and a web interface.

## Configuration

Before using SalesWebApp, you should configure the following constants in the `Utilities.gs` script to match your Google Sheets setup:

- `SPREADSHEET`: The ID of your Google Sheets document.
- `FORM`: The ID of the Google Form for product registration.
- Constants related to data sheet names and column identifiers (e.g., `INVOICE`, `CUSTOMER_INFO`, `PRODUCT_INFO`).

## Server-Side Script

The heart of SalesWebApp is the `Utilities.gs` script. It provides the server-side functionality for handling sales data. The script includes functions for:

- Formatting date values to a string with KST (Korea Standard Time).
- Retrieving a list of customers from the Google Sheets document.
- Mapping customer IDs for submitted customer names from Google Forms.
- Generating unique product IDs and associating them with customer IDs.
- Splitting product configurations and writing them to the sheet.
- Setting Google Forms URLs for response editing.

The server-side script ensures that your sales data is managed efficiently and accurately within Google Sheets.

## Web Interface

SalesWebApp also offers a web interface for user interaction. This interface is served through Google Apps Script and Google Apps Script HTML service. It includes:

- A web form for product registration, which triggers the server-side script.
- Functions for retrieving lists of customers and products based on user interactions.

## Contributing

We welcome contributions to improve and extend SalesWebApp. If you have ideas for new features, bug fixes, or other enhancements, please feel free to contribute. Check the [GitHub repository](https://github.com/andrewdk1123/google-sheets-mini-erp) for more information on how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For more information and updates, visit the [GitHub repository](https://github.com/andrewdk1123/google-sheets-mini-erp).





# Google Sheets Sales Management Web Application (SalesWebApp) - Database Script

This is the database script for the Google Sheets-based sales management web application, SalesWebApp. It is responsible for interacting with the database, including functions for creating, reading, updating, and deleting records in the Google Sheets document.

For the complete SalesWebApp project, including server-side code and a web interface, please visit the [GitHub repository](https://github.com/andrewdk1123/google-sheets-mini-erp).

## Table of Contents

- [Overview](#overview)
- [Sales Connections](#sales-connections)
- [Refresh Customer Info](#refresh-customer-info)
- [Process Order Entry](#process-order-entry)
- [Fetch Order Details](#fetch-order-details)
- [Get Last Ten Orders](#get-last-ten-orders)
- [Search Order Records](#search-order-records)
- [Filter Data by Date](#filter-data-by-date)
- [Delete Record on Server](#delete-record-on-server)
- [Get Record by ID on Server](#get-record-by-id-on-server)
- [Get Last Ten Products](#get-last-ten-products)
- [Delete Product on Server](#delete-product-on-server)
- [Search Product Records](#search-product-records)

## Overview

The database script for SalesWebApp is responsible for handling the sales data stored in the Google Sheets document. It provides a set of functions for managing customer information, product registrations, and order entries.

## Sales Connections

The `getSalesConnections` function retrieves a list of people in the user's Google Contacts app with a user-defined key "Connections" and value "Sales." This is useful for managing sales contacts and connecting them to customers.

## Refresh Customer Info

The `refreshCustomerInfo` function clears all existing records in the "Customer Info" sheet and rewrites data with updated sales connections. It ensures that the customer information is up-to-date and reflects the latest sales connections.

## Process Order Entry

The `processOrderEntry` function processes submitted order entry forms. It checks if the submitted order has a valid orderId, and either updates the existing record in the Invoices sheet or creates a new record. This function also fetches product details and returns the last 10 order entries.

## Fetch Order Details

The `fetchOrderDetails` function retrieves customer names, product names, and price information for a single order entry. It enhances the order data with additional details.

## Get Last Ten Orders

The `getLastTenOrders` function retrieves and prepares the last 10 order records before displaying them. It converts date objects to a formatted string and returns the data for display.

## Search Order Records

The `searchOrderRecords` function searches order records in the spreadsheet based on a provided search text. It returns records that contain the search text in selected columns.

## Filter Data by Date

The `filterDataByDate` function filters invoice records based on a specified date range. It returns an array of records within the given date range.

## Delete Record on Server

The `deleteRecordOnServer` function deletes an order record from the Invoices sheet based on the orderId and returns the updated list of orders.

## Get Record by ID on Server

The `getRecordByIdOnServer` function retrieves an order record by its orderId. It returns the order details for a specific record.

## Get Last Ten Products

The `getLastTenProducts` function retrieves the last 10 product registrations from the Product Info sheet. It prepares the data for display.

## Delete Product on Server

The `deleteProductOnServer` function deletes a product registration from the Product Info sheet based on the productId and returns the updated list of products.

## Search Product Records

The `searchProductRecords` function searches product records in the spreadsheet based on a provided search text. It returns records that contain the search text in selected columns.

---

For more information and updates, visit the [GitHub repository](https://github.com/andrewdk1123/google-sheets-mini-erp).

