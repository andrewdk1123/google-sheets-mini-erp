/**
 * Part of server-side codes for Google Sheets sales management webapp with CRUD operations.
 * This script is responsible for interacting with the Google Sheets database, including functions for creating, reading, updating, and deleting records in the Google Sheets document.
 * By: andrewdklee.com
 * Github: https://github.com/andrewdk1123/google-sheets-mini-erp
 */

/**
 * Gets a list of people in the user's Google Contacts app with userDefined key "Connections" and value "Sales".
 * The user may delegate his/her Contacts to sales representatives or anyone who are responsible. 
 * Anyone responsible to manage sales contacts should add a user defined field in the app as predefined in the team, e.g., {"Connections": "Sales"}.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list
 * @returns {Array} customerArray - A 2D Array of customer names and source IDs
 */
function getSalesConnections() {
  try{
    // Get the list of contacts of the user's profile.
    const people = People.People.Connections.list("people/me", {personFields: "organizations,userDefined"});
  
    // Filter contacts to include only those with userDefined key "Connections" and value "Sales".
    const salesConnections = people.connections.filter(contact => {
      const userDefined = contact.userDefined || [];
      const customField = userDefined.find(field => field.key === "Connections");
      return customField && customField.value === "Sales";
      });
  
    // Extract only organizations from the salesConnections.
    const organizations = salesConnections.map(connection => connection.organizations || []);
  
    // Create a new 2D array to store organization names and source IDs.
    const customerArray = organizations.reduce((result, org) => {
      if (org.length > 0) {
        org.forEach(organizations => {
          const name = organizations.name || "";
          const sourceId = organizations.metadata && organizations.metadata.source ? organizations.metadata.source.id : "";
          result.push([name, sourceId]);
        });
      }

      return result;
    }, []);
  
    return customerArray;
  } catch (err) {
    console.log("Failed to get the connection with an error: %s", err.message);
    return []; 
  }
}

// Clear all existing records in the "Customer Info" sheet and re-write data with updated sales connections.
function refreshCustomerInfo() {
  // Open the Customer Info sheet and clear all existing rows.
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET);
  const sheet = spreadsheet.getSheetByName(CUSTOMER_INFO);
  sheet.clear();
  
  // Restore the headers.
  const headers = ["Name", "Source ID"];
  GasCrud.createRecord(SPREADSHEET, CUSTOMER_INFO, headers);
  
  // Retrieve latest list of customers and append it to the sheet
  const customers = getSalesConnections();
  for (var i = 0; i < customers.length; i++) {
    GasCrud.createRecord(SPREADSHEET, CUSTOMER_INFO, customers[i]);
  }    
}

/**
 * Process submitted orderEntry form. 
 * If the submitted formObject has valid orderId, then find and update the record in the Invoices sheet. 
 * Otherwise create a new record in the sheet.
 * @param {Object} formObject - An Object containing user inputs from FormOrderEntry.html
 * @return {Array} - The very last 10 order Arrays retrieved from getLastTenOrders() function.
 */
function processOrderEntry(formObject) {
 try {

    // Check if the formObject.orderId is valid.
    if (GasCrud.isValidKey(formObject.orderId, SPREADSHEET, INVOICE, INVOICE_KEY_COL)) {
  
      // Fetch product details
      const valueArray = fetchOrderDetails(formObject);
  
      // Set which record to update
      const updateRange = GasCrud.searchRecordByKey(formObject.orderId, SPREADSHEET, INVOICE, INVOICE_KEY_COL, INVOICE_FIRST_COL, INVOICE_LAST_COL).range;
  
      // Update records in the updateRange with values
      GasCrud.updateRecord(SPREADSHEET, INVOICE, updateRange, valueArray);
  
    } else {

      // Create a new record
      formObject.orderId = GasCrud.generateKey();
  
      // Fetch product details
      const valueArray = fetchOrderDetails(formObject);
  
      // Create a new record with a key
      GasCrud.createRecord(SPREADSHEET, INVOICE, valueArray);
  
    }
  
  return getLastTenOrders();
  
 } catch (error) {
   console.error("Error in processOrderEntry:", error);
   throw new Error("An error occurred while processing the order entry.");
 }
}


