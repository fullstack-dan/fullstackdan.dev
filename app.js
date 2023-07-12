const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");

var corsOptions = {
  origin: function (origin, callback) {
    var allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost",
      "https://fullstackdan.dev",
      "https://blog.fullstackdan.dev",
      "https://fullstackdan-dev.onrender.com",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.render("blog");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const port = process.env.PORT || 3000;

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

app.get("/api/posts", (req, res) => {
  connection.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted_date FROM posts WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        res.status(404).send("Post not found");
        return;
      }

      results[0].body = results[0].body.replace(/\n/g, "<br>");
      res.render("post", { post: results[0] });
    }
  );
});

app.get("/api/post-tags", (req, res) => {
  connection.query("SELECT * FROM post_tags", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/tags", (req, res) => {
  connection.query("SELECT * FROM tags", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/tags/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM tags WHERE tag_id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.get("/tags", (req, res) => {
  res.render("tags", { tagId: 0 });
});

app.get("/tags/:id", (req, res) => {
  res.render("tags", { tagId: req.params["id"] });
});

app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
