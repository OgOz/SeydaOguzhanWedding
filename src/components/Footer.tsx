import React from 'react';
import { content } from '../content';

export const Footer: React.FC = () => {
    return (
        <footer className="py-12 bg-bg-secondary text-center">
            <p className="text-rose-900/60 font-serif text-sm tracking-widest">
                {content.footer.copyright}
            </p>
        </footer>
    );
};
