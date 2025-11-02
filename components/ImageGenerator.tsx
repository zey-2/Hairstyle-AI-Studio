
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const PROMPT_TEMPLATE = `Change the hairstyle of the person in the photo to [desired hairstyle]. 
Keep the face, skin tone, and lighting consistent. 
Ensure the result looks natural and professionally styled. 
Maintain realistic hair texture, color, and shadows. 
Maintain the original aspect ratio of the photo.
Do not alter facial features, expression, or background unless necessary for realism.
Output in ultra-realistic photographic quality, 4K resolution, flattering studio lighting.`;

interface Hairstyle {
    name: string;
    description: string;
}

const MALE_HAIRSTYLES: Hairstyle[] = [
    { name: "Crew Cut", description: "Short, tapered sides." },
    { name: "Undercut", description: "Long top, short sides." },
    { name: "Pompadour", description: "Voluminous swept-up front." },
    { name: "Quiff", description: "Messier than a pompadour." },
    { name: "Buzz Cut", description: "Ultra-short and uniform." },
    { name: "Slicked Back", description: "Classic and sophisticated." },
    { name: "Faux Hawk", description: "Spiky top, not a full mohawk." },
    { name: "Flowing Layered", description: "Full, airy layers with lift and bounce" },
];

const FEMALE_HAIRSTYLES: Hairstyle[] = [
    { name: "Bob Cut", description: "Classic chin-length style." },
    { name: "Pixie Cut", description: "Very short and chic." },
    { name: "Long Layers", description: "Adds volume and movement." },
    { name: "Shag Haircut", description: "Layered and textured." },
    { name: "Curtain Bangs", description: "Face-framing fringe." },
    { name: "Braids", description: "Intricate woven styles." },
    { name: "Ponytail", description: "Simple and versatile." },
    { name: "Wavy Lob", description: "Shoulder-length waves." },
    { name: "French Bob", description: "Short, sharp, with bangs." },
    { name: "Wolf Cut", description: "A wild, shaggy mullet." },
    { name: "Butterfly Cut", description: "Feathery, face-framing layers." },
    { name: "Cornrows", description: "Tight, raised braids." },
];

const MAX_STYLES = 5;

