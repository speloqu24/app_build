const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
// const { endianness } = require("os");
const path = require("path");

const app = express();

// establish the port
const PORT = process.env.PORT || 8080;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(express.static("public"));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Blink182!",
  database: "games_db",
});

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }

  console.log(`connected as id ${connection.threadId}`);
});

//ROUTES
// view route, HOME PAGE
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, data) => {
    if (err) {
      return res.status(500).end();
    }
    res.render("index", { users: data });
  });
});

// view route for all listed gamers
app.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) throw err;
      console.log(data);
      res.render("gamerinfo", { user: data[0] });
    }
  );
});

app.get("/games", (req, res) => {
  connection.query("SELECT * FROM games", (err, data) => {
    if (err) {
      console.log("games page");
      res.status(500).end();
    }
    res.render("fullGameList", { games: data[0] });
  });
});

app.post("/", (req, res) => {
  connection.query(
    "INSERT INTO users (fullName, email, bio, favGame) VALUES (?, ?, ?, ?)",
    // ?, ?, ?
    // , email, bio
    // , req.body.email , req.body.bio
    [req.body.fullName, req.body.email, req.body.bio, req.body.favGame],
    (err, result) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.listen(PORT, () =>
  console.log(`Server listening on: http://localhost:${PORT}`)
);
