const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/photo-gallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected')) // Log successful connection
.catch((error) => console.log('Error connecting to MongoDB:', error)); // Log connection errors

// Export the mongoose connection
module.exports = mongoose;
