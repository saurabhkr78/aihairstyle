import React, { useRef, useEffect, useState } from 'react';

interface MaskEditorProps {
  imageSrc: string;
  onMaskComplete: (maskDataUrl: string) => void;
  onBack: () => void;
}

const MaskEditor: React.FC<MaskEditorProps> = ({ imageSrc, onMaskComplete, onBack }) => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);

  const MAX_DIMENSION = 600;

  useEffect(() => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const imageCanvas = imageCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!imageCanvas || !drawingCanvas) return;

      let { width, height } = image;
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }

      imageCanvas.width = width;
      imageCanvas.height = height;
      drawingCanvas.width = width;
      drawingCanvas.height = height;

      const ctx = imageCanvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, width, height);
    };
  }, [imageSrc]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
        };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleFinish = () => {
    const imageCanvas = imageCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!imageCanvas || !drawingCanvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageCanvas.width;
    tempCanvas.height = imageCanvas.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(imageCanvas, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(drawingCanvas, 0, 0);

    onMaskComplete(tempCanvas.toDataURL('image/png'));
  };

  return (
    <div className="flex flex-col items-center w-full p-8 bg-[#222222] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 max-w-3xl">
      <h2 className="text-3xl font-serif text-white mb-2 text-center">Define Your Canvas</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">Paint over the hair you wish to digitally restyle. Precision is not required.</p>
      
      <div className="relative w-full max-w-[600px] aspect-auto mx-auto mb-4 border border-gray-700 rounded-lg overflow-hidden shadow-lg" style={{aspectRatio: `${drawingCanvasRef.current?.width || 1}/${drawingCanvasRef.current?.height || 1}`}}>
        <canvas ref={imageCanvasRef} className="absolute top-0 left-0 w-full h-full" />
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm my-4">
        <label htmlFor="brush-size" className="font-medium text-sm text-gray-400">Brush Size</label>
        <input
          id="brush-size"
          type="range"
          min="10"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full sm:w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#c4a97a]"
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={onBack} className="px-6 py-2 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-semibold rounded-lg transition-colors">Back</button>
        <button onClick={handleFinish} className="px-8 py-2 bg-[#c4a97a] hover:bg-[#d4b98a] text-black font-bold rounded-lg transition-colors">Generate Styles</button>
      </div>
    </div>
  );
};

export default MaskEditor;