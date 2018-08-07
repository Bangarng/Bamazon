//getting our npm dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//making our MySQL Connection
var connection = mysql.createConnection({
    host: "localhost",
    // Your port
    port: 3306,
    //MySQL Username
    user: "root",
    //MySQL Username password
    password: "NotAnother1",
    //MySQL database we are connecting to
    database: "bamazon"
});

//confirming connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    readbamazonProducts();
});

//Grabing available products from MySQL
function readbamazonProducts() {
    //building mySQL query
    queryStr = 'SELECT * FROM products';

    //Grabbing and displaying the data
    connection.query(queryStr, function(err, data) {
    if (err) throw err;
    console.log("Here's what's in stock today: ");
    
    //displaying items in a fashionable manor
    var strOut = '';
    for (var i = 0; i < data.length; i++) {
        strOut = '';
        strOut += 'Item ID: ' + data[i].item_id + ' | ';
        strOut += 'Product Name: ' + data[i].product_name + ' | ';
        strOut += 'Department: ' + data[i].department_name + ' | ';
        strOut += 'Price: $' + data[i].price + ' | ';
        strOut += 'Stock Quantity: ' + data[i].stock_quantity + '\n';
        console.log(strOut);
    }
        //running buy function
        buyProducts();
    })
}

//prompts the user for what action they should take (select items, purchase stuff, not purchase stuff, etc.)
function buyProducts() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the ITEM ID of the product you would like to buy?",
            name: "productNumber"
        },
        {
            type: "input",
            message: "How many units would you like?",
            name: "itemQuantity"
        }
    ])
    .then(function(answer) {
        //running functions based on inquirer questions
        var item = answer.productNumber;
        var quantity = answer.itemQuantity;
        var queryStr2 = 'SELECT * FROM products WHERE ?';
        inquirer
        .prompt( 
            //confirm they selected the right item and quantity
            {
                type: "confirm",
                message: "I see you've selected " + item + " and " + quantity + ". Is this correct?",
                name: "confirmBuy",
                default: true
            }    
        )
        .then(function(userResponse) {
            connection.query(queryStr2, {item_id: item}, function(err, data) {
                if (err) throw err;
                var productInfo = data[0];
                //if user is ready to make the purchase
                if (userResponse.confirmBuy) {
                    console.log("Great.");
                    //checking if we have enough inventory for purchase
                    if(quantity <= productInfo.stock_quantity) {
                        console.log("Looks like we have " + quantity + " " + productInfo.product_name + "(s) available."); 
                        console.log("Your purchase was successful.");
                        console.log("Thank you for using Bamazon, the #2 online retailer."); 
                        connection.end();
                    } 
                    else {
                        console.log("I'm sorry, we do not have " + quantity + " " + productInfo.product_name + "(s) available.");
                        //in this case we do not have enough inventory.
                        //checking if user would like to place another order.
                        inquirer
                        .prompt( 
                            {
                                type: "confirm",
                                message: "Would you like to place another order?",
                                name: "confirmTryAgain",
                                default: true
                            }
                        )
                        .then(function(repurchase) {
                            //if user wants to make another purchase, start the buyProducts function.
                            if(repurchase.confirmTryAgain) {
                                console.log("Great. Let's start over.");
                                buyProducts();
                            //if they do not want to make another purchase, end the app.    
                            } else {
                                console.log("Sorry we could not complete your order today.");
                                console.log("Thank you for using Bamazon, the #2 online retailer.");
                                connection.end();
                            }
                        });        
                        
                    }
                  //if the user selected the wrong item or quantity and confirmed so
                  //start over by running the buyProducts function.     
                } else {
                    console.log("No problem let's start over then.");
                    buyProducts();
                }
            });
        });
    });
}


///////////////////////////////////////////////////////////////////
// ]).then(function(input) {
//     // console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

//     var item = input.item_id;
//     var quantity = input.quantity;

//     // Query db to confirm that the given item ID exists in the desired quantity
//     var queryStr = 'SELECT * FROM products WHERE ?';

//     connection.query(queryStr, {item_id: item}, function(err, data) {
//       if (err) throw err;

//       // If the user has selected an invalid item ID, data will be empty
//       // console.log('data = ' + JSON.stringify(data));

//       if (data.length === 0) {
//         console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
//         displayInventory();

//       } else {
//         var productData = data[0];
//         // If the quantity requested by the user is in stock
//         if (quantity <= productData.stock_quantity) {
//           console.log('Congratulations, the product you requested is in stock! Placing order!');

//           // Construct the updating query string
//           var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
//           // console.log('updateQueryStr = ' + updateQueryStr);

//           // Update the inventory
//           connection.query(updateQueryStr, function(err, data) {
//             if (err) throw err;

//             console.log('Your order has been placed! Your total is $' + productData.price * quantity);
//             console.log('Thank you for shopping with us!');
//             console.log("\n---------------------------------------------------------------------\n");

//             // End the database connection
//             connection.end();
//           })

//   //connection.end();