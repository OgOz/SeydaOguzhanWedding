import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, RotateCcw, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraModalProps {
    onClose: () => void;
    onCapture: (file: File) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
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
                    aspectRatio: { ideal: 9 / 16 } // Portrait preferred
                },
                audio: mode === 'video'
            });

            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
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

    // Switch Camera (Front/Back)
    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
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

    // Video Recording Logic
    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        // Check supported mime types for Safari/Chrome compatibility
        const mimeType = MediaRecorder.isTypeSupported('video/mp4; codecs=avc1')
            ? 'video/mp4; codecs=avc1'
            : 'video/webm';

        const recorder = new MediaRecorder(stream, { mimeType });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
            const file = new File([blob], `video-${Date.now()}.mp4`, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setCapturedMedia({ url, type: 'video', file });
            stopCamera(); // Stop stream to save battery/resources
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRecording(false);
            setTimeLeft(15);
        };

        recorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = recorder;

        // Timer
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
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = ((15 - timeLeft) / 15) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col"
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                <button
                    onClick={() => { stopCamera(); onClose(); }}
                    className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white"
                >
                    <X size={24} />
                </button>

                {!capturedMedia && (
                    <button
                        onClick={toggleCamera}
                        className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white"
                    >
                        <RefreshCw size={24} />
                    </button>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                {!capturedMedia ? (
                    // Live Camera View
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                ) : (
                    // Captured Preview
                    capturedMedia.type === 'photo' ? (
                        <img src={capturedMedia.url} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video
                            src={capturedMedia.url}
                            controls
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
                        <div className="flex bg-black/30 rounded-full p-1 border border-white/10">
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

                        {/* Capture Button */}
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
                                onClick={mode === 'photo' ? takePhoto : (isRecording ? stopRecording : startRecording)}
                                className={`
                                    w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all
                                    ${mode === 'photo'
                                        ? 'bg-white/20 active:bg-white'
                                        : (isRecording ? 'bg-rose-500 scale-75' : 'bg-red-500')
                                    }
                                `}
                            >
                                {mode === 'photo' && <div className="w-12 h-12 bg-white rounded-full opacity-0 active:opacity-100 transition-opacity" />}
                                {mode === 'video' && isRecording && <div className="w-6 h-6 bg-white rounded-sm" />}
                            </button>
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
        </motion.div>
    );
};
