
var prompt = require('prompt');
var mysql = require('mysql');

//
// Start the prompt
//
prompt.start(); 

//
// Get two properties from the user: username and email
//
prompt.get(['Product', 'StockQty'], function (err, result) {
  //
  // Log the results.
  //
  console.log('         You have entered:');
  console.log('            Product to Purchase: ' + result.product);
  console.log('            Qty to Purchase: ' + result.StockQty);
});





var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Zs$19064',
	database: 'bamazon'
});

connection.connect(function(err){
	if (err) {
		console.log(err);
	}
	console.log ("Connect with ID: " + connection.threadId);

});

connection.query('SELECT ItemId, ProductName, DeptName, UnitPrice, StockQty FROM bamazon.product ORDER BY ItemId;', function(err, result){
   if (err) {
       console.log(err);
   }
   else {
       console.log(result);
   }

   // close the connection after the query
   connection.end();
});

// connection.query('SELECT * FROM top5000 WHERE COUNT => 1', function(err, result){
//    if (err) {
//        console.log(err);
//    }
//    else {
//        console.log(result);
//    }

//    // close the connection after the query
//    connection.end();
// });

// connection.query('SELECT COUNT (*) FROM top5000', function(err, result){
//    if (err) {
//        console.log(err);
//    }
//    else {
//        console.log(result);
//    }

//    // close the connection after the query
//    connection.end();
// });