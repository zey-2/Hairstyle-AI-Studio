import React, { useRef, useEffect, useState } from 'react';

interface ImageEditorProps {
    imageUrl: string;
    onFinish: (annotatedImage: File, adjustmentPrompt: string) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onFinish, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [adjustmentPrompt, setAdjustmentPrompt] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Set up canvas and load image
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const image = new Image();
        image.crossOrigin = 'anonymous'; // To prevent tainted canvas error
        image.src = imageUrl;
        image.onload = () => {
            // Set canvas dimensions to match image
            const aspectRatio = image.width / image.height;
            const maxWidth = 800; // Max width for the canvas
            canvas.width = Math.min(image.width, maxWidth);
            canvas.height = canvas.width / aspectRatio;
            
            // Draw image on canvas, scaling it down if necessary
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            
            // Set drawing style
            ctx.strokeStyle = '#ef4444'; // Red color for drawing
            ctx.lineWidth = Math.max(5, canvas.width * 0.01); // Scale line width with image size
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };
        image.onerror = () => {
             setError("Could not load image for editing.");
        }

    }, [imageUrl]);

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleGenerate = () => {
        if (!adjustmentPrompt.trim()) {
            setError("Please describe the adjustments you want to make.");
            return;
        }
        setError(null);

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const annotatedFile = new File([blob], 'annotated-image.png', { type: 'image/png' });
                onFinish(annotatedFile, adjustmentPrompt);
            } else {
                setError("Could not export annotated image.");
            }
        }, 'image/png');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Edit Your Image</h2>
                <p className="mt-2 text-gray-400">Draw on the image to show where you want changes, then describe the adjustment below.</p>
            </div>
            
            <div className="flex justify-center p-2 bg-gray-900/50 rounded-lg">
                 <canvas
                    ref={canvasRef}
                    className="rounded-lg max-w-full h-auto cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
            </div>
           
            <div className="space-y-4 max-w-2xl mx-auto">
                <textarea
                    value={adjustmentPrompt}
                    onChange={(e) => setAdjustmentPrompt(e.target.value)}
                    placeholder="e.g., Add a wizard hat on the drawn circle, make this area glow blue"
                    className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-gray-500 resize-none"
                    aria-label="Image adjustment prompt"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onCancel}
                        type="button"
                        className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        type="button"
                        className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg shadow-red-500/50"
                    >
                        Generate Adjustments
                    </button>
                </div>
                 {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ImageEditor;
