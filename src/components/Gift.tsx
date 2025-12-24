import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { content } from '../content';

export const Gift: React.FC = () => {
    const [clickCount, setClickCount] = useState(0);
    const controls = useAnimation();

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

    const handleInteraction = async () => {
        if (isCaught) {
            // Open Shopier or Payment Modal
            // For now, let's reset to show the behavior again or actually open a link
            // Since we don't have the real link yet, let's just show an alert or console log
            // Or actually, let's make it open the modal if we had one. 
            // Per instructions, "sadece interaktif bir buton olsun", implies maybe no modal yet?
            // But eventually they need to give a gift.
            // Let's reveal the real "Pay" button or form below it? 
            // Or just make THIS button the pay button now.
            return;
        }

        const nextCount = clickCount + 1;
        setClickCount(nextCount);

        if (nextCount < 4) {
            // Evasion Logic
            setMessage(messages[nextCount % messages.length]);

            // Random move check for desktop hover or mobile tap attempt
            // We'll translate it to a random nearby position
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
                        onClick={() => isCaught ? window.location.href = '#' : null} // Final action
                        className={`
                            px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-xl
                            ${isCaught
                                ? 'bg-rose-500 text-white cursor-pointer hover:bg-rose-600'
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
                        className="p-6 bg-white/50 backdrop-blur rounded-2xl border border-rose-100"
                    >
                        <p className="text-text-secondary mb-4">
                            Şaka bir yana, yanımızda olmanız en büyük hediye.
                            <br />
                            İlla katkıda bulunmak isterseniz:
                        </p>
                        {/* Here we could re-integrate the chips if desired, or just the main button action */}
                        <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors">
                            {content.gift.button}
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};
