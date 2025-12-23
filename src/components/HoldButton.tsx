import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';

interface HoldButtonProps {
    onComplete: () => void;
    className?: string;
}

export const HoldButton: React.FC<HoldButtonProps> = ({ onComplete, className }) => {
    const [isExploding, setIsExploding] = useState(false);

    // We use a MotionValue to drive the gradient fill level (0 to 100)
    const fillLevel = useMotionValue(0);
    const scaleControls = useAnimation();
    const overlayControls = useAnimation();

    const HOLD_DURATION = 1.5; // seconds

    const handleStart = async () => {
        if (isExploding) return;

        // Stop idle pulsing
        scaleControls.stop();

        // 1. Animate Fill Level from 0% to 100%
        animate(fillLevel, 100, {
            duration: HOLD_DURATION,
            ease: "linear"
        });

        // 2. Grow Scale Massively
        await scaleControls.start({
            scale: 4,
            transition: { duration: HOLD_DURATION, ease: "easeInOut" }
        });

        // If we reach here (and fill is > 99?), trigger success
        if (fillLevel.get() > 99) {
            triggerExplosion();
        } else {
            // If aborted early? (Should be handled by handleCancel)
        }
    };

    const handleCancel = () => {
        if (isExploding) return;

        // Reset fill
        animate(fillLevel, 0, { duration: 0.2 });

        // Reset scale
        scaleControls.stop();
        scaleControls.start({
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    const triggerExplosion = async () => {
        setIsExploding(true);

        // Instant hide heart
        scaleControls.start({ scale: 0, opacity: 0, transition: { duration: 0.1 } });

        // Expand overlay
        await overlayControls.start({
            scale: 60,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeIn" }
        });

        onComplete();

        // Fade out overlay
        await overlayControls.start({ opacity: 0, transition: { duration: 0.5, delay: 0.5 } });
        setIsExploding(false);

        // Reset
        fillLevel.set(0);
        scaleControls.set({ scale: 1, opacity: 1 });
        scaleControls.start({
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    };

    // Initial Pulse
    React.useEffect(() => {
        scaleControls.start({
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        });
    }, []);

    // Transform motion value to percentage strings for the gradient stops
    const offset1 = useTransform(fillLevel, v => `${v}%`);
    // const offset2 = useTransform(fillLevel, v => `${v}%`); // Sharp line

    return (
        <>
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
                    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xl overflow-visible">
                        <defs>
                            <path id="heartPath" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />

                            {/* Linear Gradient for Liquid Fill 
                       x1,y1 to x2,y2 determines direction. 
                       x1=0, x2=0 is vertical.
                       y1=1 (bottom), y2=0 (top).
                       
                       Stops:
                       stop1: pink (offset starts at 0%)
                       stop2: white (offset starts at 0%)
                       
                       As offset increases to 100%:
                       The 'pink' region grows from bottom to top.
                   */}
                            <linearGradient id="liquidGradient" x1="0" x2="0" y1="1" y2="0">
                                <motion.stop stopColor="#ca869d" offset={offset1} />
                                <motion.stop stopColor="#ffffff" offset={offset1} />
                            </linearGradient>
                        </defs>

                        {/* The Heart using the Gradient Fill */}
                        <use
                            href="#heartPath"
                            fill="url(#liquidGradient)"
                            stroke="#ca869d"
                            strokeWidth="0.5"
                        />
                    </svg>
                </motion.button>

                <div className="relative z-10 text-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-600/80">
                        Basılı Tut
                    </span>
                </div>
            </div>
        </>
    );
};
