import { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';

const ImageInpaintingWidget = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [brushSize, setBrushSize] = useState(10);
    const canvasRef = useRef(null);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target.result);
                setMaskImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate mask from canvas drawing
    const generateMask = () => {
        if (canvasRef.current) {
            // Create a temporary canvas to process the mask
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            // Set canvas dimensions to match the drawing canvas
            tempCanvas.width = 600;
            tempCanvas.height = 400;

            // Fill the entire canvas with black first
            tempCtx.fillStyle = 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Get the drawing canvas image
            const drawingDataUrl = canvasRef.current.canvas.drawing.toDataURL();

            // Create an image element to draw the drawing onto the temp canvas
            const drawingImage = new Image();
            drawingImage.onload = () => {
                // Set composite operation to draw white over black
                tempCtx.globalCompositeOperation = 'destination-out';
                tempCtx.drawImage(drawingImage, 0, 0);

                // Convert processed canvas to data URL
                const maskDataUrl = tempCanvas.toDataURL();
                setMaskImage(maskDataUrl);
            };
            drawingImage.src = drawingDataUrl;
        }
    };

    // Clear canvas
    const clearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setMaskImage(null);
        }
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
                                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    transition-all duration-300"
                            />
                        </label>
                    </div>

                    {/* Canvas for Drawing */}
                    {originalImage && (
                        <div className="flex flex-col items-center space-y-4">
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
                                    className="flex-grow h-2 bg-blue-200 rounded-full appearance-none
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6 
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:bg-blue-600
                    [&::-webkit-slider-thumb]:rounded-full
                    hover:[&::-webkit-slider-thumb]:bg-blue-700
                    transition-all duration-300"
                                />
                                <span className="w-10 text-center text-gray-700 font-bold">
                                    {brushSize}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={generateMask}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full 
                    hover:bg-blue-700 transform hover:scale-105 
                    transition-all duration-300 
                    shadow-md hover:shadow-lg 
                    flex items-center space-x-2"
                                >
                                    <span>Generate Mask</span>
                                </button>
                                <button
                                    onClick={clearCanvas}
                                    className="px-6 py-2 bg-red-500 text-white rounded-full 
                    hover:bg-red-600 transform hover:scale-105 
                    transition-all duration-300 
                    shadow-md hover:shadow-lg 
                    flex items-center space-x-2"
                                >
                                    <span>Clear Canvas</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Display */}
                    {originalImage && maskImage && (
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">
                                    Original Image
                                </h3>
                                <div className="flex justify-center">
                                    <img
                                        src={originalImage}
                                        alt="Original"
                                        className="max-w-full max-h-[400px] rounded-lg 
                        border-4 border-blue-200 object-contain"
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">
                                    Generated Mask
                                </h3>
                                <div className="flex justify-center">
                                    <img
                                        src={maskImage}
                                        alt="Mask"
                                        className="max-w-full max-h-[400px] rounded-lg 
                        border-4 border-blue-200 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageInpaintingWidget;