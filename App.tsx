import React from 'react';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
    
    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/50">
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                        Hairstyle AI Studio
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        Upload a photo, choose your new look, and let AI work its magic.
                    </p>
                </div>
                <ImageGenerator />
            </main>
        </div>
    );
};

export default App;
