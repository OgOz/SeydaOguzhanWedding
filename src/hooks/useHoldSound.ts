import { useRef, useEffect } from 'react';

export const useHoldSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction if possible, 
        // or just keep ref null until needed to comply with autoplay policies
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    // Charge sound removed as requested
    const playCharge = () => { };

    const playSuccess = () => {
        initAudio();
        const ctx = audioContextRef.current!;
        try { stop(); } catch (e) { }

        // Create a nice major chord or happy 'ding'
        const freqs = [523.25, 659.25, 783.99]; // C major chord

        freqs.forEach((f) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = f;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        });
    };

    const stop = () => {
        if (oscillatorRef.current) {
            try {
                // Smooth fade out to avoid click
                const ctx = audioContextRef.current;
                if (ctx && gainNodeRef.current) {
                    gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
                    gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
                    const oldOsc = oscillatorRef.current;
                    setTimeout(() => {
                        try { oldOsc.stop(); } catch (e) { }
                    }, 100);
                } else {
                    oscillatorRef.current.stop();
                }
            } catch (e) {
                // Ignore if already stopped
            }
            oscillatorRef.current = null;
        }
    };

    return { playCharge, playSuccess, stop };
};
