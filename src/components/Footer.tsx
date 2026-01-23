import React from 'react';
import { content } from '../content';

interface FooterProps {
    isAfterParty?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isAfterParty }) => {
    return (
        <footer className={`py-12 text-center relative transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-white'}`}>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] ${isAfterParty ? 'bg-purple-500/20' : 'bg-rose-200'}`}></div>
            <p className={`font-serif text-sm tracking-widest transition-colors cursor-default ${isAfterParty ? 'text-purple-300/30 hover:text-purple-400/50' : 'text-rose-900/40 hover:text-rose-500/60'}`}>
                {content.footer.copyright}
            </p>
        </footer>
    );
};
