const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const multer = require("multer");
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
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
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

//HOME PAGE
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, data) => {
    if (err) {
      return res.status(500).end();
    }
    res.render("index");
  });
});

//ALL USERS PAGE ROUTE
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, data) => {
    if (err) {
      return res.status(500).end();
    }
    res.render("users", { users: data });
  });
});

//GAMES PAGE ROUTE
app.get("/games", (req, res) => {
  connection.query("SELECT * FROM games", (err, data) => {
    if (err) {
      return res.status(500).end();
    }
    res.render("games", { games: data });
  });
});

// INDIVIDUAL USERS ROUTE
app.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) throw err;
      // console.log(data);
      res.render("gamerinfo", { user: data[0] });
    }
  );
});

// POST USER INFO TO USERS TABLE
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

// POST GAMES INFO TO GAMES TABLE
app.post("/games", (req, res) => {
  connection.query(
    "INSERT INTO games (gameTitle, gameYR, rating) VALUES (?, ?, ?)",
    [req.body.gameTitle, req.body.gameYR, req.body.rating],
    (err, result) => {
      if (err) throw err;
      res.redirect("/games");
    }
  );
});

// MULTER IMAGE STORAGE - DOESN'T WORK

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// MULTER UPLOAD ROUTE

app.post("/upload", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    message = "Error!";
    res.render("/users");
  } else {
    connection.query(
      "INSERT INTO uploads (filename, size) VALUES ('" +
        req.file.filename +
        "', '" +
        req.file.mimetype +
        "', '" +
        req.file.size +
        "')",
      (err, result) => {
        if (err) throw err;
        res.redirect("/games");
      }
    );
  }

  // try {
  //   return res.status(201).json({
  //     message: "File uploaded!",
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
});

app.listen(PORT, () =>
  console.log(`Server listening on: http://localhost:${PORT}`)
);
