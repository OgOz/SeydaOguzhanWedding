import React, { useState, useRef, useEffect } from 'react';
import { Section } from '../components/Section';
import { Camera, Upload, X, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { db, storage } from '../lib/firebase'; // Import firebase services
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface Photo {
    id: string;
    url: string;
    caption?: string;
    timestamp: Date | null;
    rotation: number;
    userId?: string; // ID of the uploader
    storagePath?: string; // Path to the file in Firebase Storage
}

export const Guestbook: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isUploading, setIsUploading] = useState(false); // Controls the UI state (form open/close)
    const [isSubmitting, setIsSubmitting] = useState(false); // Controls the actual upload process
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [userId, setUserId] = useState<string>(''); // Identifying the current user

    useGSAP(() => {
        gsap.from(".retro-title", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
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

    // Fetch Photos from Firebase Realtime
    useEffect(() => {
        // Query the 'guestbook' collection, ordered by timestamp descending
        const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));

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
                    // Handle timestamp: it might be null initially if using serverTimestamp and we read it back instantly,
                    // or it might be a proper Firestore Timestamp.
                    timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
                } as Photo;
            });
            setPhotos(fetchedPhotos);
        }, (error) => {
            console.error("Realtime listener error:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (e.g., max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert("Dosya boyutu çok büyük! Lütfen 10MB'dan küçük bir fotoğraf seçin.");
                return;
            }

            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsUploading(true);
        }
    };

    const handlePost = async () => {
        if (!selectedFile || !previewUrl) return;

        try {
            setIsSubmitting(true);

            // 1. Upload Image to Firebase Storage
            // Create a unique filename
            const filename = `guestbook/${Date.now()}-${selectedFile.name}`;
            const storageRef = ref(storage, filename);

            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, 'guestbook'), {
                url: downloadURL,
                caption: caption,
                timestamp: serverTimestamp(), // Server-side timestamp
                rotation: Math.random() * 6 - 3, // Random rotation between -3 and 3
                userId: userId, // Associate photo with this user
                storagePath: filename // Store path for easier deletion
            });

            // 3. Reset UI
            handleCloseUpload();

        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (photo: Photo) => {
        if (!confirm("Bu anıyı silmek istediğine emin misin?")) return;

        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'guestbook', photo.id));

            // 2. Delete from Storage if storagePath exists
            if (photo.storagePath) {
                const imageRef = ref(storage, photo.storagePath);
                await deleteObject(imageRef);
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
        <Section id="guestbook" className="py-24 bg-stone-100 overflow-hidden">
            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 retro-title">
                    <div className="flex items-center justify-center gap-2 text-rose-500 font-bold tracking-[0.2em] uppercase mb-4">
                        <Camera size={20} />
                        <span>SİZDEN KARELER</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">Anı Duvarı</h2>
                    <p className="text-stone-500 max-w-lg mx-auto">
                        En güzel anılarımızı paylaşıyoruz. Siz de çektiğiniz fotoğrafları ekleyin, hikayemize ortak olun.
                    </p>
                </div>

                {/* Upload Area */}
                <div className="mb-16 flex flex-col items-center relative z-20">
                    <AnimatePresence mode="wait">
                        {!isUploading ? (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 transition-all shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <div className="p-4 bg-rose-50 rounded-full text-rose-500 group-hover:bg-rose-100 transition-colors">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <span className="block font-serif text-xl text-stone-800 mb-1">Bir Fotoğraf Ekle</span>
                                    <span className="text-xs text-stone-400 uppercase tracking-wider">Buraya tıklayın</span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </motion.button>
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
                                    className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>

                                <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-4 border border-stone-200">
                                    {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
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

                {/* Timeline / Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    <AnimatePresence>
                        {photos.map((photo) => (
                            <motion.div
                                key={photo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.4 }}
                                style={{ rotate: photo.rotation }}
                                className="bg-white p-4 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-xl transition-shadow w-full max-w-[320px] mx-auto relative group"
                            >
                                {/* Pin Effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-400 shadow-sm z-10 border border-white/50"></div>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 opacity-80 animate-pulse"></div>

                                {/* Delete Button (Only visible to owner) */}
                                {photo.userId === userId && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(photo); }}
                                        className="absolute -right-2 -top-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-stone-400 hover:text-red-500 hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
                                        title="Anıyı sil"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}

                                <div className="aspect-[4/5] w-full bg-stone-100 mb-4 overflow-hidden grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 ring-1 ring-black/5">
                                    <img src={photo.url} alt="Memory" className="w-full h-full object-cover" loading="lazy" />
                                </div>

                                {photo.caption && (
                                    <div className="text-center font-script text-stone-600 text-xl leading-tight px-2 pt-1 break-words">
                                        {photo.caption}
                                    </div>
                                )}

                                {photo.timestamp && (
                                    <div className="absolute bottom-2 right-4 text-[10px] text-stone-300 font-mono">
                                        {photo.timestamp.toLocaleDateString('tr-TR')}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {photos.length === 0 && (
                        <div className="col-span-full py-12 text-center text-stone-400 font-serif italic">
                            Henüz fotoğraf yok. İlk anıyı sen ekle! ✨
                        </div>
                    )}
                </div>

            </div>
        </Section>
    );
};
