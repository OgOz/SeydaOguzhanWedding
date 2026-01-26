import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import type { Content } from '../content';

// Simple Toast Component
const Toast: React.FC<{ message: string; isVisible: boolean; isAfterParty?: boolean }> = ({ message, isVisible, isAfterParty }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-10 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium ${isAfterParty ? 'bg-purple-600' : 'bg-rose-500'}`}
            >
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

interface GiftProps {
    isAfterParty?: boolean;
    content: Content;
}

export const Gift: React.FC<GiftProps> = ({ isAfterParty, content }) => {
    const [clickCount, setClickCount] = useState(0);
    const controls = useAnimation();
    const [showToast, setShowToast] = useState(false);

    // IBAN Constant
    const IBAN = "TR49 0006 2000 7790 0006 6050 39";

    const messages = content.gift.messages;

    const [message, setMessage] = useState(messages[0]);
    const [isCaught, setIsCaught] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);

    // Reset state if lang changes (optional, but good for UX)
    React.useEffect(() => {
        setMessage(messages[0]);
        setClickCount(0);
        setIsCaught(false);
    }, [content.lang]);

    const handleCopyIBAN = async () => {
        try {
            await navigator.clipboard.writeText(IBAN);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error('Failed to copy mode:', err);
        }
    };

    const handleInteraction = async () => {
        if (isCaught || isCooldown) return;

        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 1000);

        const nextCount = clickCount + 1;
        setClickCount(nextCount);

        if (nextCount < messages.length - 1) {
            setMessage(messages[nextCount]);

            const x = (Math.random() - 0.5) * 120;
            const y = (Math.random() - 0.5) * 100;

            await controls.start({
                x,
                y,
                transition: { type: "spring", stiffness: 600, damping: 25, mass: 0.8 }
            });
        } else {
            setIsCaught(true);
            setMessage(messages[messages.length - 1]);
            controls.start({ x: 0, y: 0 });
        }
    };

    return (
        <section id="gift" className={`py-24 px-6 overflow-hidden relative transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-rose-50'}`}>
            <Toast message={content.gift.modal.copied} isVisible={showToast} isAfterParty={isAfterParty} />

            <div className="max-w-md mx-auto text-center space-y-12">

                <div className="space-y-4">
                    <h2 className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase ${isAfterParty ? 'text-purple-400' : 'text-rose-500'}`}>
                        {content.gift.eyebrow}
                    </h2>
                    <p className={`text-xl md:text-2xl font-serif italic ${isAfterParty ? 'text-purple-200/60' : 'text-stone-500'}`}>
                        {isCaught ? content.gift.catchPhrase.caught : content.gift.catchPhrase.default}
                    </p>
                </div>

                <div className="h-40 flex items-center justify-center relative">
                    <motion.button
                        animate={controls}
                        onHoverStart={() => !isCaught && handleInteraction()}
                        onTap={() => isCaught ? null : handleInteraction()}
                        className={`
                            px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-xl select-none
                            max-w-[90vw] whitespace-normal h-auto min-h-[4rem] flex items-center justify-center leading-tight
                            ${isCaught
                                ? (isAfterParty ? 'bg-purple-600 text-white cursor-default text-lg' : 'bg-rose-500 text-white cursor-default text-lg')
                                : (isAfterParty ? 'bg-purple-900/20 text-purple-300 border border-purple-500/30 cursor-pointer hover:shadow-purple-500/10 text-base md:text-lg' : 'bg-white text-rose-500 cursor-pointer hover:shadow-2xl text-base md:text-lg')
                            }
                        `}
                    >
                        {message}
                    </motion.button>
                </div>

                {isCaught && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 backdrop-blur rounded-2xl border space-y-6 ${isAfterParty ? 'bg-purple-950/10 border-purple-500/20' : 'bg-white/60 border-rose-100'}`}
                    >
                        <div className="space-y-2">
                            <p className={`font-medium ${isAfterParty ? 'text-purple-100' : 'text-rose-900/80'}`}>
                                {content.gift.modal.title}
                            </p>
                            <p className={`text-sm ${isAfterParty ? 'text-purple-300/60' : 'text-stone-500'}`}>
                                {content.gift.modal.sub}
                            </p>
                        </div>

                        <div className={`p-5 rounded-xl border shadow-sm ${isAfterParty ? 'bg-[#1a1a1a] border-purple-500/20' : 'bg-white border-rose-200'}`}>
                            <p className={`font-mono text-sm md:text-base break-all ${isAfterParty ? 'text-purple-100' : 'text-stone-700'}`}>
                                {IBAN}
                            </p>
                        </div>

                        <button
                            onClick={handleCopyIBAN}
                            className={`w-full py-3.5 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${isAfterParty ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            {content.gift.modal.copy}
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};
