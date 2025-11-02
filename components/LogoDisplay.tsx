
import React from 'react';

interface LogoDisplayProps {
    title: string;
    imageUrl: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ title, imageUrl }) => (
    <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
        <div className="bg-gray-900 rounded-lg w-full aspect-square flex items-center justify-center overflow-hidden p-4">
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
            ) : (
                <div className="w-full h-full bg-gray-700 animate-pulse rounded-md"></div>
            )}
        </div>
    </div>
);

export default LogoDisplay;
