const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    originalFilename: {
        type: String,
        required: true
    },
    uploadDateTime: {
        type: Date,
        default: Date.now
    },
    originalImagePath: {
        type: String,
        required: true
    },
    maskedImagePath: {
        type: String
    },
    brushSize: {
        type: Number,
        required: true
    },
    imageWidth: {
        type: Number
    },
    imageHeight: {
        type: Number
    }
});

module.exports = mongoose.model('Image', ImageSchema);