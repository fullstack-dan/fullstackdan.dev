const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs"); // Set up EJS for templates

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("<a href='https://fullstackdan.dev'>Blog</a>");
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

app.get("/blog", (req, res) => {
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
        // No post found with this ID (you might want to send a 404 response)
        res.status(404).send("Post not found");
        return;
      }

      // Render the 'post' view and pass it the post data
      results[0].body = results[0].body.replace(/\n/g, "<br>");
      res.render("post", { post: results[0] });
    }
  );
});

app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
