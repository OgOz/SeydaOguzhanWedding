import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { content } from '../content';

// Simple Toast Component
const Toast: React.FC<{ message: string; isVisible: boolean }> = ({ message, isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium"
            >
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

export const Gift: React.FC = () => {
    const [clickCount, setClickCount] = useState(0);
    const controls = useAnimation();
    const [showToast, setShowToast] = useState(false);

    // IBAN Constant
    const IBAN = "TR49 0006 2000 7790 0006 6050 39";

    // Playful messages for evasion
    const messages = [
        "Aslında sevginiz yeterli",
        "Zahmet etmeyin :)",
        "En büyük hediye sizsiniz",
        "Şaka şaka, buyrun",
        "Tamam tamam, pes ettim! 😄"
    ];

    const [message, setMessage] = useState(messages[0]);
    const [isCaught, setIsCaught] = useState(false);

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
        if (isCaught) {
            // If already caught, clicking again (which shouldn't happen easily due to handler below)
            // But if it does, let's copy IBAN directly or do nothing as the button changes function
            return;
        }

        const nextCount = clickCount + 1;
        setClickCount(nextCount);

        if (nextCount < 4) {
            // Evasion Logic
            setMessage(messages[nextCount % messages.length]);

            // Random move check for desktop hover or mobile tap attempt
            const x = (Math.random() - 0.5) * 200; // -100 to 100
            const y = (Math.random() - 0.5) * 100; // -50 to 50

            await controls.start({
                x,
                y,
                transition: { duration: 0.2, type: "spring", stiffness: 300 }
            });
        } else {
            // Caught Logic
            setIsCaught(true);
            setMessage(messages[4]); // "Tamam pes ettim"
            controls.start({ x: 0, y: 0 }); // Return to center
        }
    };

    return (
        <section id="gift" className="py-24 px-6 bg-rose-50 overflow-hidden relative">
            <Toast message="IBAN Kopyalandı" isVisible={showToast} />

            <div className="max-w-md mx-auto text-center space-y-12">

                <div className="space-y-4">
                    <h2 className="text-sm md:text-base text-rose-500 font-bold tracking-[0.2em] uppercase">
                        {content.gift.title}
                    </h2>
                    <p className="text-xl md:text-2xl font-serif text-text-secondary italic">
                        {isCaught ? "Desteğiniz için teşekkürler." : "Ufak bir katkı?"}
                    </p>
                </div>

                <div className="h-40 flex items-center justify-center relative">
                    {/* The Playful Button */}
                    <motion.button
                        animate={controls}
                        onHoverStart={() => !isCaught && handleInteraction()} // Desktop evade
                        onTap={() => isCaught ? null : handleInteraction()} // Mobile fallback
                        onClick={() => isCaught ? null : null} // Handled by onTap/Hover for games
                        className={`
                            px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-xl
                            ${isCaught
                                ? 'bg-rose-500 text-white cursor-default'
                                : 'bg-white text-rose-500 cursor-default hover:shadow-2xl'
                            }
                        `}
                    >
                        {isCaught ? content.gift.button : message}
                    </motion.button>
                </div>

                {isCaught && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/50 backdrop-blur rounded-2xl border border-rose-100 space-y-4"
                    >
                        <p className="text-text-secondary">
                            Şaka bir yana, yanımızda olmanız en büyük hediye.
                            <br />
                            İlla katkıda bulunmak isterseniz:
                        </p>

                        <div className="bg-white p-4 rounded-xl border border-rose-200">
                            <p className="text-xs text-rose-500 uppercase tracking-wider mb-1">IBAN</p>
                            <p className="font-mono text-sm md:text-base text-text-primary break-all">
                                {IBAN}
                            </p>
                        </div>

                        <button
                            onClick={handleCopyIBAN}
                            className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            IBAN Kopyala
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};
