import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CanvasDraw from 'react-canvas-draw';

const ImageInpaintingWidget = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [brushSize, setBrushSize] = useState(10);
    const [originalFilename, setOriginalFilename] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const canvasRef = useRef(null);

    // Fetch uploaded images on component mount
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/images/');
                console.log(response.data.images);
                setUploadedImages(response.data.images || []); // Ensures response structure
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target.result);
                setOriginalFilename(file.name);
                setMaskImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate mask from canvas drawing
    const generateMask = () => {
        if (canvasRef.current) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = 600;
            tempCanvas.height = 400;
            tempCtx.fillStyle = 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            const drawingDataUrl = canvasRef.current.canvas.drawing.toDataURL();
            const drawingImage = new Image();
            drawingImage.onload = () => {
                tempCtx.globalCompositeOperation = 'destination-out';
                tempCtx.drawImage(drawingImage, 0, 0);
                const maskDataUrl = tempCanvas.toDataURL();
                setMaskImage(maskDataUrl);
            };
            drawingImage.src = drawingDataUrl;
        }
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setMaskImage(null);
        }
    };

    const handleUpload = async () => {
        if (!originalImage || !maskImage) {
            alert('Please upload an image and generate a mask first.');
            return;
        }

        setIsUploading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/images/upload', {
                originalImage,
                maskedImage: maskImage,
                originalFilename,
                brushSize
            });

            console.log('Uploaded Successfully', response.data);
            alert('Images uploaded successfully!');
            // Fetch updated images after successful upload
            const updatedImages = await axios.get('http://localhost:5000/api/images/');
            setUploadedImages(updatedImages.data.images || []);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle selecting an existing image for editing
    const handleEditImage = (image) => {
        setOriginalImage(`http://localhost:5000/${image.originalPath}`);
        setOriginalFilename(image.filename);
        setMaskImage(`http://localhost:5000/${image.maskedPath}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
                    <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                        Image Inpainting Widget
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <label className="block w-full max-w-md">
                            <span className="sr-only">Choose image</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                            />
                        </label>
                    </div>

                    {/* Existing Images */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-700">Uploaded Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {uploadedImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleEditImage(image)}
                                >
                                    <h4 className="text-sm font-medium text-center mb-2 text-gray-700">
                                        {image.filename}
                                    </h4>

                                    {/* Flex container to show original and masked images side by side */}
                                    <div className="flex justify-between gap-4">
                                        <div className="w-1/2">
                                            <img
                                                src={`http://localhost:5000/${image.originalPath}`}
                                                alt="Original"
                                                className="w-full h-auto object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <img
                                                src={`http://localhost:5000/${image.maskedPath}`}
                                                alt="Masked"
                                                className="w-full h-auto object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display Original Image and Mask Image */}
                    {originalImage && (
                        <div className="flex flex-col items-center space-y-4">
                            {/* Canvas */}
                            <div className="border-4 border-blue-200 rounded-lg shadow-md">
                                <CanvasDraw
                                    ref={canvasRef}
                                    imgSrc={originalImage}
                                    brushRadius={brushSize}
                                    brushColor="white"
                                    canvasWidth={600}
                                    canvasHeight={400}
                                    hideGrid={true}
                                    className="rounded-md"
                                />
                            </div>

                            {/* Brush Size Control */}
                            <div className="flex items-center space-x-4 w-full max-w-md">
                                <label className="text-gray-700 font-medium">Brush Size:</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="flex-grow h-2 bg-blue-200 rounded-full appearance-none"
                                />
                                <span className="w-10 text-center text-gray-700 font-bold">
                                    {brushSize}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={generateMask}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Generate Mask
                                </button>
                                <button
                                    onClick={clearCanvas}
                                    className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Clear Canvas
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    {originalImage && maskImage && (
                        <div>
                            <div className="flex space-x-4">
                                <div className="border-4 border-blue-200 rounded-lg shadow-md">
                                    <img src={originalImage} alt="Original" className="w-96 h-auto object-cover rounded-md" />
                                </div>

                                <div className="border-4 border-green-200 rounded-lg shadow-md">
                                    <img src={maskImage} alt="Mask" className="w-96 h-auto object-cover rounded-md" />
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className={`px-8 py-3 text-white rounded-full ${isUploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        } transition-all duration-300`}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Images'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageInpaintingWidget;
