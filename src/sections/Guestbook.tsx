import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Section';
import { Camera, Upload, X, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { db, storage } from '../lib/firebase';
import { CameraModal } from '../components/CameraModal';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface Photo {
    id: string;
    url: string;
    caption?: string;
    timestamp: Date | null;
    rotation: number;
    userId?: string;
    storagePath?: string;
    type?: 'image' | 'video'; // Added to support video uploads
}

const PhotoCard: React.FC<{
    photo: Photo;
    userId: string;
    isAdmin: boolean;
    onDelete: (photo: Photo) => void;
}> = ({ photo, userId, onDelete, isAdmin }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const isOwner = photo.userId === userId;

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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            style={{ rotate: photo.rotation }}
            className="bg-white/80 backdrop-blur-md p-4 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.25)] hover:-translate-y-2 transition-all duration-300 w-full max-w-[320px] mx-auto relative group break-inside-avoid mb-8 border border-white/50 rounded-xl"
        >
            {/* Pins Removed for Modern Look */}

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
                        className="absolute -right-2 -top-4 flex items-center gap-1.5 bg-white pl-2 pr-3 py-1.5 rounded-full shadow-lg text-rose-500 border border-rose-100 z-20 hover:bg-rose-50 transition-colors"
                        title="Silmek için kalan süre"
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="#fecdd3" strokeWidth="3" fill="none" />
                                <motion.circle
                                    cx="12" cy="12" r="10"
                                    stroke="#f43f5e"
                                    strokeWidth="3"
                                    fill="none"
                                    initial={{ pathLength: 1 }}
                                    animate={{ pathLength: timeLeft / 30 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </svg>
                            <Trash2 size={10} className="relative z-10 text-rose-600" />
                        </div>
                        <span className="text-xs font-semibold tabular-nums leading-none">
                            Sil ({timeLeft})
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="aspect-[4/5] w-full bg-stone-100 mb-4 overflow-hidden grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 ring-1 ring-black/5">
                {photo.type === 'video' ? (
                    <video
                        src={photo.url}
                        controls
                        className="w-full h-full object-cover"
                        controlsList="nodownload"
                    />
                ) : (
                    <img src={photo.url} alt="Memory" className="w-full h-full object-cover" loading="lazy" />
                )}
            </div>

            {photo.caption && (
                <div className="text-center font-script text-stone-600 text-xl leading-tight px-2 pt-1 break-words">
                    {photo.caption}
                </div>
            )}

            {photo.timestamp && (
                <div className="absolute bottom-2 right-4 text-[10px] text-stone-300 font-mono">
                    {photo.timestamp.toLocaleDateString('tr-TR')} {photo.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </motion.div>
    );
};

export const Guestbook: React.FC = () => {
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
    const [isAdmin, setIsAdmin] = useState(false);

    const [visibleCount, setVisibleCount] = useState(6);
    const [showCamera, setShowCamera] = useState(false);

    const handleCameraCapture = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsUploading(true);
        setShowCamera(false);
    };

    const headerLines = [
        "Bu hikâye yıllardır ‘biz’di.",
        "Şimdi resmileşiyor."
    ];

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

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState(false);

    // Initialize User ID & Check Admin Status
    useEffect(() => {
        let storedId = localStorage.getItem('wedding_guest_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('wedding_guest_id', storedId);
        }
        setUserId(storedId);

        // Check if already authenticated
        const storedAdmin = localStorage.getItem('wedding_admin_auth');
        if (storedAdmin === 'true') {
            setIsAdmin(true);
        } else {
            // Check for login trigger in URL
            const params = new URLSearchParams(window.location.search);
            if (params.has('admin')) {
                setShowLoginModal(true);
                // Clean URL
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
        }
    }, []);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const ENV_USER = import.meta.env.VITE_ADMIN_USERNAME;
        const ENV_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

        if (loginUser === ENV_USER && loginPass === ENV_PASS) {
            setIsAdmin(true);
            localStorage.setItem('wedding_admin_auth', 'true');
            setShowLoginModal(false);
            setLoginError(false);
        } else {
            setLoginError(true);
            // Shake effect logic could go here
        }
    };

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
                    timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
                } as Photo;
            });
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
                type: selectedFile.type.startsWith('video/') ? 'video' : 'image'
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
            await deleteDoc(doc(db, 'guestbook', photo.id));
            if (photo.storagePath) {
                const imageRef = ref(storage, photo.storagePath);
                await deleteObject(imageRef).catch(e => console.warn("Storage delete warn:", e));
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
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
        <Section id="guestbook" className="py-24 bg-stone-100 overflow-hidden relative">
            {/* Admin Login Modal */}
            <AnimatePresence>
                {showLoginModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowLoginModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-10 overflow-hidden"
                        >
                            <h3 className="text-2xl font-serif text-rose-950 mb-6 text-center">Yönetici Girişi</h3>

                            <form onSubmit={handleAdminLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        value={loginUser}
                                        onChange={e => setLoginUser(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all text-base"
                                        placeholder="Kullanıcı adı"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Şifre</label>
                                    <input
                                        type="password"
                                        value={loginPass}
                                        onChange={e => setLoginPass(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all text-base"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {loginError && (
                                    <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
                                        Hatalı kullanıcı adı veya şifre.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-rose-500 text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 mt-2"
                                >
                                    Giriş Yap
                                </button>
                            </form>
                        </motion.div>
                    </div>,
                    document.body
                )}
            </AnimatePresence>

            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-16 px-4">
                    <div className="retro-title-content">
                        <div className="flex items-center justify-center gap-2 text-rose-500 font-bold tracking-[0.2em] uppercase mb-4">
                            <Camera size={20} />
                            <span>SİZDEN KARELER</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 font-medium">Anı Duvarı</h2>
                    </div>

                    <div className="text-stone-600 max-w-lg mx-auto text-lg md:text-xl font-serif italic leading-relaxed flex flex-col items-center gap-1 min-h-[60px]">
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
                                {/* Upload Button */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 group relative flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 transition-all shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <div className="p-4 bg-rose-50 rounded-full text-rose-500 group-hover:bg-rose-100 transition-colors">
                                        <Upload size={32} />
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-serif text-lg text-stone-800 mb-1">Galeriden Seç</span>
                                        <span className="text-xs text-stone-400 uppercase tracking-wider">Fotoğraf / Video</span>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,video/mp4,video/quicktime,video/webm"
                                        onChange={handleFileSelect}
                                    />
                                </motion.button>

                                {/* Camera Button */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowCamera(true)}
                                    className="flex-1 group relative flex flex-col items-center gap-4 bg-rose-500 p-8 rounded-2xl border-2 border-rose-500 hover:bg-rose-600 transition-all shadow-md hover:shadow-lg cursor-pointer text-white"
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
                                className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-stone-100 relative"
                            >
                                <button
                                    onClick={handleCloseUpload}
                                    disabled={isSubmitting}
                                    className="absolute -top-3 -right-3 p-2 bg-white text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-lg border border-stone-100 transition-all z-20"
                                    title="İptal"
                                >
                                    <X size={20} />
                                </button>

                                <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-4 border border-stone-200">
                                    {previewUrl && (
                                        selectedFile?.type.startsWith('video/')
                                            ? <video src={previewUrl} controls className="w-full h-full object-cover" />
                                            : <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Bir not bırakın... (İsteğe bağlı)"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 bg-stone-50 rounded-xl mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-50"
                                />

                                <button
                                    onClick={handlePost}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:bg-rose-300 disabled:cursor-not-allowed"
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

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    <AnimatePresence>
                        {photos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                userId={userId}
                                isAdmin={isAdmin}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>

                    {photos.length === 0 && (
                        <div className="col-span-full py-12 text-center text-stone-400 font-serif italic">
                            Henüz fotoğraf yok. İlk anıyı sen ekle! ✨
                        </div>
                    )}
                </div>

                {photos.length >= visibleCount && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="bg-white px-8 py-3 rounded-full text-stone-600 font-serif shadow-sm border border-stone-200 hover:border-rose-300 hover:text-rose-500 hover:shadow-md transition-all active:scale-95"
                        >
                            Daha Fazla Göster
                        </button>
                    </div>
                )}

            </div>
        </Section>
    );
};
