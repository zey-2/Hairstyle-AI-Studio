
import React from 'react';
import { Color } from '../types';

interface ColorPaletteProps {
    colors: Color[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {(colors && colors.length > 0 ? colors : Array(5).fill(null)).map((color, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                            className="w-20 h-20 rounded-full border-2 border-gray-700 shadow-md transition-transform hover:scale-105"
                            style={{ backgroundColor: color ? color.hex : '#4B5563' }}
                        ></div>
                        {color ? (
                            <>
                                <p className="font-medium text-white text-center">{color.name}</p>
                                <button 
                                    onClick={() => copyToClipboard(color.hex)}
                                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                                    title="Copy hex code"
                                >
                                    {color.hex}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-1">{color.description}</p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center space-y-2 w-full">
                                <div className="h-5 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/5 animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorPalette;
