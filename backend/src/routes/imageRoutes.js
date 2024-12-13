const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

// Upload Images
router.post('/upload', async (req, res) => {
    try {
        const result = await imageService.uploadImages(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: 'Upload failed',
            error: error.message
        });
    }
});

// Get All Images
router.get('/', async (req, res) => {
    try {
        const images = await imageService.getAllImages();
        res.status(200).json({ images });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch images',
            error: error.message
        });
    }
});

module.exports = router;