var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "NotAnother1",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    readbamazonProducts();
});

function readbamazonProducts() {
    //Grab the products from MySQL
    queryStr = 'SELECT * FROM products';

    // Make the db query
    connection.query(queryStr, function(err, data) {
    if (err) throw err;
    console.log("Here's what's in stock today: ");

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
        //console.log(res);
        buyProducts();
    })
}

//prompts the user for what action they should take
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
        // selectionConfirm(answer);
                // based on their answer, either call the bid or the post functions
                var item = answer.productNumber;
                var quantity = answer.itemQuantity;
                inquirer
                .prompt( 
                    {
                        type: "confirm",
                        message: "I see you've selected " + item + " and " + quantity + ". Is this correct?",
                        name: "confirmlast",
                        default: true
                    }    
                ).then(function(confirm) {
                    if (confirm.default === true) {
                        console.log("Ok kewl.");
                    } else {
                        console.log("No problem let's start over then.");
                        buyProducts();
                    }
                });
            });
}

// function selectionConfirm() {
//         // based on their answer, either call the bid or the post functions
//         var item = answer.productnumber;
//         var quantity = answer.itemQuantity;
//         inquirer
//         .prompt( 
//             {
//                 type: "confirm",
//                 message: "I see you've selected " + item + " and " + quantity + ". Is this correct?",
//                 name: "confirmlast",
//                 default: true
//             }    
//         ).then(console.log("We outta dat."));
// }


  //connection.end();