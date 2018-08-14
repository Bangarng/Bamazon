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
    queryStr = 'SELECT * FROM products';
    //Grabbing and displaying the data
    connection.query(queryStr, function(err, data) {
        if (err) throw err;
        console.log("--------------------------------------------------------" + '\n');
        console.log("Here's what's in stock today:" + '\n'); 
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
        console.log("--------------------------------------------------------" + '\n');
        managerGUI()
    });
}

function productLowInventory() {
    //building mySQL query
    queryStr = 'select * from products WHERE stock_quantity < 5';
    //Grabbing and displaying the data
    connection.query(queryStr, function(err, data) {
        if (err) throw err;
        console.log("--------------------------------------------------------" + '\n');
        console.log("Here are the product(s) with less than 5 items left:" + "\n");
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
    console.log("--------------------------------------------------------" + '\n');
    managerGUI()    
    });    
}

function productAddInventory() {
    //building mySQL query
    queryStr = 'SELECT * FROM products';

    //Grabbing and displaying the data
    connection.query(queryStr, function(err, data) {
    if (err) throw err;
    console.log("What would you like to re-stock?");
    
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
        restockProducts();
    });
}

//prompts the user for what action they should take (select items, purchase stuff, not purchase stuff, etc.)
function restockProducts() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the ITEM ID of the product you would like to restock?",
            name: "productNumber"
        },
        {
            type: "input",
            message: "How many units would you like to add?",
            name: "itemQuantity"
        }
    ])
    .then(function(answer) {
        //running functions based on inquirer questions
        var item = answer.productNumber;
        var quantity = answer.itemQuantity;
        var queryStr2 = 'SELECT * FROM products WHERE ?';
        if(item > 0 && item < 11) {
            inquirer
            .prompt( 
                //confirm they selected the right item and quantity
                {
                    type: "confirm",
                    message: "I see you've selected " + item + " and " + quantity + ". Is this correct?",
                    name: "confirmRestock",
                    default: true
                }    
            )
            .then(function(userResponse) {
                connection.query(queryStr2, {item_id: item}, function(err, data) {
                    if (err) throw err;
                    var productInfo = data[0];
                    //if user is ready to make the purchase
                    if (userResponse.confirmRestock) {
                        console.log("Great.");
                        //checking if we have enough inventory for purchase
                            console.log("Restocking " + quantity + " " + productInfo.product_name + "(s)."); 
                            // Construct the updating query string
                            var totalPrducts = parseInt(productInfo.stock_quantity) + parseInt(quantity);
                            //console.log(totalPrducts);
                            var updateQuantityQuery = 'UPDATE products SET stock_quantity = ' + totalPrducts + ' WHERE item_id = ' + item;
                            // Update the inventory
                            connection.query(updateQuantityQuery, function(err, data) {
                                if (err) throw err;
                                console.log("Your restock was successful. There are now " + totalPrducts + " " + productInfo.product_name + "(s) available.");
                                console.log("--------------------------------------------------------" + '\n');
                                managerGUI()    
                            })
                    //if the user selected the wrong item or quantity and confirmed so
                    //start over by running the buyProducts function.     
                    } else {
                        console.log("Ok no problem. Let's start over.");
                        managerGUI();  
                    }
                });
            });
        //else statement if the item_id number is invalid.    
        } else {
            console.log("Invalid Item ID. Please select a valid Item ID.");
            restockProducts(); 
        }  
    });
}

function productNewProduct() {
    console.log("Please follow the instructions below to add the item correctly");
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the Name of the product you would like to Add?",
            name: "productName"
        },
        {
            type: "input",
            message: "What is the Department Name?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "What is the price of the product?",
            name: "productPrice"
        },
        {
            type: "input",
            message: "How many does Bamazon have in stock?",
            name: "stockNumber"
        }
    ])
    .then(function(answer) {
        //running functions based on inquirer questions
        var itemName = answer.productName;
        var itemDepartment = answer.departmentName;
        var itemPrice = answer.productPrice;
        var itemQuantity = answer.stockNumber;
        var addProductQuery = 'INSERT INTO products SET ?';
        inquirer
        .prompt( 
            //confirm they selected the right item and quantity
            {
                type: "confirm",
                message: "You are about to add " + itemQuantity + " " + itemName + "(s) into the " + itemDepartment +
                "(s) Department. Each item will cost $" + itemPrice +  ". Is this correct?",
                name: "confirmItemAdd",
                default: true
            }    
        )
        .then(function(addItemConfirm) {
                //if user is ready to make the purchase
                if (addItemConfirm.confirmItemAdd) {
                    console.log("Great.");
                    connection.query(addProductQuery, {product_name: itemName, department_name : itemDepartment, price : itemPrice, stock_quantity : itemQuantity }, function(err, data) {
                        if (err) throw err;
                        console.log(itemQuantity + " " + itemName + "(s) at $" + itemPrice + " have been added to the " + itemDepartment + " department.");
                        console.log("--------------------------------------------------------" + '\n');
                        managerGUI()    
                    });
                //if the user selected the wrong item or quantity and confirmed so
                //start over by running the buyProducts function.     
                } else {
                    console.log("Ok no problem. Let's start over.");
                    managerGUI();  
                }
        });
    });
}

