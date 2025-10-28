import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  analysisResult: AnalysisResult;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysisResult, onReset }) => {
  const formatFileName = (name: string) => {
    return `hairstyle-ai-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  return (
    <div className="w-full max-w-5xl p-8 sm:p-10 bg-[#1f1f1f] border border-gray-800 rounded-xl shadow-2xl shadow-black/40 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#c4a97a]">Your AI Style Report</h2>
        <p className="mt-3 text-lg text-gray-400">A curated selection of styles based on your unique features.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 text-center">
        <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Face Shape</span>
            <p className="text-lg font-semibold text-gray-200">{analysisResult.face_shape}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Forehead</span>
            <p className="text-lg font-semibold text-gray-200">{analysisResult.forehead_size}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Jawline</span>
            <p className="text-lg font-semibold text-gray-200">{analysisResult.jawline}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Hair Texture</span>
            <p className="text-lg font-semibold text-gray-200">{analysisResult.hair_texture}</p>
        </div>
      </div>
      
      <div className="space-y-16">
        {analysisResult.hairstyles.map((style, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center border-t border-gray-800 pt-12 first:border-t-0 first:pt-0">
            <div className="relative flex-shrink-0 w-full h-96 rounded-lg overflow-hidden shadow-lg shadow-black/40 bg-black/20 order-1 group">
              {style.generatedImage ? (
                <>
                  <img src={style.generatedImage} alt={`Generated hairstyle: ${style.name}`} className="w-full h-full object-cover" />
                  <a
                    href={style.generatedImage}
                    download={formatFileName(style.name)}
                    className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-gray-300 hover:bg-[#c4a97a] hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Save Hairstyle"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Image not available</p>
                </div>
              )}
            </div>
            <div className={`text-center md:text-left ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
              <h3 className="text-4xl font-serif font-bold text-white">{style.name}</h3>
              <p className="text-sm font-medium text-[#c4a97a] bg-[#c4a97a]/10 inline-block px-3 py-1 rounded-full my-4">Recommended Length: {style.length_recommendation}</p>
              <p className="text-gray-400 leading-relaxed">{style.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 border-t border-gray-800 pt-10">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-[#c4a97a] hover:bg-[#d4b98a] text-black font-bold rounded-lg transition-colors shadow-md"
        >
          Re-Generate
        </button>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-in-out;
          }
        `}</style>
    </div>
  );
};

export default ResultsDisplay;