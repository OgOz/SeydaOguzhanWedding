import React from 'react';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
    currentLang: 'tr' | 'en';
    onToggle: (lang: 'tr' | 'en') => void;
    isAfterParty?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onToggle, isAfterParty }) => {
    return (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-1 p-1 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-500 bg-white/10 border-white/20">
            {/* Background Pill for Active State */}
            <div className="absolute inset-1 flex justify-between items-center pointer-events-none">
                <motion.div
                    layout
                    className={`h-full w-1/2 rounded-full ${isAfterParty ? 'bg-purple-600' : 'bg-rose-500'}`}
                    animate={{
                        x: currentLang === 'tr' ? 0 : '100%'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>

            <button
                onClick={() => onToggle('tr')}
                className={`relative z-10 w-10 h-8 text-xs font-bold tracking-wider rounded-full flex items-center justify-center transition-colors duration-300 ${currentLang === 'tr' ? 'text-white' : (isAfterParty ? 'text-purple-200 hover:text-white' : 'text-stone-600 hover:text-stone-900')
                    }`}
            >
                TR
            </button>

            <button
                onClick={() => onToggle('en')}
                className={`relative z-10 w-10 h-8 text-xs font-bold tracking-wider rounded-full flex items-center justify-center transition-colors duration-300 ${currentLang === 'en' ? 'text-white' : (isAfterParty ? 'text-purple-200 hover:text-white' : 'text-stone-600 hover:text-stone-900')
                    }`}
            >
                EN
            </button>
        </div>
    );
};
