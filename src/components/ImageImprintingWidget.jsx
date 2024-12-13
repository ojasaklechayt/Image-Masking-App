import { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';

const ImageImprintingWidget = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [brushSize, setBrushSize] = useState(10);
    const canvasRef = useRef(null);

    const handleImageUpload = () => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target.result);
                setMaskImage(null);
            }

            reader.readAsDataURL(file);
        }
    };

    const generateMask = () => {
        if (canvasRef.current) {
            const tempCanvas = document.createElement('canvas');
            const tempctx = tempCanvas.getContext('2d');

            tempCanvas.width = 600;
            tempCanvas.height = 400;

            tempctx.fillStyle = 'black';
            tempctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            const drawingDataUrl = canvasRef.current.canvas.drawing.toDataURL();
            const drawingImage = new Image();

            drawingImage.onload = () => {
                tempctx.globalCompositeOperation = 'destination-out';
                tempctx.drawImage(drawingImage, 0, 0);

                const maskDataUrl = tempCanvas.toDataURL();
                setMaskImage(maskDataUrl);
            }
            drawingImage.src = drawingDataUrl;
        }
    }

    const clearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setMaskImage(null)
        }
    }
    return (
        <div className='bg-white shadow-md rounded-lg p-6'>
            <h2 className='text-2xl font-bold mb-4 text-center'>
                Image Imprinting Widget
            </h2>

            <div className='mb-4 text-center'>
                <input
                    type='file'
                    accept='image/jpeg, image/png'
                    onChange={handleImageUpload}
                    className='mx-auto'
                />
            </div>

            {/* Canvas for Drawing */}
            {originalImage && (
                <div className="flex flex-col items-center space-y-4">
                    <CanvasDraw
                        ref={canvasRef}
                        imgSrc={originalImage}
                        brushRadius={brushSize}
                        brushColor="white"
                        canvasWidth={600}
                        canvasHeight={400}
                    />

                    {/* Brush Size Control */}
                    <div className="flex items-center space-x-2">
                        <label>Brush Size:</label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-64"
                        />
                        <span>{brushSize}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={generateMask}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Generate Mask
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Clear Canvas
                        </button>
                    </div>
                </div>
            )}

            {/* Image Display */}
            {originalImage && maskImage && (
                <div className="flex justify-center space-x-4 mt-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Original Image</h3>
                        <img
                            src={originalImage}
                            alt="Original"
                            className="max-w-[300px] max-h-[300px] border rounded"
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Generated Mask</h3>
                        <img
                            src={maskImage}
                            alt="Mask"
                            className="max-w-[300px] max-h-[300px] border rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageImprintingWidget;