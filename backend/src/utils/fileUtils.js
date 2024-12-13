const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const createUploadFolder = (originalFilename) => {
    // Create unique folder name with datetime and original filename
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const uniqueId = uuidv4().split('-')[0];
    const folderName = `${timestamp}_${uniqueId}_${originalFilename}`;

    // Create full path
    const fullPath = path.join(process.env.UPLOAD_DIR, folderName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    return fullPath;
};

const saveBase64Image = (base64String, folderPath, filename) => {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Create full file path
    const filePath = path.join(folderPath, filename);

    // Write file
    fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });

    return filePath;
};

const getImageDimensions = (imagePath) => {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const dimensions = require('image-size')(imageBuffer);
        return {
            width: dimensions.width,
            height: dimensions.height
        };
    } catch (error) {
        console.error('Error getting image dimensions:', error);
        return { width: 0, height: 0 };
    }
};

module.exports = {
    createUploadFolder,
    saveBase64Image,
    getImageDimensions
};