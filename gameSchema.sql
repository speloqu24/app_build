DROP DATABASE IF EXISTS games_db;
CREATE DATABASE games_db;
USE games_db;

CREATE TABLE users (
id INT NOT NULL AUTO_INCREMENT,
fullName varchar(200) NOT NULL,
bio varchar(300),
favGame varchar(100),
email varchar(100),
PRIMARY KEY (id) );

CREATE TABLE games (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
gameTitle varchar(200), 
gameYR varchar (2000), 
rating DECIMAL (65)
);

INSERT INTO games VALUES (0, "Gauntlet", "1980", 10);

-- INSERT INTO users VALUES (0, "samantharae");
SELECT * FROM users;
SELECT * FROM games;