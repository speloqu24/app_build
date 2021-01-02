DROP DATABASE IF EXISTS games_db;
CREATE DATABASE games_db;
USE games_db;

CREATE TABLE users (
id INT NOT NULL AUTO_INCREMENT,
fullName varchar(200) NOT NULL,
-- bio varchar(300),
-- email varchar(100),
PRIMARY KEY (id) );


SELECT * FROM users;