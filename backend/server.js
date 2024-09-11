const express = require("express");
const path = require("path");
const multer = require("multer");
const Photo = require("./photoModel"); // Import the Photo model

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configure multer to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original filename
  },
});
const upload = multer({ storage }); //Initializes Multer with the defined "storage" configuration. The upload object will be used as middleware to handle incoming file uploads

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded."); // Handle case where no file is uploaded
  }

  // Save metadata to the database
  try {
    const newPhoto = new Photo({
      filename: req.file.filename,
      description: req.body.description || "",
      tags: req.body.tags || [],
    });

    await newPhoto.save(); // Save metadata to MongoDB

    res.json({
      file: req.file,
      message: "File uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving photo metadata" });
  }
});

// Route to fetch photos with pagination
app.get("/photos", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get current page from query params or default to 1 parseInt converts string to integer.
  const limit = parseInt(req.query.limit) || 10; // Get limit from query params or default to 10
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  try {
    const photos = await Photo.find()
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit); // Fetch paginated photos
    const totalPhotos = await Photo.countDocuments(); // Count total number of photos
    const totalPages = Math.ceil(totalPhotos / limit); // Calculate total pages

    res.json({
      photos,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html")); // Serve index.html from the frontend directory
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