interface StyleCardProps {
    style: Hairstyle;
    onSelect: (styleName: string) => void;
    isSelected: boolean;
    isDisabled: boolean;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, onSelect, isSelected, isDisabled }) => (
    <button
        onClick={() => onSelect(style.name)}
        disabled={isDisabled && !isSelected}
        className={`flex flex-col justify-center w-full h-full p-3 text-center rounded-lg border-2 transition-all duration-200
            ${isSelected 
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg' 
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'}
            ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        <span className="font-semibold text-sm">{style.name}</span>
        <span className="text-xs text-purple-200/80 mt-1 block leading-tight">{style.description}</span>
    </button>
);


const ImageGenerator: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
    const [selectedHairstyles, setSelectedHairstyles] = useState<string[]>([]);
    
    const [generatedImages, setGeneratedImages] = useState<{ style: string; url: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Reset everything when a new file is uploaded
            resetState();
            setUploadedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const handleStyleSelect = (style: string) => {
        setSelectedHairstyles(prev => {
            if (prev.includes(style)) {
                return prev.filter(s => s !== style);
            }
            if (prev.length < MAX_STYLES) {
                return [...prev, style];
            }
            return prev; // Do not add if max is reached
        });
    };
    
    const handleSubmit = async () => {
        if (!uploadedFile || selectedHairstyles.length === 0) {
            setError('Please upload a photo and select at least one hairstyle.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        const generationPromises = selectedHairstyles.map(async (style) => {
            const prompt = PROMPT_TEMPLATE.replace('[desired hairstyle]', style);
            try {
                const url = await generateImage(prompt, [uploadedFile]);
                return { style, url, status: 'fulfilled' };
            } catch (err) {
                console.error(`Failed to generate hairstyle: ${style}`, err);
                return { style, url: null, status: 'rejected' };
            }
        });

        const results = await Promise.all(generationPromises);
        
        const successfulGenerations = results
            .filter(r => r.status === 'fulfilled' && r.url)
            .map(r => ({ style: r.style, url: r.url as string }));

        setGeneratedImages(successfulGenerations);

        if (successfulGenerations.length === 0) {
            setError('Sorry, we couldn\'t generate any new hairstyles. This might be due to a safety policy violation or a network issue. Please try a different photo or hairstyle.');
        }

        setIsLoading(false);
    };

    const resetState = () => {
        setUploadedFile(null);
        setPreviewUrl(null);
        setSelectedGender(null);
        setSelectedHairstyles([]);
        setGeneratedImages([]);
        setIsLoading(false);
        setError(null);
    };

    const hairstyleList = selectedGender === 'male' ? MALE_HAIRSTYLES : FEMALE_HAIRSTYLES;
    const canGenerate = !isLoading && uploadedFile && selectedHairstyles.length > 0;

    // The main render logic
    if (isLoading) {
        return <LoadingSpinner text={`Generating ${selectedHairstyles.length} new look(s)...`} />;
    }
    
    if (generatedImages.length > 0 || (error && !isLoading)) {
         return (
            <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-center">Your AI Makeover Results</h2>
                 {error && <p className="text-red-400 mt-4 text-center" role="alert">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2 text-center">
                        <img src={previewUrl!} alt="Original" className="rounded-lg w-full h-auto object-cover" />
                        <p className="font-semibold">Original</p>
                    </div>
                    {generatedImages.map(({ style, url }) => (
                         <div key={style} className="space-y-2 text-center">
                            <img src={url} alt={`Generated hairstyle: ${style}`} className="rounded-lg w-full h-auto object-cover" />
                            <p className="font-semibold">{style}</p>
                            <a
                                href={url}
                                download={`hairstyle-ai-studio-${style.toLowerCase().replace(/\s+/g, '-')}.png`}
                                className="inline-flex items-center justify-center gap-2 mt-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white text-sm transition-all duration-300 shadow-md"
                                aria-label={`Download image with ${style} hairstyle`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download</span>
                            </a>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button
                        onClick={resetState}
                        className="py-3 px-8 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg"
                    >
                        Start Over
                    </button>
                </div>
            </div>
         );
    }
    

    return (
        <div className="max-w-4xl mx-auto space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-white/10 shadow-2xl">
            {/* Step 1: Upload */}
            {!uploadedFile && (
                 <div className="text-center space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold">Step 1: Upload Your Photo</h2>
                    <p className="text-gray-400">Choose a clear, front-facing photo for the best results.</p>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                             <div className="flex text-sm text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-purple-500 px-1">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Step 2 & 3: Select Styles */}
            {uploadedFile && (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <img src={previewUrl!} alt="Upload preview" className="rounded-lg shadow-lg w-full" />
                            <label htmlFor="file-upload-change" className="w-full mt-4 text-sm py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-center block cursor-pointer">Change Photo</label>
                            <input id="file-upload-change" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="w-full md:w-2/3 space-y-6">
                            {/* Gender Selection */}
                            <div>
                                <h2 className="text-2xl font-bold mb-3">Step 2: Choose a style category</h2>
                                <div className="flex gap-4">
                                     <button onClick={() => setSelectedGender('female')} className={`w-full py-3 font-semibold rounded-lg border-2 transition-all ${selectedGender === 'female' ? 'bg-pink-500 border-pink-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>Female</button>
                                    <button onClick={() => setSelectedGender('male')} className={`w-full py-3 font-semibold rounded-lg border-2 transition-all ${selectedGender === 'male' ? 'bg-blue-500 border-blue-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>Male</button>
                                </div>
                            </div>
                            {/* Hairstyle Selection */}
                            {selectedGender && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold mb-3">Step 3: Select up to {MAX_STYLES} hairstyles</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {hairstyleList.map(style => (
                                            <StyleCard 
                                                key={style.name}
                                                style={style}
                                                onSelect={handleStyleSelect}
                                                isSelected={selectedHairstyles.includes(style.name)}
                                                isDisabled={selectedHairstyles.length >= MAX_STYLES}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     {/* Step 4: Generate */}
                    <div className="pt-4 border-t border-gray-700">
                         <button
                            onClick={handleSubmit}
                            disabled={!canGenerate}
                            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white text-lg transition-all duration-300 shadow-lg disabled:shadow-none"
                        >
                            {`Generate ${selectedHairstyles.length > 0 ? selectedHairstyles.length : ''} Makeover(s)`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;