const express = require("express");
const session = require("express-session");
const uuid = require("uuid");
const app = express();
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const mime = require("mime-types");
const util = require("util");

const prisma = new PrismaClient();

app.use(express.static("public"));
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

// API routes

app.get("/one", async (req, res) => {
  try {
    // Get total count of images
    const totalImages = await prisma.image.count();

    // Generate random skip amount
    const randomSkip = Math.floor(Math.random() * totalImages);

    const image = await prisma.image.findFirst({
      skip: randomSkip,
      select: {
        data: true,
        mimeType: true,
        filename: true,
      },
    });

    if (!image) {
      return res.status(404).json({ error: "No images found" });
    }

    const imageData = {
      url: `data:${image.mimeType};base64,${image.data.toString("base64")}`,
      filename: image.filename,
    };

    res.json({ image: imageData });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get("/many", async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 30;

  try {
    const images = await prisma.image.findMany({
      take: perPage,
      orderBy: {
        // Postgres-specific random ordering
        createdAt: "asc",
      },
      select: {
        data: true,
        mimeType: true,
        filename: true,
      },
    });

    // Shuffle the results in memory
    const shuffledImages = images
      .sort(() => Math.random() - 0.5)
      .map((image) => {
        return {
          url: `data:${image.mimeType};base64,${image.data.toString("base64")}`,
          filename: image.filename,
        };
      });

    res.json({ images: shuffledImages });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// app.post("/post", async (req, res) => {
//   // TODO: Add authentication middleware
//   try {
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ error: "No image file uploaded" });
//     }

//     const imageFile = req.files.image;
//     const filename = imageFile.name;
//     const mimeType = imageFile.mimetype || "application/octet-stream";

//     // Check if image already exists
//     const existingImage = await prisma.image.findFirst({
//       where: { filename: filename },
//     });

//     if (existingImage) {
//       return res.status(409).json({
//         error: "An image with this filename already exists",
//       });
//     }

//     await prisma.image.create({
//       data: {
//         filename: filename,
//         title: path.parse(filename).name,
//         data: imageFile.data,
//         mimeType: mimeType,
//       },
//     });

//     res.status(201).json({
//       message: "Image uploaded successfully",
//       filename: filename,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({
//       error: "An error occurred during upload",
//       details: error.message,
//     });
//   }
// });

// Cleanup function for Prisma
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
