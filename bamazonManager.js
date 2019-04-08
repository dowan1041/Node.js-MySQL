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
    console.log("\n connected as id: " + connection.threadId);
    console.log("\n ---- Welcome, Bamazon Manager! ---- \n")
    managerView();
});

function managerView() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: "Please, select one of following options.",
                choices: ['Products for sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT']
            }
        ]).then(function(answer) {
            switch(answer.option) {
                case 'Products for sale':
                    saleProduct();
                    break;

                case 'View Low Inventory':
                    lowInventory();
                    break;

                case 'Add to Inventory':
                    addInventory();
                    break;

                case 'Add New Product':
                    newProduct();
                    break;

                case 'EXIT':
                    connection.end();
            }
        })
}

function saleProduct() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log('\n ----- Inventory ----- \n');
        console.table(res);
        managerWork();
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE quantity < 5;", function(err, res) {
        if (err) throw err;
        console.log('\n ----- Low Inventory ----- \n')
        if (res[0] === undefined) {
            console.log ('There is no low inventories. \n')
        } else {
            console.table(res);
        }
        managerWork();
    })
};

function addInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log('\n ----- Restock Inventory ----- \n');
        var itemName =[];
        for (i=0; i<res.length; i++){
            itemName.push(res[i].product_name);
        }
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'restockname',
                    message: 'What item do you want to restock?',
                    choices: itemName
                },
                {
                    type: 'input',
                    name: 'numberofrestock',
                    message: 'How many items do you want to restock?',
                    validate: function(value) {
                        if(isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ])
            .then(function(answer) {
                var restockedQty;
                var currentQty;
                for(var i=0; i<res.length; i++) {
                    if(res[i].product_name === answer.restockname) {
                        currentQty = res[i].quantity;
                        restockedQty = parseInt(currentQty) + parseInt(answer.numberofrestock);
                    }
                }
                connection.query('UPDATE products SET ? WHERE ?' ,
                [
                    {
                        quantity: restockedQty
                    },
                    {
                        product_name: answer.restockname
                    }
                ], function(err, res) {
                    if(err) throw err;
                    // console.log(currentQty);
                    // console.log(restockedQty);
                    console.log("\nThe quantity of " + answer.restockname + "is updated! \n");
                    console.log('The currrent quantity of '+ answer.restockname + " is " + restockedQty+".\n")
                    managerWork();
                })
            })
    })
};

function newProduct() {
    console.log('\n ----- Add New Products ----- \n');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'productname',
                message: 'Please enter the new product name'
            },
            {
                type: 'input',
                name: 'departmentname',
                message: 'Please enter the product of the department',
            },
            {
                type: 'input',
                name: 'itemprice',
                message: 'What is the price of the product?',
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    } else {
                        console.log('Please enter correct price!')
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'itemquantity',
                message: 'What is the quantity of the product?',
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    } else {
                        console.log('Please enter correct price!')
                        return false;
                    }
                }
            }
        ]).then(function(answer) {
            var newItemList = "product name: " + answer.productname + "\n" 
            + "department: " + answer.departmentname + "\n" 
            + "price: " + answer.itemprice + "\n" 
            + "quantity: " + answer.itemquantity
            
            connection.query('INSERT INTO products SET ?', {
                product_name: answer.productname,
                department_name: answer.departmentname,
                price: answer.itemprice,
                quantity: answer.itemquantity
            }, function(err,res) {
                if (err) throw err;
                console.log("You added the following item successfully! \n" + newItemList);
                managerWork();
            })
        })
};

function managerWork() {
    inquirer
        .prompt([
            {
            type: 'confirm',
            name: 'anythingelse',
            message: 'Would you like to do something esle?',
            dafault: false
            }
        ]).then(function(answer) {
            if (answer.anythingelse === true) {
                managerView();
            } else {
                console.log("\n Thank you for visiting Bamazon. \n")
                connection.end();
                }
            });
}