import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HoldButtonProps {
    onComplete: () => void;
    className?: string;
}

export const HoldButton: React.FC<HoldButtonProps> = ({ onComplete, className }) => {
    const [isExploding, setIsExploding] = useState(false);
    const fillControls = useAnimation();
    const scaleControls = useAnimation();
    const overlayControls = useAnimation();

    const HOLD_DURATION = 1.5; // seconds

    const handleStart = async () => {
        if (isExploding) return;

        // Stop idle growing/pulsing
        scaleControls.stop();

        // Scale up slightly to show feedback
        scaleControls.start({ scale: 1.1, transition: { duration: 0.2 } });

        // Start filling the heart
        await fillControls.start({
            height: "100%",
            transition: { duration: HOLD_DURATION, ease: "linear" }
        });

        // If we reach here without cancellation, we are done!
        triggerExplosion();
    };

    const handleCancel = () => {
        if (isExploding) return;

        // Reset fill
        fillControls.stop();
        fillControls.start({ height: "0%", transition: { duration: 0.2 } });

        // Reset scale to idle pulse
        scaleControls.start({
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    const triggerExplosion = async () => {
        setIsExploding(true);

        // 1. Hide the button content instantly
        scaleControls.start({ scale: 0, opacity: 0, transition: { duration: 0.2 } });

        // 2. Expand overlay
        await overlayControls.start({
            scale: 60,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeIn" }
        });

        // 3. Callback
        onComplete();

        // 4. Fade out overlay
        await overlayControls.start({ opacity: 0, transition: { duration: 0.5, delay: 0.5 } });
        setIsExploding(false);

        // Reset button state after everything
        fillControls.set({ height: "0%" });
        scaleControls.set({ scale: 1, opacity: 1 });
        // Restart idle animation
        scaleControls.start({
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    // Initial Pulse Animation
    React.useEffect(() => {
        scaleControls.start({
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    }, []);

    return (
        <>
            {/* Full Screen Overlay for Explosion */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={overlayControls}
                className="fixed z-[9999] pointer-events-none bg-gold-400 w-20 h-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
            />

            <div className={`flex flex-col items-center gap-4 ${className}`}>
                <motion.button
                    className="relative w-24 h-24 touch-none select-none outline-none cursor-pointer"
                    onPointerDown={handleStart}
                    onPointerUp={handleCancel}
                    onPointerLeave={handleCancel}
                    animate={scaleControls}
                >
                    {/* Heart Shape Container */}
                    <div className="relative w-full h-full drop-shadow-xl filter">
                        {/* 1. Background Heart (White/Empty) */}
                        <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-white fill-current">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>

                        {/* 2. Filling Heart (Gold) - Masked */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* The Gold Fill Layer */}
                            <motion.div
                                initial={{ height: "0%" }}
                                animate={fillControls}
                                className="absolute bottom-0 w-full bg-gold-400"
                                style={{ zIndex: 1 }}
                            />
                            {/* Masking SVG - We use mix-blend-mode or clip-path for cleaner effect. 
                         For simplicity in this setup, let's use clip-path if possible or just use the same SVG with color above 
                         Actually, masking via CSS clip-path for an SVG shape is tricky without defining a clipPath ID.
                         Alternate approach: The 'gold' layer is just a div, and we mask it with the Heart SVG.
                      */}
                            <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full pointer-events-none" style={{ position: 'absolute' }}>
                                <defs>
                                    <clipPath id="heartClip">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </clipPath>
                                </defs>
                            </svg>
                            {/* Re-render fill inside the clip */}
                            <motion.div
                                initial={{ height: "0%" }}
                                animate={fillControls}
                                className="absolute bottom-0 left-0 w-full bg-gold-400"
                                style={{ clipPath: "url(#heartClip)", height: "0%" }}
                            />
                        </div>
                    </div>
                </motion.button>

                {/* Label Moved Below */}
                <div className="relative z-10 text-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-600/80">
                        Basılı Tut
                    </span>
                </div>
            </div>
        </>
    );
};
