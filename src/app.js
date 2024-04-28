const express = require("express");
const session = require("express-session");
const uuid = require("uuid");
const app = express();
const fs = require("fs");
const path = require("path");

const folderPath = "C:\\Users\\Lucas\\gallery-dl\\pixiv\\554102 40hara";

app.use(express.static("public"));
app.use("/", express.static(folderPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "gallery-app-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Session expiration time in milliseconds
    },
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// HTML routes

app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "login.html"))
);

// API routes

app.get("/check-session", (req, res) => {
  if (req.session.userId) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/check-passcode", (req, res) => {
  const { day, month, year } = req.body;

  if (day === "26" && month === "12" && year === "2023") {
    req.session.userId = uuid.v4();
    res.json({
      success: true,
      message: "Welcome to the gallery!",
      redirect: "/",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Incorrect passcode.",
    });
  }
});

app.get("/images", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    const totalPages = Math.ceil(files.length / perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, files.length);

    const images = files.slice(startIndex, endIndex).map((file) => {
      return {
        url: file,
        name: file,
      };
    });

    res.json({ images, totalPages });
  });
});

app.get("/random-images", (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10;

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    const imageFiles = files.filter((file) => /\.(png|jpg|jpeg)$/i.test(file));
    const shuffledFiles = imageFiles.sort(() => Math.random() - 0.5);

    const images = shuffledFiles.slice(0, perPage).map((file) => {
      return {
        url: file,
        name: file,
      };
    });

    res.json({ images });
  });
});
