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

        // Start filling AND growing simultaneously
        // 1. Fill: Moves transition from y=24 to y=0 (Liquid effect)
        fillControls.start({
            y: 0,
            transition: { duration: HOLD_DURATION, ease: "linear" }
        });

        // 2. Grow: Scale up MASSIVELY while filling
        // User wants noticeable growth. 4x is significant.
        await scaleControls.start({
            scale: 4,
            transition: { duration: HOLD_DURATION, ease: "easeInOut" }
        });

        // If we reach here without cancellation, we are done!
        triggerExplosion();
    };

    const handleCancel = () => {
        if (isExploding) return;

        // Reset fill
        fillControls.stop();
        fillControls.start({ y: 24, transition: { duration: 0.2 } });

        // Reset scale to idle pulse
        scaleControls.stop();
        scaleControls.start({
            scale: [1, 1.1, 1], // Idle pulse
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    const triggerExplosion = async () => {
        setIsExploding(true);

        // 1. Hide the button content instantly
        scaleControls.start({ scale: 0, opacity: 0, transition: { duration: 0.1 } });

        // 2. Expand overlay to fill screen
        await overlayControls.start({
            scale: 60,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeIn" }
        });

        // 3. Complete callback (scroll)
        onComplete();

        // 4. Fade out overlay
        await overlayControls.start({ opacity: 0, transition: { duration: 0.5, delay: 0.5 } });
        setIsExploding(false);

        // Reset button state
        fillControls.set({ y: 24 });
        scaleControls.set({ scale: 1, opacity: 1 });

        // Restart idle animation
        scaleControls.start({
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    // Initial Pulse Animation
    React.useEffect(() => {
        scaleControls.start({
            scale: [1, 1.1, 1],
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
                    {/* 
               SVG with Masking for Perfect Fill 
            */}
                    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl overflow-visible">
                        <defs>
                            {/* Heart Path */}
                            <path id="heartPath" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />

                            {/* Clip Path Definition */}
                            <clipPath id="heartClip">
                                <use href="#heartPath" />
                            </clipPath>
                        </defs>

                        {/* 1. Base Heart (Empty Container) 
                    - Fill: White
                    - Stroke: Gold (to show the "container" bounds clearly)
                */}
                        <use href="#heartPath" className="fill-white stroke-gold-300 stroke-[0.5]" />

                        {/* 2. Gold Liquid Fill (Clipped by Heart) */}
                        <g clipPath="url(#heartClip)">
                            {/* The liquid is a gold rect that moves up */}
                            <motion.rect
                                x="0"
                                y="24"  // Start below visible area
                                width="24"
                                height="24"
                                className="fill-gold-500" // Slightly darker gold for liquid
                                initial={{ y: 24 }}
                                animate={fillControls}
                            />
                        </g>
                    </svg>
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
