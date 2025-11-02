
import React, { useState } from 'react';
import { generateBrandBible } from '../services/geminiService';
import { BrandIdentity } from '../types';
import LogoDisplay from './LogoDisplay';
import ColorPalette from './ColorPalette';
import FontPairings from './FontPairings';
import LoadingSpinner from './LoadingSpinner';

const BrandGenerator: React.FC = () => {
    const [mission, setMission] = useState<string>('');
    const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mission.trim()) {
            setError('Please enter a company mission.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBrandIdentity(null);

        try {
            const result = await generateBrandBible(mission);
            setBrandIdentity(result);
        } catch (err) {
            console.error(err);
            setError('Failed to generate brand identity. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Brand Bible Generator
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Describe your company's mission, and let AI craft your complete brand identity.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        placeholder="e.g., To empower creative professionals with intuitive tools that bring their ideas to life."
                        className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-gray-500 resize-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-300 shadow-lg disabled:shadow-none"
                    >
                        {isLoading ? 'Generating...' : 'Generate Brand Bible'}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>
            
            {isLoading && (
                <div className="mt-12">
                    <LoadingSpinner text="Crafting your brand identity..." />
                </div>
            )}

            {brandIdentity && (
                <div className="mt-12 space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LogoDisplay title="Primary Logo" imageUrl={brandIdentity.primaryLogo} />
                        <LogoDisplay title="Secondary Mark (Icon)" imageUrl={brandIdentity.secondaryMarkIcon} />
                        <LogoDisplay title="Secondary Mark (Wordmark)" imageUrl={brandIdentity.secondaryMarkWordmark} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ColorPalette colors={brandIdentity.colorPalette} />
                        <FontPairings fonts={brandIdentity.fontPairing} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandGenerator;
