DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,2) NULL,
    quantity INTEGER,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("vitamin", "Health", 11.00, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("camera", "Home", 129.99, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("Elderberry Gummies", "Health", 10.08, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("coffee maker", "Kitchen", 10.08, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("headphones", "electronics", 33.14, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("toy cars", "toys", 12.93, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("wifi router", "electronics", 56.99, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("toy rescue boat", "toys", 16.24, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("sleetp aid", "Health", 16.07, 10);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("hexagon tent", "home", 32.25, 10);