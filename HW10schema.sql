-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect animals_db --
USE bamazon;

-- Creates the table "people" within animals_db --
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Bananas", "Food & Grocery", 1.40, 50);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Red Bull Energy Drink 24 Pack", "Food & Grocery", 32.00, 23);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Rayban Aviators", "Fashon", 122.98, 364);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Samsung 4k 55 TV", "Electronics", 597.99, 68);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Hand Sanitizer", "Food & Grocery", 8.53, 97);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("AA Batteries", "Electronics", 12.59, 33);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("GoPro Hero5", "Electronics", 286.98, 56);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Echo", "Electronics", 99.99, 562);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("E.T. the Extra-Terrestial for Atari", "Gaming", 2.85, 10000);

INSERT INTO people (product_name, department_name, price, stock_quantity)
VALUES ("Crayola Ultimate Crayon Collection 152 Pieces", "Arts & Crafts", 14.85, 201);

-- Updates the row where the column name is peter --
UPDATE products
SET has_pet = true, pet_name = "Franklin", pet_age = 2
WHERE name = "Peter";

-- select and view all products --
select * from products