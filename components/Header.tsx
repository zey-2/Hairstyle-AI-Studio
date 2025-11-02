import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const navItems = [
        { id: AppView.IMAGE, label: 'Image Generator' },
        { id: AppView.CHAT, label: 'Chat Bot' },
    ];

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 p-4">
            <nav className="max-w-6xl mx-auto flex justify-center items-center space-x-2 md:space-x-4 bg-gray-800/50 p-2 rounded-full border border-white/10">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                            currentView === item.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;