/**
 * Get customer name, product name, and price info for a single order Object.
 * Also calculates number of product configuring items needed to process the order.
 * @param {Object} formObject - An order Object containing orderId, customerName, productId.
 * @return {Array} orderWithDetails - An array of values for the order with additional details.
 */
function fetchOrderDetails(formObject) {
  try {
    const customerId = formObject.customerSelect;
    const productId = formObject.productSelect;

    // Get customer name by the customerId
    const customer = customers.find(function(customer) {
      return customer.id === customerId;
    });

    // Fetch product information by the productId
    const productList = getProductList(customerId);
    const product = productList.find(function(product) {
      return product.id === productId;
    });

    // Create a new array with the original order details and additional attributes
    const orderWithDetails = [
      formObject.orderId, // ORDER ID
      formObject.orderDate, // ORDER DATE
      customerId, // CUSTOMER ID
      customer ? customer.name : "Unknown Customer", // CUSTOMER NAME
      productId, // PRODUCT ID
      product ? product.name : "Unknown Product", // PRODUCT NAME
      formObject.orderQuantity, // ORDER QUANTITY
      product ? product.price : 0, // PRICE
      formObject.tax, // TAX
      formObject.orderNote, // NOTES
      product ? product.numChikuwa * formObject.orderQuantity : 0, // Number of Chikuwa
      product ? product.numJakoten * formObject.orderQuantity : 0, // Number of Jakoten
      product ? product.numKamaboko * formObject.orderQuantity : 0, // Number of Kamaboko
      product ? product.numNarutomaki * formObject.orderQuantity : 0 // Number of Narutomaki
    ];

    return orderWithDetails;
  
  } catch (error) {
    console.error("An error occurred:", error);
    return []; // Return an empty array in case of an error
  }
}

/**
 * Read and prep the last 10 order records before displaying them in the "invoice-table-body".
 * @return {Array} lastTenRecords - An array containing the last 10 records in the spreadsheet.
 */
