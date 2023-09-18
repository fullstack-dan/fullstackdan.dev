const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const pool = require("./db");
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
app.use(express.json());

app.get("/", (req, res) => {
  res.render("blog");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const port = process.env.PORT || 3000;

pool.query("SELECT 1", (error, results) => {
  if (error) {
    console.error("Error connecting to the database:", error);
    return;
  }
  console.log("Connected to the database!");
});

app.post("/api/posts", (req, res) => {
  const { title, description, content, tags } = req.body;

  pool.query(
    `INSERT INTO posts (title, description, body, author)
     VALUES (?, ?, ?, ?)`,
    [title, description, content, "daniel a."],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ status: "error" });
        return;
      }

      const postId = results.insertId;

      if (tags === "new") {
        const newTag = req.body.newTag;

        pool.query(
          `INSERT INTO tags (tag_name) VALUES (?)`,
          [newTag],
          (err, tagResults) => {
            if (err) {
              console.log(err);
              res.status(500).json({ status: "error" });
              return;
            }

            const tagId = tagResults.insertId;

            pool.query(
              `INSERT INTO post_tags (id, tag_id) VALUES (?, ?)`,
              [postId, tagId],
              (err) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ status: "error" });
                  return;
                }

                res.json({ status: "success" });
              }
            );
          }
        );
      } else {
        const tagId = tags;

        pool.query(
          `INSERT INTO post_tags (id, tag_id) VALUES (?, ?)`,
          [postId, tagId],
          (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ status: "error" });
              return;
            }

            res.json({ status: "success" });
          }
        );
      }
    }
  );
});

app.get("/api/posts", (req, res) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
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
  pool.query("SELECT * FROM post_tags", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/tags", (req, res) => {
  pool.query("SELECT * FROM tags", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/api/tags/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM tags WHERE tag_id = ?", [id], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/tags", (req, res) => {
  res.render("tags", { tagId: 0 });
});

app.get("/tags/:id", (req, res) => {
  res.render("tags", { tagId: req.params["id"] });
});

app.get("/add-post", (req, res) => {
  res.render("add-post");
});

app.post("/api/add-changelog", (req, res) => {
  const change = req.body.change;
  const changeLogPath = path.join(__dirname, "/public/resources/changelog.txt");

  fs.appendFile(changeLogPath, `${change}\n`, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while writing to the file.");
    } else {
      res.status(200).send("Change added successfully!");
    }
  });
});

app.get("/api/get-changelog", (req, res) => {
  const changeLogPath = path.join(__dirname, "/public/resources/changelog.txt");

  fs.readFile(changeLogPath, "utf8", function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while reading the file.");
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/changelog", (req, res) => {
  res.render("changelog");
});

app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
