import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw, Check, RefreshCw, Zap, ZapOff, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraModalProps {
    onClose: () => void;
    onCapture: (file: File) => void;
    onGalleryClick: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture, onGalleryClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mode, setMode] = useState<'photo' | 'video'>('photo');
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [capturedMedia, setCapturedMedia] = useState<{ url: string, type: 'photo' | 'video', file: File } | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);

    // Optimizasyon State'leri
    const [hasTorch, setHasTorch] = useState(false);
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    // Initialize Camera
    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: { ideal: 9 / 16 }
                },
                audio: mode === 'video'
            });

            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }

            // Torch Check
            const track = newStream.getVideoTracks()[0];
            const capabilities = track.getCapabilities() as any; // Cast for TS
            if (capabilities.torch) {
                setHasTorch(true);
            } else {
                setHasTorch(false);
            }

        } catch (err) {
            console.error("Camera access error:", err);
            alert("Kameraya erişilemedi. Lütfen izinlerinizi kontrol edin.");
            onClose();
        }
    }, [facingMode, mode]);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        setTorchEnabled(false);
    };

    const toggleTorch = async () => {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        try {
            await track.applyConstraints({
                advanced: [{ torch: !torchEnabled }] as any
            });
            setTorchEnabled(!torchEnabled);
        } catch (err) {
            console.error("Torch error:", err);
        }
    };

    // Capture Photo
    const takePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Mirror if user facing
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setCapturedMedia({ url, type: 'photo', file });
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    // Video Recording with Countdown
    const startRecordingWrapper = () => {
        if (countdown !== null) return;

        setCountdown(3);
        let count = 3;
        const countdownInterval = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
                clearInterval(countdownInterval);
                setCountdown(null);
                startRecording();
            }
        }, 1000);
    };

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const mimeType = mode === 'video' ? (
            MediaRecorder.isTypeSupported('video/mp4; codecs=avc1') ? 'video/mp4; codecs=avc1' :
                MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' :
                    MediaRecorder.isTypeSupported('video/webm; codecs=h264') ? 'video/webm; codecs=h264' :
                        'video/webm'
        ) : '';

        const recorder = new MediaRecorder(stream, {
            mimeType: mimeType || undefined,
            videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const finalType = recorder.mimeType.includes('video/mp4') ? 'video/mp4' : 'video/webm';
            const blob = new Blob(chunksRef.current, { type: finalType });
            const extension = finalType === 'video/mp4' ? 'mp4' : 'webm';
            const file = new File([blob], `video-${Date.now()}.${extension}`, { type: finalType });
            const url = URL.createObjectURL(blob);
            setCapturedMedia({ url, type: 'video', file });
            stopCamera();
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRecording(false);
            setTimeLeft(15);
        };

        recorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = recorder;

        let time = 15;
        timerRef.current = setInterval(() => {
            time -= 1;
            setTimeLeft(time);
            if (time <= 0) {
                stopRecording();
            }
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleConfirm = () => {
        if (capturedMedia) {
            onCapture(capturedMedia.file);
            onClose();
        }
    };

    const handleRetake = () => {
        setCapturedMedia(null);
        startCamera();
        setTimeLeft(15);
    };

    // Calculate Progress Ring Dash
    // Scroll Lock & Mobile Optimization
    useEffect(() => {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, []);

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = ((15 - timeLeft) / 15) * circumference;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-black touch-none overscroll-none"
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                <button
                    onClick={() => { stopCamera(); onClose(); }}
                    className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white"
                >
                    <X size={24} />
                </button>

                <div className="flex gap-4">
                    {hasTorch && !capturedMedia && (
                        <button
                            onClick={toggleTorch}
                            className={`p-2 rounded-full backdrop-blur-md transition-all ${torchEnabled ? 'bg-yellow-400 text-black' : 'bg-black/20 text-white'}`}
                        >
                            {torchEnabled ? <Zap size={24} fill="currentColor" /> : <ZapOff size={24} />}
                        </button>
                    )}

                    {!capturedMedia && (
                        <button
                            onClick={toggleCamera}
                            className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white"
                        >
                            <RefreshCw size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                {/* Countdown Overlay */}
                <AnimatePresence>
                    {countdown !== null && countdown > 0 && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            key={countdown}
                            className="absolute inset-0 z-50 flex items-center justify-center"
                        >
                            <span className="text-9xl font-bold text-white drop-shadow-2xl">{countdown}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!capturedMedia ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                ) : (
                    capturedMedia.type === 'photo' ? (
                        <img src={capturedMedia.url} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video
                            key={capturedMedia.url}
                            src={capturedMedia.url}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                        />
                    )
                )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-black/40 backdrop-blur-sm p-6 pb-12 w-full absolute bottom-0 z-20">
                {!capturedMedia ? (
                    <div className="flex flex-col items-center gap-6">
                        {/* Mode Switcher */}
                        <div className="flex bg-black/30 rounded-full p-1 border border-white/10 relative">
                            <button
                                onClick={() => setMode('photo')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'photo' ? 'bg-white text-black' : 'text-white'}`}
                            >
                                FOTOĞRAF
                            </button>
                            <button
                                onClick={() => setMode('video')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'video' ? 'bg-white text-black' : 'text-white'}`}
                            >
                                VİDEO (15sn)
                            </button>
                        </div>

                        <div className="w-full flex items-center justify-between px-8">
                            {/* Gallery Button (Left) */}
                            <button
                                onClick={onGalleryClick}
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
                            >
                                <ImageIcon size={24} />
                            </button>

                            {/* Capture Button (Center) */}
                            <div className="relative flex items-center justify-center">
                                {mode === 'video' && isRecording && (
                                    <svg className="absolute w-24 h-24 -rotate-90 pointer-events-none">
                                        <circle
                                            cx="48" cy="48" r={radius}
                                            stroke="white" strokeWidth="4"
                                            fill="none" className="opacity-30"
                                        />
                                        <circle
                                            cx="48" cy="48" r={radius}
                                            stroke="#f43f5e" strokeWidth="4"
                                            fill="none"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference - progress}
                                            className="transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                )}

                                <button
                                    onClick={mode === 'photo' ? takePhoto : (isRecording ? stopRecording : startRecordingWrapper)}
                                    disabled={countdown !== null}
                                    className={`
                                        w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all
                                        ${mode === 'photo'
                                            ? 'bg-white/20 active:bg-white'
                                            : (isRecording ? 'bg-rose-500 scale-75' : 'bg-red-500')
                                        }
                                        ${countdown !== null ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {mode === 'photo' && <div className="w-12 h-12 bg-white rounded-full opacity-0 active:opacity-100 transition-opacity" />}
                                    {mode === 'video' && isRecording && <div className="w-6 h-6 bg-white rounded-sm" />}
                                </button>
                            </div>

                            {/* Spacer (Right) to balance layout */}
                            <div className="w-12" />
                        </div>
                    </div>
                ) : (
                    // Confirm / Retake Controls
                    <div className="flex justify-between items-center max-w-sm mx-auto w-full px-4">
                        <button
                            onClick={handleRetake}
                            className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-white/20"
                        >
                            <RotateCcw size={18} />
                            Tekrar
                        </button>

                        <button
                            onClick={handleConfirm}
                            className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-rose-600"
                        >
                            <Check size={18} />
                            Kullan
                        </button>
                    </div>
                )}
            </div>
        </motion.div>,
        document.body
    );
};
