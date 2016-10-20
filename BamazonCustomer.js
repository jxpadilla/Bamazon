var prompt = require("prompt");
var inquirer = require("inquirer");
var mysql = require("mysql");

var schema = {
    properties: {
        ItemID: {
            description: "Select the Item Id below to make a purchase.",
            pattern: /^\d+$/,
            message: "Sorry-Enter an ID number.",
            required: true
        },
        Qty: {
            description: "How many do you want to buy?",
            pattern: /^\d+$/,
            message: "Sorry-You've entered an invalid quantity; please try again.",
            required: true
        }
    }
};

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zs$19064",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
});

function calcInvPriceValue() {
    var invValRdBikes = 0,
        invValMtnBikes = 0,
        invValSpecialty = 0;

    var deptValue = [];
    connection.query('SELECT * FROM product', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].DeptName == "Road Bikes") {
                invValRdBikes += res[i].UnitPrice * res[i].StockQty;
            } else if (res[i].DeptName == "Mountain Bikes") {
                invValMtnBikes += res[i].UnitPrice * res[i].StockQty;
            } else if (res[i].DeptName == "Specialty") {
                invValSpecialty += res[i].UnitPrice * res[i].StockQty;
            }
        }
        deptValue.push(invValRdBikes);
        deptValue.push(invValMtnBikes);
        deptValue.push(invValSpecialty);

    });
    // connection.query("SELECT * FROM DeptName", function(err, result) {
    //     for (var i = 0; i < result.length; i++) {
    //         connection.query("Current Inventory Sales Valuation = " + deptValue[i].toFixed(2) + " WHERE ?", { DeptName: result[i].DeptName }, function(err, res) {
    //             return;
    //         });
    //     }
    // });
}

function welcomeDisplay() {
    connection.query("SELECT * FROM product", function(err, result) {
        if (err) throw err;
        console.log("\n      Welcome to Bamazon Bicycles!  Check out these bargains!!");
        console.log("=================================================================================");
        for (var i = 0; i < result.length; i++) {
            console.log("---------------------------------------------------------------------------------");
            console.log("  Item ID: " + result[i].ItemId + "  || Product Name: " + result[i].ProductName + "  || Price: $" + result[i].UnitPrice.toFixed(2) + " || In Stock: " + result[i].StockQty);
        }
        console.log("\n");
        userInput();
    });
}

function userInput() {
    prompt.get(schema, function(err, result) {
        connection.query("SELECT * FROM product WHERE ?", { ItemID: result.ItemID },
            function(err, selectedItem) {
                invAvail(selectedItem, result.Qty);
            });
    });
}

function invAvail(item, purchaseQty) {

    if (item[0].StockQty < purchaseQty) {
        console.log("\nWe don't have the selected quantity on hand. Please make another selection:");
        setTimeout(welcomeDisplay, 1000);
        setTimeout(userInput, 1500);
    } else {
        var deptName = item[0].DeptName;
        var totalPurchase = purchaseQty * item[0].UnitPrice;
        console.log("\n\nYour order quantity is: " + purchaseQty + " " + item[0].ProductName + " at $" + item[0].UnitPrice.toFixed(2) + " each.\n");

        // update the database quantity
        connection.query("UPDATE product SET ? WHERE ?", [{ StockQty: item[0].StockQty - purchaseQty }, { ItemID: item[0].ItemID }], function(err, res) {});

        // update the department table
        // connection.query("SELECT * FROM DeptName", function(err, res) {
        //     var itemDept = "";
        //     for (var i = 0; i < res.length; i++) {
        //         if (deptName == res[i].DeptName) {
        //             itemDept = deptName;
        //         }
        //     }
        //     connection.query("UPDATE DeptName SET TotalSales = TotalSales + " + totalPurchase + " WHERE ?", { DeptName: itemDept }, function(err, res) {
        //         return;
        //     });
        // });
        welcomeDisplay();
    }
}
welcomeDisplay();
calcInvPriceValue();