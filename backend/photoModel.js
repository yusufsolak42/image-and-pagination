const mongoose = require('./db'); // Import mongoose connection

// Define the schema for photo metadata
const photoSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    description: { type: String },
    tags: [String],
    uploadDate: { type: Date, default: Date.now }
});

// Create a model from the schema. Mongoose saves the model name as photos automatically
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
