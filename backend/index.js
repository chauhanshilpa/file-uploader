const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
require("dotenv").config();

const PORT = 4004;
const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  
  let resourceType = "auto";
  if (file.mimetype.startsWith("image")) {
    resourceType = "image";
  } else if (file.mimetype.startsWith("video")) {
    resourceType = "video";
  } else if (file.mimetype.startsWith("audio")) {
    resourceType = "auto";
  } else if (file.mimetype === "application/pdf") {
    resourceType = "raw";
  }

  cloudinary.uploader
    .upload_stream({ resource_type: resourceType }, (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Failed to upload file." });
      }
      res.json({
        message: "file uploaded successfully!",
        url: result.secure_url,
      });
    })
    .end(file.buffer);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
