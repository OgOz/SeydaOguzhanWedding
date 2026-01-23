import React, { useState, useRef, useEffect } from 'react';
import { Section } from '../components/Section';
import { Camera, Upload, X, Loader2, Trash2, Play, Pause, LogOut, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { db, storage } from '../lib/firebase';
import { CameraModal } from '../components/CameraModal';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, limit, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Photo {
    id: string;
    url: string;
    caption?: string;
    timestamp: Date | null;
    rotation: number;
    userId?: string;
    storagePath?: string;
    type?: 'image' | 'video'; // Added to support video uploads
    mimeType?: string; // Explicit MIME type for better browser compatibility
    isHidden?: boolean; // Soft delete flag
}

const PhotoCard: React.FC<{
    photo: Photo;
    userId: string;
    isAdmin: boolean;
    onDelete: (photo: Photo) => void;
    isAfterParty?: boolean;
}> = ({ photo, userId, onDelete, isAdmin, isAfterParty }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isOwner = photo.userId === userId;

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    useEffect(() => {
        if (!isOwner || !photo.timestamp) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const photoTime = photo.timestamp!.getTime();
            const diff = 30 - Math.floor((now - photoTime) / 1000);
            return diff > 0 ? diff : 0;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [photo.timestamp, isOwner]);

    const isLongCaption = photo.caption && photo.caption.length > 80;
    const displayCaption = isLongCaption && !isExpanded
        ? photo.caption!.substring(0, 80) + '...'
        : photo.caption;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            style={{ rotate: photo.rotation }}
            className={`${isAfterParty
                ? 'bg-white/5 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(168,85,247,0.2)]'
                : 'bg-white/80 border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.25)]'} 
                backdrop-blur-md p-4 pb-12 hover:-translate-y-2 transition-all duration-300 w-full max-w-[320px] mx-auto relative group border rounded-xl`}
        >
            {isAdmin && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
                    className="absolute -right-3 -top-3 w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg z-30 hover:bg-red-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                    title="Yönetici Silme Yetkisi"
                >
                    <Trash2 size={18} />
                </button>
            )}

            <AnimatePresence>
                {!isAdmin && isOwner && timeLeft > 0 && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
                        className={`absolute -right-2 -top-4 flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full shadow-lg z-20 transition-colors ${isAfterParty ? 'bg-[#1a1a1a] text-purple-400 border-purple-500/30 hover:bg-purple-900/20' : 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50'}`}
                        title="Silmek için kalan süre"
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke={isAfterParty ? "#3b0764" : "#fecdd3"} strokeWidth="3" fill="none" />
                                <motion.circle
                                    cx="12" cy="12" r="10"
                                    stroke={isAfterParty ? "#a855f7" : "#f43f5e"}
                                    strokeWidth="3"
                                    fill="none"
                                    initial={{ pathLength: 1 }}
                                    animate={{ pathLength: timeLeft / 30 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </svg>
                            <Trash2 size={10} className={`relative z-10 ${isAfterParty ? 'text-purple-400' : 'text-rose-600'}`} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums leading-none">
                            Sil ({timeLeft})
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <div className={`aspect-[4/5] w-full mb-4 overflow-hidden grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 ring-1 ring-black/5 flex items-center justify-center relative ${isAfterParty ? 'bg-[#0f0f0f]' : 'bg-stone-50'}`}>
                {photo.type === 'video' ? (
                    <>
                        <video
                            ref={videoRef}
                            key={photo.url}
                            playsInline
                            muted
                            autoPlay
                            loop
                            preload="auto"
                            className="w-full h-full object-contain bg-stone-900"
                        >
                            <source src={photo.url} type={photo.mimeType || 'video/mp4'} />
                            Tarayıcınız bu videoyu desteklemiyor.
                        </video>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            animate={{ opacity: isPlaying ? 0 : 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group/controls"
                        >
                            <button
                                onClick={togglePlay}
                                className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform hover:scale-110 transition-transform mb-4"
                            >
                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transform hover:scale-110 transition-transform"
                                title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </motion.div>
                    </>
                ) : (
                    <img src={photo.url} alt="Memory" className="w-full h-full object-contain" loading="lazy" />
                )}
            </div>

            {photo.caption && (
                <div
                    className={`text-center text-lg md:text-xl leading-relaxed px-2 pt-2 break-words transition-all duration-300 ${isAfterParty ? 'text-purple-100' : 'text-stone-700'}`}
                    style={{ fontFamily: "'Courgette', system-ui" }}
                >
                    {displayCaption}
                    {isLongCaption && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={`inline-block ml-1 font-sans text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${isAfterParty ? 'text-purple-400 bg-purple-950/50 hover:text-purple-300' : 'text-rose-500 bg-rose-50 hover:text-rose-600'}`}
                        >
                            {isExpanded ? 'Gizle' : 'Devamını Gör'}
                        </button>
                    )}
                </div>
            )}

            {photo.timestamp && (
                <div className={`absolute bottom-2 right-4 text-[10px] font-mono ${isAfterParty ? 'text-purple-300/30' : 'text-stone-300'}`}>
                    {photo.timestamp.toLocaleDateString('tr-TR')} {photo.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </motion.div>
    );
};

export const Guestbook: React.FC<{
    isAdmin?: boolean;
    onAdminLogout?: () => void;
    isAfterParty?: boolean;
}> = ({ isAdmin = false, onAdminLogout, isAfterParty }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [userId, setUserId] = useState<string>('');


    const [visibleCount, setVisibleCount] = useState(6);
    const [showCamera, setShowCamera] = useState(false);

    const handleCameraCapture = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsUploading(true);
        setShowCamera(false);
    };

    const headerLines = isAfterParty
        ? ["Kutlama asıl şimdi başlıyor.", "Gece bizim!"]
        : ["Bu hikâye yıllardır ‘biz’di.", "Şimdi resmileşiyor."];

    const titleColors = isAfterParty
        ? { icon: "text-purple-400", sub: "text-purple-300", accent: "text-purple-100" }
        : { icon: "text-rose-500", sub: "text-stone-800", accent: "text-stone-600" };

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });

        tl.from(".retro-title-content", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(".typewriter-line-0 .typewriter-char", {
                opacity: 0,
                y: 5,
                stagger: 0.03,
                duration: 0.05,
                ease: "none"
            }, "-=0.5")
            .from(".typewriter-line-1 .typewriter-char", {
                opacity: 0,
                y: 5,
                stagger: 0.03,
                duration: 0.05,
                ease: "none"
            }, "+=0.1"); // Slight pause between lines

    }, { scope: containerRef });



    // Initialize User ID
    useEffect(() => {
        let storedId = localStorage.getItem('wedding_guest_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('wedding_guest_id', storedId);
        }
        setUserId(storedId);
    }, []);

    // Fetch Photos
    useEffect(() => {
        const q = query(
            collection(db, 'guestbook'),
            orderBy('timestamp', 'desc'),
            limit(visibleCount)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPhotos = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    url: data.url,
                    caption: data.caption,
                    rotation: data.rotation,
                    userId: data.userId,
                    storagePath: data.storagePath,
                    type: data.type || 'image',
                    mimeType: data.mimeType,
                    isHidden: data.isHidden || false,
                    timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
                } as Photo;
            }).filter(photo => !photo.isHidden);
            setPhotos(fetchedPhotos);
        }, (error) => {
            console.error("Realtime listener error:", error);
        });

        return () => unsubscribe();
    }, [visibleCount]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 1. Size Check (100MB)
            if (file.size > 100 * 1024 * 1024) {
                alert("Dosya boyutu çok büyük! Lütfen 100MB'dan küçük bir dosya seçin.");
                return;
            }

            // 2. Video Duration Check
            if (file.type.startsWith('video/')) {
                const duration = await getVideoDuration(file);
                if (duration > 15) {
                    alert("Video süresi 15 saniyeden uzun olamaz.");
                    return;
                }
            }

            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsUploading(true);
        }
    };

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            }
            video.src = URL.createObjectURL(file);
        });
    };

    const handlePost = async () => {
        if (!selectedFile || !previewUrl) return;

        try {
            setIsSubmitting(true);
            const filename = `guestbook/${Date.now()}-${selectedFile.name}`;
            const storageRef = ref(storage, filename);

            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, 'guestbook'), {
                url: downloadURL,
                caption: caption,
                timestamp: serverTimestamp(),
                rotation: Math.random() * 6 - 3,
                userId: userId,
                storagePath: filename,
                type: selectedFile.type.startsWith('video/') ? 'video' : 'image',
                mimeType: selectedFile.type
            });

            handleCloseUpload();
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (photo: Photo) => {
        if (!confirm("Bu anıyı silmek istiyor musun? İşlem geri alınamaz.")) return;

        try {
            // Soft Delete: Just mark as hidden in Firestore
            await updateDoc(doc(db, 'guestbook', photo.id), {
                isHidden: true
            });
        } catch (error) {
            console.error("Error soft-deleting photo:", error);
            alert("Silinirken bir hata oluştu.");
        }
    };

    const handleCloseUpload = () => {
        setIsUploading(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <Section id="guestbook" className={`py-24 overflow-hidden relative transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-stone-100'}`}>


            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-16 px-4">
                    <div className="retro-title-content select-none">
                        <div className={`flex items-center justify-center gap-2 font-bold tracking-[0.2em] uppercase mb-4 ${titleColors.icon}`}>
                            <Camera size={20} />
                            <span>SİZDEN KARELER</span>
                        </div>
                        <h2
                            className={`text-4xl md:text-5xl font-serif mb-6 font-medium cursor-default select-none relative ${isAfterParty ? 'text-white' : 'text-stone-800'}`}
                        >
                            Anı Duvarı
                            <AnimatePresence>
                                {isAdmin && (
                                    <motion.button
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        onClick={onAdminLogout}
                                        className={`absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold tracking-widest rounded-full uppercase border shadow-sm transition-all group/admin ${isAfterParty ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:scale-105'}`}
                                        title="Admin Modunu Kapat"
                                    >
                                        <span className="relative">Yönetici Modu Aktif</span>
                                        <LogOut size={12} className="group-hover/admin:translate-x-0.5 transition-transform" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </h2>
                    </div>

                    <div className={`max-w-2xl mx-auto text-lg md:text-xl font-serif italic leading-relaxed flex flex-col items-center gap-1 min-h-[60px] ${isAfterParty ? 'text-purple-100/70' : 'text-stone-600'}`}>
                        {headerLines.map((line, lineIndex) => (
                            <p key={lineIndex} className={`typewriter-line-${lineIndex} whitespace-nowrap`}>
                                {line.split("").map((char, charIndex) => (
                                    <span key={charIndex} className="typewriter-char inline-block whitespace-pre">
                                        {char}
                                    </span>
                                ))}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mb-16 flex flex-col items-center relative z-20">
                    <AnimatePresence>
                        {showCamera && (
                            <CameraModal
                                isAfterParty={isAfterParty}
                                onClose={() => setShowCamera(false)}
                                onCapture={handleCameraCapture}
                                onGalleryClick={() => {
                                    setShowCamera(false);
                                    fileInputRef.current?.click();
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {!isUploading ? (
                            <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mx-auto">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex-1 group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all shadow-sm hover:shadow-md cursor-pointer ${isAfterParty ? 'bg-purple-950/10 border-purple-500/20 hover:border-purple-500/50' : 'bg-white border-rose-200 hover:border-rose-400'}`}
                                >
                                    <div className={`p-4 rounded-full transition-colors ${isAfterParty ? 'bg-purple-900/40 text-purple-400 group-hover:bg-purple-800/50' : 'bg-rose-50 text-rose-500 group-hover:bg-rose-100'}`}>
                                        <Upload size={32} />
                                    </div>
                                    <div className="text-center">
                                        <span className={`block font-serif text-lg mb-1 ${isAfterParty ? 'text-purple-100' : 'text-stone-800'}`}>Galeriden Seç</span>
                                        <span className={`text-xs uppercase tracking-wider ${isAfterParty ? 'text-purple-400/60' : 'text-stone-400'}`}>Fotoğraf / Video</span>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                        onChange={handleFileSelect}
                                    />
                                </motion.button>

                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowCamera(true)}
                                    className={`flex-1 group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all shadow-md hover:shadow-lg cursor-pointer text-white ${isAfterParty ? 'bg-purple-600 border-purple-500 hover:bg-purple-700' : 'bg-rose-500 border-rose-500 hover:bg-rose-600'}`}
                                >
                                    <div className="p-4 bg-white/20 rounded-full text-white transition-colors">
                                        <Camera size={32} />
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-serif text-lg mb-1">Kamerayı Aç</span>
                                        <span className="text-xs text-white/70 uppercase tracking-wider">Anı Yakala</span>
                                    </div>
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-6 rounded-2xl shadow-xl w-full max-w-sm border relative ${isAfterParty ? 'bg-[#1a1a1a] border-purple-500/20' : 'bg-white border-stone-100'}`}
                            >
                                <button
                                    onClick={handleCloseUpload}
                                    disabled={isSubmitting}
                                    className={`absolute -top-3 -right-3 p-2 rounded-full shadow-lg border transition-all z-20 ${isAfterParty ? 'bg-[#2a2a2a] text-purple-300 border-purple-500/20 hover:text-red-400' : 'bg-white text-stone-400 hover:text-red-500 hover:bg-red-50 border-stone-100'}`}
                                    title="İptal"
                                >
                                    <X size={20} />
                                </button>

                                <div className={`aspect-square w-full rounded-lg overflow-hidden mb-4 border flex items-center justify-center ${isAfterParty ? 'bg-black border-purple-500/20' : 'bg-stone-100 border-stone-200'}`}>
                                    {previewUrl && (
                                        selectedFile?.type.startsWith('video/')
                                            ? <video src={previewUrl} controls playsInline muted className="w-full h-full object-contain bg-stone-900" />
                                            : <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    )}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Bir not bırakın... (İsteğe bağlı)"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-xl mb-4 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${isAfterParty ? 'bg-purple-900/20 border border-purple-500/20 text-white focus:ring-purple-400/30' : 'bg-stone-50 border border-stone-100 focus:ring-rose-200'}`}
                                />

                                <button
                                    onClick={handlePost}
                                    disabled={isSubmitting}
                                    className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed ${isAfterParty ? 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-800/50' : 'bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-300'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Yükleniyor...
                                        </>
                                    ) : (
                                        "Duvara As"
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16 max-w-7xl mx-auto items-start">
                    <AnimatePresence>
                        {photos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                userId={userId}
                                isAdmin={isAdmin}
                                onDelete={handleDelete}
                                isAfterParty={isAfterParty}
                            />
                        ))}
                    </AnimatePresence>

                    {photos.length === 0 && (
                        <div className={`col-span-full py-24 text-center font-serif italic ${isAfterParty ? 'text-purple-300/40' : 'text-stone-400'}`}>
                            Henüz fotoğraf yok. İlk anıyı sen ekle! ✨
                        </div>
                    )}
                </div>

                {photos.length >= visibleCount && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className={`px-8 py-3 rounded-full font-serif shadow-sm border transition-all active:scale-95 ${isAfterParty ? 'bg-purple-950/20 text-purple-300 border-purple-500/20 hover:border-purple-400 hover:bg-purple-900/30' : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:text-rose-500'}`}
                        >
                            Daha Fazla Göster
                        </button>
                    </div>
                )}

            </div>
        </Section>
    );
};
