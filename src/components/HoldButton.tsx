import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { useHoldSound } from '../hooks/useHoldSound';
import confetti from 'canvas-confetti';

interface HoldButtonProps {
    onComplete: () => void;
    className?: string;
    isAfterParty?: boolean;
}

export const HoldButton: React.FC<HoldButtonProps> = ({ onComplete, className, isAfterParty }) => {
    const [isExploding, setIsExploding] = useState(false);

    // Sound Hook
    const { playSuccess, stop } = useHoldSound();

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
            // Cancelled before completion
            stop();
        }
    };

    const handleCancel = () => {
        if (isExploding) return;

        // Stop Sound
        stop();

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

        // Success Sound
        playSuccess();

        // Confetti Explosion
        const colors = isAfterParty
            ? ['#a855f7', '#7c3aed', '#6366f1', '#ffffff']
            : ['#fda4af', '#f43f5e', '#e11d48', '#ffffff'];

        const shootConfetti = (origin: { x: number, y: number }) => {
            confetti({
                particleCount: 40,
                spread: 100,
                origin: origin,
                colors: colors,
                zIndex: 10000,
                scalar: 1.2,
                drift: 0,
                gravity: 1.2
            });
        };

        // Fire from center
        shootConfetti({ x: 0.5, y: 0.5 });

        // Fire bursts from sides after slight delay
        setTimeout(() => {
            shootConfetti({ x: 0.3, y: 0.6 });
            shootConfetti({ x: 0.7, y: 0.6 });
        }, 200);

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

    const primaryColor = isAfterParty ? "#a855f7" : "#ca869d";

    return (
        <>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={overlayControls}
                className={`fixed z-[9999] pointer-events-none w-20 h-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center ${isAfterParty ? 'bg-purple-600' : 'bg-rose-400'}`}
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
                            <linearGradient id="liquidGradient" x1="0" x2="0" y1="1" y2="0">
                                <motion.stop stopColor={primaryColor} offset={offset1} />
                                <motion.stop stopColor="#ffffff" offset={offset1} />
                            </linearGradient>
                        </defs>

                        {/* The Heart using the Gradient Fill */}
                        <use
                            href="#heartPath"
                            fill="url(#liquidGradient)"
                            stroke={primaryColor}
                            strokeWidth="0.5"
                        />
                    </svg>
                </motion.button>
            </div>
        </>
    );
};