function getLastTenOrders() {
  try {
    const dataArray = GasCrud.getTailRows(10, SPREADSHEET, INVOICE, INVOICE_FIRST_COL, INVOICE_LAST_COL);

    if (dataArray && dataArray.length > 0) {
      // Convert Date objects by convertDateToYYYYMMDD() function
      const lastTenRecords = dataArray.map(record => {
        return [
          record[0],
          convertDateToYYYYMMDD(record[1]),
          record[2],
          record[3],
          record[4],
          record[5],
          record[6],
          record[7],
          record[8],
          record[9]
        ];
      });

      return lastTenRecords;
    } else {
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

/**
 * Get order records containing search text.
 * @param {Object} formObject - An object containing a `searchText` property with the text to search for.
 * @return {Array} - An array of records that contain the search text.
 */
function searchOrderRecords(formObject) {
  let result = [];
  try {
    if (formObject.searchInvoiceText) { // Execute if form passes search text
      const data = GasCrud.readRecord(SPREADSHEET, INVOICE, false, INVOICE_FIRST_COL, INVOICE_LAST_COL);
      const searchText = formObject.searchInvoiceText;

      // Loop through each row and column to search for matches
      for (let i = 0; i < data.length; i++) {                
        for (let j = 4; j < data[i].length; j++) {
          const cellValue = data[i][j].toString();

          if (cellValue.toLowerCase().includes(searchText.toLowerCase())) {
            data[i][1] = convertDateToYYYYMMDD(data[i][1]);

            result.push(data[i]);
            break; // Stop searching for other matches in this row
          }
        }
      }
    }
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }
    
  return result;
}

/**
 * Filter invoice records and return an array where orderDate is inbeween startDate and endDate.
 * @param {String} startDate - Minimum orderDate value to be included in the returning Array.
 * @param {String} endDate - Maximum orderDate value to be included in the returning Array.
 * @return {Array} filteredDate - An Array of order records after applying date filters.
 */
function filterDataByDate(startDate, endDate) {
  var allData = GasCrud.readRecord(SPREADSHEET, INVOICE, false, INVOICE_FIRST_COL, INVOICE_LAST_COL);
  var filteredData = [];

  for (var i = 0; i < allData.length; i++) {
    var date = new Date(allData[i][1]);
    var startDateObj = new Date(startDate);
    var startDateObject = startDateObj.setDate(startDateObj.getDate() - 1);
    var endDateObj = new Date(endDate);
    var endDateObject = endDateObj.setDate(endDateObj.getDate() + 1);

    if (date >= startDateObject && date <= endDateObject) {
      filteredData.push(allData[i]);
    }
  }

  for (var i = 0; i < filteredData.length; i++) {
    filteredData[i][1] = convertDateToYYYYMMDD(filteredData[i][1]);
  }

  return filteredData;
}

/**
 * Delete an order record from the "Invoices" sheet.
 * @param {String} orderId - A unique identifier of the record to delete.
 * @return {Array} - Array of order records after deleting the target row.
 */
function deleteRecordOnServer (orderId) {
  GasCrud.deleteRecord(SPREADSHEET, INVOICE, orderId, "ORDER ID");
  return getLastTenOrders();
}

/**
 * Get an order record Array by orderId.
 * @param {String} orderId - A unique identifier of the record that you are looking for.
 * @return {Array} record - An Array of values from the target row.
 */
function getRecordByIdOnServer (orderId) {
  var record = GasCrud.searchRecordByKey(orderId, SPREADSHEET, INVOICE, INVOICE_KEY_COL, INVOICE_FIRST_COL, INVOICE_LAST_COL).rowData;

  record[1] = convertDateToYYYYMMDD(record[1]);
  return record;
}

/**
 * Return the last 10 product registrations.
 * @return {Array} lastTenProds - An array containing the last 10 product registrations.
 */
function getLastTenProducts() {
  try {
    const dataArray = GasCrud.getTailRows(10, SPREADSHEET, PRODUCT_INFO, PRODUCT_FIRST_COL, PRODUCT_LAST_COL);

    const lastTenProds = dataArray.map(record => {
      return [
        record[1],
        record[4],
        record[3],
        record[5],
        record[6],
        record[7],
        record[8]
      ];
    });

  return lastTenProds;
  
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

/**
 * Delete a product registration from "Product Info" sheet.
 * Note that calling this function will delete a record in the Google Sheets only. 
 * This will not delete response in the synced Google Forms.
 * @param {String} productId - A unique identifier of the record to delete.
 * @return {Array} - Array of product records after deleting the target row.
 */
function deleteProductOnServer (productId) {
  GasCrud.deleteRecord(SPREADSHEET, PRODUCT_INFO, productId, "PRODUCT ID");
  return getLastTenProducts();
}

/**
 * Get records from "Product Info" sheet containing the search text.
 * @param {Object} formObject - An object containing a `searchProduct` property with the text to search for.
 * @return {Array} - An array of record that contain the search text with selected columns.
 */
function searchProductRecords(formObject) {
  let result = [];

  try {
    if (formObject.searchProductText) {
      const data = GasCrud.readRecord(SPREADSHEET, PRODUCT_INFO, false, PRODUCT_FIRST_COL, PRODUCT_LAST_COL);
      const searchText = formObject.searchProductText;

      for (let i = 0; i < data.length; i++) {
        for (let j = 1; j < data[i].length; j++) {
          const cellValue = data[i][j].toString();

          if (cellValue.toLowerCase().includes(searchText.toLowerCase())) {
            // Extract and transform specific columns
            const selectedColumns = [
              data[i][1],
              data[i][4],
              data[i][3],
              data[i][5],
              data[i][6],
              data[i][7],
              data[i][8]
            ];

            result.push(selectedColumns);
            break; // Stop searching for other matches in this row
          }
        }
      }
    }
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }

  return result;
}

/**
 * Process stock leftover entry.
 * If provided PO ID is valid, then update an existing record. 
 * Otherwise create a new row in the "Production Order" sheet.
 * Please create a new P.O. record, BEFORE calling updatePo!
 * @param {Object} formObject - An Object containing user inputs from "stockEntry."
 * @return {Array} - An Array of the last 10 P.O. records from the "Production Order" sheet.
 */
function processStockEntry(formObject) {
  try {
    // Check if the formObject.poId is valid.
    if (GasCrud.isValidKey(formObject.poId, SPREADSHEET, PO, PO_KEY_COL)) {

      var orderDate = new Date(formObject.productionDate);

      // Check if orderDate is Saturday (6). 
      // If so, add 2 days, otherwise add 1 day and reassign orderDate
      if (orderDate.getDay() === 6) {
        orderDate.setDate(orderDate.getDate() + 2);
      } else {
        orderDate.setDate(orderDate.getDate() + 1);
      }
      const orderDateString = convertDateToYYYYMMDD(orderDate); 
      const orderQty = aggregateItemsForDate(orderDateString);

      // Set itemQty based on formObject.itemSelect
      let itemQty;
      if (formObject.itemSelect === "Chikuwa") {
        itemQty = orderQty.chikuwaQty;
      } else if (formObject.itemSelect === "Jakoten") {
        itemQty = orderQty.jakotenQty;
      } else if (formObject.itemSelect === "Kamaboko") {
        itemQty = orderQty.kamabokoQty;
      } else if (formObject.itemSelect === "Narutomaki") {
        itemQty = orderQty.narutomakiQty;
      }

      const inputArray = [
        formObject.poId,
        formObject.productionDate,
        formObject.expirationDate,
        formObject.itemSelect,
        formObject.stockQuantity,
        orderDateString,
        itemQty,
        Math.max(itemQty - formObject.stockQuantity, 0),
        formObject.stockNote
      ];

      // Set which record to update
      const updateRange = GasCrud.searchRecordByKey(formObject.poId, SPREADSHEET, PO, PO_KEY_COL, PO_FIRST_COL, PO_LAST_COL).range;
  
      // Update records in the updateRange with values
      GasCrud.updateRecord(SPREADSHEET, PO, updateRange, inputArray);
  
    } else {
  
      // Create a new record
      var orderDate = new Date(formObject.productionDate);
      // Check if orderDate is Saturday (6). 
      // If so, add 2 days, otherwise add 1 day and reassign orderDate
      if (orderDate.getDay() === 6) {
        orderDate.setDate(orderDate.getDate() + 2);
      } else {
        orderDate.setDate(orderDate.getDate() + 1);
      }
    
      const orderDateString = convertDateToYYYYMMDD(orderDate); 
      const orderQty = aggregateItemsForDate(orderDateString);

      // Set itemQty based on formObject.itemSelect
      let itemQty;
      if (formObject.itemSelect === "Chikuwa") {
        itemQty = orderQty.chikuwaQty;
      } else if (formObject.itemSelect === "Jakoten") {
        itemQty = orderQty.jakotenQty;
      } else if (formObject.itemSelect === "Kamaboko") {
        itemQty = orderQty.kamabokoQty;
      } else if (formObject.itemSelect === "Narutomaki") {
        itemQty = orderQty.narutomakiQty;
      }
      console.log(itemQty);

      const inputArray = [
        GasCrud.generateKey(),
        formObject.productionDate,
        formObject.expirationDate,
        formObject.itemSelect,
        formObject.stockQuantity,
        orderDateString,
        itemQty,
        Math.max(itemQty - formObject.stockQuantity, 0),
        formObject.stockNote
      ];
    
      // Create a new record with a key
      GasCrud.createRecord(SPREADSHEET, PO, inputArray);
  
    }
  
  return getLastTenPo();
  
  } catch (error) {
    console.error("Error in processOrderEntry:", error);
    throw new Error("An error occurred while processing the order entry.");
  }
}

/**
 * Delete a record from "Production Order" sheet.
 * @param {String} poId - A unique identifier of the record to delete.
 * @return {Array} - Array of production order records after deleting the target row.
 */
function deletePoOnServer (poId) {
  GasCrud.deleteRecord(SPREADSHEET, PO, poId, "PO ID");
  return getLastTenPo();
}

/**
 * Aggregate ordered quantities per each product configuring item for a given day.
 * @param {String} orderDate - A String of date for which you want to aggregate items. This should be formatted as "YYYY-MM-DD".
 * @return {Object} itemSum - An Object containing item sums for the specified date.
 */
function aggregateItemsForDate(orderDate) {
  let itemSum = {
    chikuwaQty: 0,
    jakotenQty: 0, 
    kamabokoQty: 0, 
    narutomakiQty: 0
  };

  const dataArray = GasCrud.readRecord(SPREADSHEET, INVOICE, false, INVOICE_FIRST_COL, INVOICE_LAST_COL);

  for (var i = 0; i < dataArray.length; i++) {
    const row = dataArray[i];
    const rowOrderDate = convertDateToYYYYMMDD(row[1]);
  
    if(rowOrderDate === orderDate) {
      const chikuwaOrder = row[10];
      const jakotenOrder = row[11];
      const kamabokoOrder = row[12];
      const narutomakiOrder = row[13];

      itemSum.chikuwaQty += chikuwaOrder;
      itemSum.jakotenQty += jakotenOrder;
      itemSum.kamabokoQty += kamabokoOrder;
      itemSum.narutomakiQty += narutomakiOrder;
    }
  }
  
  return itemSum;
}

/**
 * Read and prep the last 10 production order records before displaying them in the "po-table-body".
 * @return {Array} lastTenRecords - An array containing the last 10 records in the spreadsheet.
 */
function getLastTenPo() {
  try {
    const dataArray = GasCrud.getTailRows(10, SPREADSHEET, PO, PO_FIRST_COL, PO_LAST_COL);

    if (dataArray && dataArray.length > 0) {
      // Convert Date objects by convertDateToYYYYMMDD() function
      const lastTenPoRecords = dataArray.map(record => {
        return [
          record[0],
          convertDateToYYYYMMDD(record[1]),
          convertDateToYYYYMMDD(record[2]),
          record[3],
          record[4],
          convertDateToYYYYMMDD(record[5]),
          record[6],
          record[7],
          record[8]
        ];
      });

      return lastTenPoRecords;
    } else {
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

/**
 * Update P.O. records for a given date.
 * Please submit Stock leftover form, BEFORE calling updatePo function.
 * @param {Object} formObject - An Object containing the user input for production date.
 */
function updatePo(formObject) {

  const productionDate = formObject.productionDate;
  var orderDate = new Date(productionDate);
  // Check if orderDate is Saturday (6). 
  // If so, add 2 days, otherwise add 1 day and reassign orderDate
  if (orderDate.getDay() === 6) {
    orderDate.setDate(orderDate.getDate() + 2);
  } else {
    orderDate.setDate(orderDate.getDate() + 1);
  }
  const orderDateString = convertDateToYYYYMMDD(orderDate); 

  // Aggregate items for the productionDate.
  const resultObject = aggregateItemsForDate(orderDateString);

  // Read P.O. data from a spreadsheet and store it as an Array.
  const poData = GasCrud.readRecord(SPREADSHEET, PO, false, PO_FIRST_COL, PO_LAST_COL);

  // Filter P.O. data for the date.
  var filteredPoData = poData.filter((record) => {
    const poDate = new Date(record[1]); // The production date is in the second column (index 1).
    const poDateString = convertDateToYYYYMMDD(poDate);
    return poDateString === productionDate;
  });

  // Store PO ID in an Array.
  var poKeyList = [];
  for (var i = 0; i < filteredPoData.length; i++) {
    var value = filteredPoData[i][0];
    poKeyList.push(value);
  }

  // Update production order for each date on the filtered P.O. data.
  filteredPoData.forEach((record) => {
    // itemsForDate uses numeric indexes:
    const chikuwaQty = resultObject.chikuwaQty;
    const jakotenQty = resultObject.jakotenQty;
    const kamabokoQty = resultObject.kamabokoQty;
    const narutomakiQty = resultObject.narutomakiQty;

    const itemIndex = 3;
    const itemStockIndex = 4;
    const itemQtyIndex = 6;
    const itemPoIndex = 7;

    if (record[itemIndex] === "Chikuwa") {
      record[itemQtyIndex] = chikuwaQty;
    } else if (record[itemIndex] === "Jakoten") {
      record[itemQtyIndex] = jakotenQty;
    } else if (record[itemIndex] === "Kamaboko") {
      record[itemQtyIndex] = kamabokoQty;
    } else if (record[itemIndex] === "Narutomaki") {
      record[itemQtyIndex] = narutomakiQty;
    }

    record[itemPoIndex] = record[itemQtyIndex] - record[itemStockIndex];
  });

  // Store update range in an Array.
  for (var i = 0; i < poKeyList.length; i++) {
    const updateRange = GasCrud.searchRecordByKey(poKeyList[i], SPREADSHEET, PO, PO_KEY_COL, PO_FIRST_COL, PO_LAST_COL).range;
    GasCrud.updateRecord(SPREADSHEET, PO, updateRange, filteredPoData[i]);
  }

  return getLastTenPo();
}     

/**
 * Get an Array of production order by poId.
 * @param {String} poId - A unique identifier of the record that you are looking for.
 * @return {Array} stockRecord - An Array of values from the target row.
 */
function getStockByIdOnServer(poId) {
  var stockRecord = GasCrud.searchRecordByKey(poId, SPREADSHEET, PO, PO_KEY_COL, PO_FIRST_COL, PO_LAST_COL).rowData;

  stockRecord[1] = convertDateToYYYYMMDD(stockRecord[1]);
  stockRecord[2] = convertDateToYYYYMMDD(stockRecord[2]);
  stockRecord[5] = convertDateToYYYYMMDD(stockRecord[5]);

  return stockRecord;
}

/**
 * Get P.O. records containing search text.
 * @param {Object} formObject - An object containing a `searchText` property with the text to search for.
 * @return {Array} - An array of records that contain the search text.
 */
function searchPoRecords(formObject) {
  let result = [];
  try {
    if (formObject.searchPoText) { // Execute if form passes search text
      const data = GasCrud.readRecord(SPREADSHEET, PO, false, PO_FIRST_COL, PO_LAST_COL);
      const searchText = formObject.searchPoText;

      // Loop through each row and column to search for matches
      for (let i = 0; i < data.length; i++) {  
        data[i][1] = convertDateToYYYYMMDD(data[i][1]);
        data[i][2] = convertDateToYYYYMMDD(data[i][2]);
        data[i][5] = convertDateToYYYYMMDD(data[i][5]);

        for (let j = 1; j < data[i].length; j++) {
          const cellValue = data[i][j].toString();

          if (cellValue.toLowerCase().includes(searchText.toLowerCase())) {
            result.push(data[i]);
            break; // Stop searching for other matches in this row
          }
        }
      }
    }
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }
    
  return result;
}
