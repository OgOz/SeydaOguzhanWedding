import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HoldButtonProps {
    onComplete: () => void;
    className?: string; // Added back className prop as it might be passed
}

export const HoldButton: React.FC<HoldButtonProps> = ({ onComplete, className }) => {
    const [isExploding, setIsExploding] = useState(false);
    const controls = useAnimation();
    const overlayControls = useAnimation();

    const HOLD_DURATION = 1.5; // seconds

    const handleStart = async () => {
        if (isExploding) return;

        // Start pulsing/growing
        await controls.start({
            scale: 1.5,
            transition: { duration: HOLD_DURATION, ease: "linear" }
        });

        // If we reach here without cancellation, we are done!
        triggerExplosion();
    };

    const handleCancel = () => {
        if (isExploding) return;
        controls.stop();
        controls.start({ scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } });
    };

    const triggerExplosion = async () => {
        setIsExploding(true);

        // 1. Hide the button content instantly or animate it out
        controls.start({ scale: 0, opacity: 0, transition: { duration: 0.2 } });

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

        // Reset button
        controls.set({ scale: 1, opacity: 1 });
    };

    return (
        <>
            {/* Full Screen Overlay for Explosion */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={overlayControls}
                className="fixed z-[9999] pointer-events-none bg-gold-400 w-20 h-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
            />

            <motion.button
                className={`relative flex items-center justify-center w-24 h-24 touch-none select-none outline-none cursor-pointer ${className}`}
                onPointerDown={handleStart}
                onPointerUp={handleCancel}
                onPointerLeave={handleCancel} // Cancel if finger slides off
                animate={controls}
                whileTap={{ scale: 1.1 }} // Instant feedback before the slow grow
            >
                {/* Heart Shape Background */}
                <div className="absolute inset-0 text-white drop-shadow-xl filter">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>

                {/* Label */}
                <div className="relative z-10 flex flex-col items-center pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                        Basılı Tut
                    </span>
                </div>

            </motion.button>
        </>
    );
};
