var inquirer = require('inquirer');
var mysql = require('mysql');
require('console.table');

var divider = '\n-----------------------------------\n';

var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    welcomeBamazon();
});

function welcomeBamazon() {
    inquirer
        .prompt([
            {
            type: 'confirm',
            name: 'firstvisit',
            message: 'Do you want to view our inventory?',
            dafault: false
        }
    ]).then(function(answer) {
        if (answer.firstvisit === true) {
            showInventory();
        } else {
            console.log("Thank you for visiting Bamazon. \n")
            connection.end();
        }
    });
}

function showInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.table(res);
        // for (var i=0; i < res.length; i++) {
        //     console.log("Item ID: " + res[i].item_id);
        // console.log("Product: " + res[i].product_name);
        // console.log("Department: " + res[i].deaprtment_name);
        // console.log("Price: $" + res[i].price)
        // console.log("Quantity: " + res[i].quantity);
        // console.log("----------------------------------");
        // }

        inquirer
        .prompt([
            {
                type: 'input',
                name: "id",
                message: "What is the ID number of the product you want to place in order?",
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }

            },
            {
                type: 'input',
                name: "qty",
                message: "How many items do you want to buy?",
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]).then(function(answer){
            var idItem = answer.id - 1;
            var nameItem = res[idItem].product_name;
            var userQuantity = parseInt(answer.qty);
            var bamazonQuantity = parseInt(res[idItem].quantity);
            var priceItem = parseFloat(res[idItem].price);
            var totalPrice = parseFloat(userQuantity * priceItem);
            var quantityLeft = bamazonQuantity - userQuantity;
            // console.log(idItem+1);
            // console.log(nameItem);
            // console.log(userQuantity);
            // console.log(bamazonQuantity);
            // console.log(priceItem);
            // console.log(totalPrice);
            // console.log(quantityLeft);
            if (answer.id > 10) {
                console.log("Sorry, Itme does not exist. Please, search again. \n")
                shopAgain();
            }
            if(bamazonQuantity >= userQuantity) {
                connection.query("UPDATE products SET ? WHERE ?", 
                [
                    {
                        quantity: quantityLeft
                    },
                    {
                        item_id: idItem + 1
                    }
                ], function(err){
                    if (err) throw err;
                    console.log(divider);
                    console.log("Success! You placed " + userQuantity + " of " + nameItem + " in order.");
                    console.log("\nYour total is " + totalPrice);
                    console.log(divider);
                    shopAgain();
                })
            } else {
                console.log("Sorry, Insufficient quantity! Please, check later. \n")
                shopAgain();
            }

        })
    })
}

function shopAgain() {
    inquirer
        .prompt([
            {
            type: 'confirm',
            name: 'again',
            message: 'Would you like to see our inventory to continue shopping? \n',
            dafault: false
                }
        ]).then(function(yes){
            if (yes.again === true) {
                showInventory();
            } else {
                console.log("\nThank you for visiting Bamazon.\n")
                connection.end();
            }
        })
}