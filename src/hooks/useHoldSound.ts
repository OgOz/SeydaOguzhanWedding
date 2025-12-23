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

    const playCharge = () => {
        initAudio();
        const ctx = audioContextRef.current!;
        if (ctx.state === 'suspended') ctx.resume();

        // Stop existing if any
        stop();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine'; // Pure sine for a soft "hum"
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.5); // Gentler rise

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5); // Lower volume (0.3 -> 0.15)

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
    };

    const playSuccess = () => {
        initAudio();
        const ctx = audioContextRef.current!;
        stop(); // Stop charge sound

        // Create a nice major chord or happy 'ding'
        const freqs = [523.25, 659.25, 783.99]; // C major chord

        freqs.forEach((f, i) => {
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
