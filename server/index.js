const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const { readImagesFile, writeImagesFile } = require('./utils/jsonUtils');
const app = express();
const PORT = 5050 || process.env.PORT;

// Allow requests from client-side
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Set /public folder as static folder that will serve images as http://localhost:5050/images/imageName.jpg
app.use(express.static('public'));

// Setup multer config:
// - destination: where to save the uploaded images
// - filename: rename the file to be unique, ie: '1671042397477-imageName.jpg'
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/images');
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// Create an upload method passing in the config from above
const upload = multer({ storage });

// File upload endpoint, using multer instance .single method as a middleware to upload the file.
// The parameter ('imageFile') needs to match the value of the name attribute of the file input on front-end
app.post('/upload-image', upload.single('imageFile'), (req, res) => {
  const title = (req.body.imageTitle || '').trim();
  const description = (req.body.imageDescription || '').trim();
  if (!title || !description || !req.file) {
    return res.status(400).json({ error: 'Title, description, and image file are required.' });
  }

  // Read images JSON file
  const images = readImagesFile();

  // Create new image object
  // Text fields are available under req.body
  // File object is available under req.file (or req.files if using upload.array)
  const newImage = {
    id: uuid(),
    title,
    description,
    tags: [...new Set((req.body.imageTags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean))],
    src: `images/${req.file.filename}`
  };

  // Add new image object to the front of array
  images.unshift(newImage);

  // Update the images JSON file with new value
  writeImagesFile(images);

  // Respond back with new image object
  res.status(201).json(newImage);
});

app.get('/image-gallery', (_req, res) => {
  const images = readImagesFile();
  res.status(200).json(images);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});