
import React from 'react';
import { FontPairing } from '../types';

interface FontPairingsProps {
    fonts: FontPairing | null;
}

const FontPairings: React.FC<FontPairingsProps> = ({ fonts }) => {
    const getGoogleFontUrl = (fontName: string) => `https://fonts.google.com/specimen/${fontName.replace(/ /g, '+')}`;

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Font Pairings</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Header</p>
                    {fonts ? (
                        <a 
                            href={getGoogleFontUrl(fonts.header)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-4xl font-bold text-white hover:text-indigo-400 transition-colors"
                            style={{ fontFamily: fonts.header, fontFeatureSettings: "'clig' off, 'liga' off" }}
                        >
                            {fonts.header}
                        </a>
                    ) : (
                        <div className="h-10 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">Body</p>
                    {fonts ? (
                        <a 
                            href={getGoogleFontUrl(fonts.body)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg text-gray-300 hover:text-indigo-400 transition-colors"
                            style={{ fontFamily: fonts.body, fontFeatureSettings: "'clig' off, 'liga' off" }}
                        >
                           {fonts.body}
                        </a>
                    ) : (
                        <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    )}
                </div>
                 {fonts && <p className="text-xs text-gray-500 pt-2">Click font names to browse on Google Fonts.</p>}
            </div>
        </div>
    );
};

export default FontPairings;
