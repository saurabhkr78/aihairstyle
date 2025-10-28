import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access the camera. Please ensure permissions are granted and try again.");
      setShowCamera(false);
    }
  }, [stopCamera]);

  const handleSnapClick = () => {
    setShowCamera(true);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    onImageUpload(dataUrl);
    
    stopCamera();
    setShowCamera(false);
  };

  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera, startCamera, stopCamera]);


  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-fade-in">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-8">
            <button 
                onClick={() => setShowCamera(false)}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/70 text-white font-semibold rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full border-4 border-black/30 flex items-center justify-center group"
                aria-label="Capture photo"
            >
                <div className="w-16 h-16 bg-white rounded-full group-hover:bg-gray-200 transition-colors"></div>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-[60vh] min-h-[400px]">
        <div className="text-center pt-8">
            <p className="text-xl font-medium text-gray-300">Begin your transformation</p>
            <p className="text-gray-500 mt-2">Choose an option to provide your portrait</p>
            {cameraError && <p className="mt-4 text-red-300 bg-red-900/50 border border-red-700/30 p-3 rounded-lg">{cameraError}</p>}
        </div>
        
        <div className="flex items-center justify-center gap-8 md:gap-16 pb-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            
            <button 
                onClick={handleSnapClick} 
                className="flex flex-col items-center justify-center w-32 h-32 bg-black/20 border-2 border-gray-700 rounded-full hover:border-[#c4a97a] hover:bg-[#c4a97a]/10 transition-all duration-300 group"
                aria-label="Snap a Photo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 group-hover:text-[#c4a97a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            <button 
                onClick={handleUploadClick} 
                className="flex flex-col items-center justify-center w-32 h-32 bg-black/20 border-2 border-gray-700 rounded-full hover:border-[#c4a97a] hover:bg-[#c4a97a]/10 transition-all duration-300 group"
                aria-label="Upload from Gallery"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 group-hover:text-[#c4a97a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </button>
        </div>
    </div>
  );
};

export default ImageUploader;