import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
    isAfterParty?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, isAfterParty }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const text = isAfterParty ? "Gece başlıyor..." : "Birlikte, nihayet...";

    // Disable scroll while preloader is active
    React.useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    useGSAP(() => {
        const chars = textRef.current?.querySelectorAll('.char');
        if (!chars) return;

        const tl = gsap.timeline({
            onComplete: () => {
                onComplete();
            }
        });

        tl.fromTo(chars,
            {
                opacity: 0,
                y: 40,
                rotationX: 90,
                filter: "blur(10px)",
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                filter: "blur(0px)",
                scale: 1,
                stagger: 0.08,
                duration: 1.2,
                ease: "power3.out"
            }
        )
            .to({}, { duration: 0.8 })
            .to(chars, {
                opacity: 0,
                y: -20,
                filter: "blur(5px)",
                stagger: 0.05,
                duration: 0.6,
                ease: "power2.in"
            })
            .to(containerRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut"
            });

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508] text-purple-100' : 'bg-rose-50 text-rose-950'}`}
        >
            <p ref={textRef} className="text-4xl md:text-6xl font-serif italic tracking-wide relative p-4" style={{ perspective: "1000px" }}>
                {text.split('').map((char, index) => (
                    <span key={index} className="char inline-block min-w-[0.3em] whitespace-pre origin-bottom">
                        {char}
                    </span>
                ))}
            </p>
        </div>
    );
};
