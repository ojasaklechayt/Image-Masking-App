const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const { createUploadFolder, saveBase64Image, getImageDimensions } = require('../utils/fileUtils');

class ImageService {
    async uploadImages(imageData) {
        try {
            // Create upload folder
            const uploadFolder = createUploadFolder(imageData.originalFilename);

            // Save original image
            const originalImagePath = saveBase64Image(
                imageData.originalImage,
                uploadFolder,
                'original_image.png'
            );

            // Save masked image
            const maskedImagePath = saveBase64Image(
                imageData.maskedImage,
                uploadFolder,
                'masked_image.png'
            );

            // Get image dimensions
            const dimensions = getImageDimensions(originalImagePath);

            // Create image metadata
            const imageMetadata = new Image({
                originalFilename: imageData.originalFilename,
                originalImagePath: path.relative(process.cwd(), originalImagePath),
                maskedImagePath: path.relative(process.cwd(), maskedImagePath),
                brushSize: imageData.brushSize,
                imageWidth: dimensions.width,
                imageHeight: dimensions.height
            });

            // Save metadata to MongoDB
            await imageMetadata.save();

            return {
                message: 'Images uploaded successfully',
                folder: path.basename(uploadFolder),
                metadataId: imageMetadata._id
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    async getAllImages() {
        try {
            const images = await Image.find({});
            return images.map(img => ({
                id: img._id,
                filename: img.originalFilename,
                uploadDateTime: img.uploadDateTime,
                originalPath: img.originalImagePath,
                maskedPath: img.maskedImagePath
            }));
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    }
}

module.exports = new ImageService();