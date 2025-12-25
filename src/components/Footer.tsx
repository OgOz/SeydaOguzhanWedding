import React from 'react';
import { content } from '../content';

export const Footer: React.FC = () => {
    return (
        <footer className="py-12 bg-white text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-rose-200"></div>
            <p className="text-rose-900/40 font-serif text-sm tracking-widest hover:text-rose-500/60 transition-colors cursor-default">
                {content.footer.copyright}
            </p>
        </footer>
    );
};
