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
    managerGUI();
});

//Grabing available products from MySQL
function managerGUI() {
    inquirer
    .prompt(
   // Here we give the user a list to choose from.
        {
            type: "list",
            message: "Good day Dr. Manager, what would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "managerChoices"
        }
    )
    .then(function(managerResponse) {

        switch (managerResponse.managerChoices) {
            case "View Products for Sale":
                productForSale();
                break;
            case "View Low Inventory":
                productLowInventory();
                break;
            case "Add to Inventory":
                productAddInventory();
                break;
            case "Add New Product":
                productNewProduct();
                break;
            case "Exit":
                console.log("Have a great day!");
                connection.end();
                break;
            default:
              console.log("Sorry I do not understand that request.");
          }    
    });
}

function productForSale() {
    console.log("Here are all products currently for Sale");
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
        console.log("__________________________________________");
        managerGUI()
    });
}

function productLowInventory() {
    console.log("Here are the products with less than 5 items left:");
}

function productAddInventory() {
    console.log("What would you like to stock?");
}

function productNewProduct() {
    console.log("What new item would you like to add?");
}

// //////////////////////////////
//     //building mySQL query
//     queryStr = 'SELECT * FROM products';

//     //Grabbing and displaying the data
//     connection.query(queryStr, function(err, data) {
//     if (err) throw err;
//     console.log("Here's what's in stock today: ");
    
//     //displaying items in a fashionable manor
//     var strOut = '';
//     for (var i = 0; i < data.length; i++) {
//         strOut = '';
//         strOut += 'Item ID: ' + data[i].item_id + ' | ';
//         strOut += 'Product Name: ' + data[i].product_name + ' | ';
//         strOut += 'Department: ' + data[i].department_name + ' | ';
//         strOut += 'Price: $' + data[i].price + ' | ';
//         strOut += 'Stock Quantity: ' + data[i].stock_quantity + '\n';
//         console.log(strOut);
//     }
//         //running buy function
//         buyProducts();
//     })
// }

// //prompts the user for what action they should take (select items, purchase stuff, not purchase stuff, etc.)
// function buyProducts() {
//     inquirer
//     .prompt([
//         {
//             type: "input",
//             message: "What is the ITEM ID of the product you would like to buy?",
//             name: "productNumber"
//         },
//         {
//             type: "input",
//             message: "How many units would you like?",
//             name: "itemQuantity"
//         }
//     ])
//     .then(function(answer) {
//         //running functions based on inquirer questions
//         var item = answer.productNumber;
//         var quantity = answer.itemQuantity;
//         var queryStr2 = 'SELECT * FROM products WHERE ?';
//         if(item > 0 && item < 10) {
//             inquirer
//             .prompt( 
//                 //confirm they selected the right item and quantity
//                 {
//                     type: "confirm",
//                     message: "I see you've selected " + item + " and " + quantity + ". Is this correct?",
//                     name: "confirmBuy",
//                     default: true
//                 }    
//             )
//             .then(function(userResponse) {

//                     connection.query(queryStr2, {item_id: item}, function(err, data) {
//                         if (err) throw err;
//                         var productInfo = data[0];
//                         //if user is ready to make the purchase
//                         if (userResponse.confirmBuy) {
//                             console.log("Great.");
//                             //checking if we have enough inventory for purchase
//                             if(quantity <= productInfo.stock_quantity) {
//                                 console.log("Looks like we have " + quantity + " " + productInfo.product_name + "(s) available."); 
                                
//                                 // Construct the updating query string
//                                 var updateQuantityQuery = 'UPDATE products SET stock_quantity = ' + (productInfo.stock_quantity - quantity) + ' WHERE item_id = ' + item;
//                                 // Update the inventory
//                                 connection.query(updateQuantityQuery, function(err, data) {
//                                     if (err) throw err;

//                                     console.log("Your purchase was successful. Your total is $" + productInfo.price * quantity + ".");
//                                     console.log("Thank you for using Bamazon, the #2 online retailer."); 
//                                     connection.end();

//                                 })
//                             } 
//                             else {
//                                 console.log("I'm sorry, we do not have " + quantity + " " + productInfo.product_name + "(s) available.");
//                                 //in this case we do not have enough inventory.
//                                 //checking if user would like to place another order.
//                                 inquirer
//                                 .prompt( 
//                                     {
//                                         type: "confirm",
//                                         message: "Would you like to place another order?",
//                                         name: "confirmTryAgain",
//                                         default: true
//                                     }
//                                 )
//                                 .then(function(repurchase) {
//                                     //if user wants to make another purchase, start the buyProducts function.
//                                     if(repurchase.confirmTryAgain) {
//                                         console.log("Great. Let's start over.");
//                                         buyProducts();
//                                     //if they do not want to make another purchase, end the app.    
//                                     } else {
//                                         console.log("Sorry we could not complete your order today.");
//                                         console.log("Thank you for using Bamazon, the #2 online retailer.");
//                                         connection.end();
//                                     }
//                                 });        
                                
//                             }
//                         //if the user selected the wrong item or quantity and confirmed so
//                         //start over by running the buyProducts function.     
//                         } else {
//                             console.log("No problem let's start over then.");
//                             buyProducts();
//                         }
//                     });
//             });
//         //else statement if the item_id number is invalid.    
//         } else {
//             console.log("Invalid Item ID. Please select a valid Item ID.");
//             buyProducts();
//         }  
//     });
// }