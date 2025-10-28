import React from 'react';
import { HairstyleSuggestion } from '../types';

interface ProcessingViewProps {
    message: string;
    suggestions: HairstyleSuggestion[] | undefined;
}

const LuxurySpinner: React.FC = () => (
    <svg className="animate-spin h-12 w-12 text-[#c4a97a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const ProcessingView: React.FC<ProcessingViewProps> = ({ message, suggestions }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-[#222222] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 w-full max-w-2xl">
            <LuxurySpinner />
            <h2 className="text-3xl font-serif mt-8 mb-2 text-white">
              Curating Your Look...
            </h2>
            <p className="text-gray-400 mb-8">{message}</p>
            
            {suggestions && (
                <div className="w-full mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Style Progress</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {suggestions.map((style, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                               {style.generatedImage ? (
                                    <img src={style.generatedImage} alt={style.name} className="w-24 h-24 object-cover rounded-lg shadow-md animate-fade-in" />
                                ) : (
                                    <div className="w-24 h-24 bg-black/20 border border-gray-700 rounded-lg flex items-center justify-center">
                                       <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-[#c4a97a]/50"></div>
                                    </div>
                                )}
                                <p className="text-xs text-center text-gray-400">{style.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fade-in {
                animation: fade-in 0.5s ease-in-out;
              }
            `}</style>
        </div>
    );
};


export default ProcessingView;