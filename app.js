const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("<a href='https://fullstackdan.dev'>Blog</a>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "flstkdn_blogs",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

app.get("/blog", (req, res) => {
  connection.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/blog/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM posts WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.json(results[0]);
    }
  );
});

app.use(express.static("public"));
