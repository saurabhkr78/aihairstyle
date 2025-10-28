import React, { useState, useCallback } from 'react';
import { AppStep, HairstyleSuggestion, AnalysisResult } from './types';
import ImageUploader from './components/ImageUploader';
import MaskEditor from './components/MaskEditor';
import ResultsDisplay from './components/ResultsDisplay';
import ProcessingView from './components/ProcessingView';
import { analyzeFaceAndSuggestHairstyles, inpaintHairstyle } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [maskedImage, setMaskedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setStep(AppStep.MASK);
  };

  const processImages = useCallback(async (base64MaskedImage: string) => {
    if (!originalImage) return;

    try {
      setProcessingMessage('Analyzing your facial architecture...');
      const analysis = await analyzeFaceAndSuggestHairstyles(originalImage);
      setAnalysisResult(analysis);

      const updatedHairstyles: HairstyleSuggestion[] = [];

      for (let i = 0; i < analysis.hairstyles.length; i++) {
        const style = analysis.hairstyles[i];
        setProcessingMessage(`Generating look ${i + 1} of ${analysis.hairstyles.length}: ${style.name}`);
        
        const generatedImageDataUrl = await inpaintHairstyle(base64MaskedImage, style.name);
        updatedHairstyles.push({ ...style, generatedImage: generatedImageDataUrl });
        
        setAnalysisResult(prev => prev ? ({ ...prev, hairstyles: [...updatedHairstyles, ...analysis.hairstyles.slice(updatedHairstyles.length)] }) : null);
      }

      setStep(AppStep.RESULTS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during AI processing.');
      setStep(AppStep.ERROR);
    }
  }, [originalImage]);

  const handleMaskComplete = (maskedImageDataUrl: string) => {
    setMaskedImage(maskedImageDataUrl);
    setStep(AppStep.PROCESSING);
    processImages(maskedImageDataUrl);
  };

  const handleReset = () => {
    setStep(AppStep.UPLOAD);
    setOriginalImage(null);
    setMaskedImage(null);
    setAnalysisResult(null);
    setError(null);
    setProcessingMessage('');
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.UPLOAD:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppStep.MASK:
        return originalImage && <MaskEditor imageSrc={originalImage} onMaskComplete={handleMaskComplete} onBack={handleReset} />;
      case AppStep.PROCESSING:
        return <ProcessingView message={processingMessage} suggestions={analysisResult?.hairstyles} />;
      case AppStep.RESULTS:
        return analysisResult && <ResultsDisplay analysisResult={analysisResult} onReset={handleReset} />;
      case AppStep.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/50 border border-red-700/30 rounded-lg max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold text-red-200 mb-4">An Error Occurred</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-300 hover:bg-white text-black font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#c4a97a]">
          Hairstyle AI
        </h1>
        <p className="mt-4 text-lg text-gray-400">Snap, Style, Slay</p>
      </header>
      <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;