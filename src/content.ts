
// Types for Content Structure
export interface Content {
    lang: 'tr' | 'en';
    names: {
        bride: string;
        groom: string;
        title: string;
    };
    date: {
        full: string;
        weekday: string;
        time: string;
        label: string;
        calendar: {
            title: string;
            description: string;
            location: string;
            start: string;
            end: string;
        };
    };
    location: {
        name: string;
        district: string;
        city: string;
        mapLink: string;
        embedUrl: string;
    };
    hero: {
        eyebrow: string;
        sub: string;
        signature: string;
        holdHint: string;
        scrollText: string;
        cta: {
            details: string;
            map: string;
            calendar: string;
        };
    };
    story: {
        text: string;
    };
    // ... existing gift ...
    gift: {
        title: string;
        sub: string;
        note: string;
        chips: number[];
        customLabel: string;
        button: string;
        successMessage: string;
        // Expanded for Component
        eyebrow: string;
        catchPhrase: {
            default: string;
            caught: string;
        };
        messages: string[];
        modal: {
            title: string;
            sub: string;
            copy: string;
            copied: string;
        }
    };
    // ... existing guestbook ...
    guestbook: {
        eyebrow: string; // SİZDEN KARELER
        title: string;   // Anı Duvarı
        adminBadge: string;
        adminLogout: string;
        headerLines: string[]; // [line1, line2]
        upload: {
            gallery: {
                title: string;
                sub: string;
            };
            camera: {
                title: string;
                sub: string;
            };
            post: string; // Duvara As
            cancel: string;
            placeholder: string; // Bir not bırakın
            loading: string;
        };
        emptyState: string;
        loadMore: string;
        delete: {
            button: string; // Sil ({timeLeft})
            adminTitle: string;
            confirm: string;
        };
        errors: {
            fileSize: string;
            videoDuration: string;
            upload: string;
        };
    };
    faqSection: {
        title: string;
        subtitle: string;
    };
    detailsSection: {
        timeTitle: string;
        locationTitle: string;
        calendarBtn: string;
        directionsBtn: string;
    };
    faq: { q: string; a: string; }[];
    preloader: {
        text: string;
    };
    footer: {
        copyright: string;
    };
    meta: {
        title: string;
        description: string;
    };
}

// ---------------------------------------------------------------------------
// 🇹🇷 TURKISH CONTENT (Base)
// ---------------------------------------------------------------------------

const commonTR = {
    names: {
        bride: "Şeyda",
        groom: "Oğuzhan",
        title: "Şeyda & Oğuzhan",
    },
    footer: {
        copyright: "© ∞ Şeyda & Oğuzhan"
    },
    // Gift logic is shared mostly but texts differ slightly by tone in Party
    gift: {
        title: "Yuva Hediyesi",
        sub: "Çiçek yerine yuvamıza küçük bir katkı bırakmak isterseniz, tutarı siz belirleyin.",
        note: "Ödeme Shopier üzerinden güvenli şekilde alınır.",
        chips: [500, 1000, 1500, 2500],
        customLabel: "Farklı Tutar",
        button: "Katkıda Bulunun",
        successMessage: "İyi ki varsın. Bu hediye, yuvamızın küçük bir parçası olacak.",
        eyebrow: "HEDİYE",
        catchPhrase: {
            default: "Ufak bir katkı?",
            caught: "Desteğiniz için teşekkürler."
        },
        messages: [
            "Bizim için en büyük hediye; yanımızda olmanız 🤍",
            "Cidden söylüyoruz, başka hiçbir şeye gerek yok 🙂",
            "Bu gün; sevgiyle, dostlukla hatırlansın istiyoruz ✨",
            "Biz mutluyuz — sizin varlığınız bize yetiyor 🤍",
            "Hediye konusunu dert etmeyin, keyfimize bakalım 🎉",
            "Bakın, söz veriyoruz: kırılmayız 😄",
            "Nazik düşünceniz bize fazlasıyla değerli 🙏",
            "Pero biz bu günü sade tutmak istiyoruz 🌿",
            "İnatçı olduğunuzu biliyoruz… yine de yok diyoruz 😄",
            "Gerçekten: varlığınız bizim için en güzeli 🤍",
            "Şimdi eğlenmeye dönelim, gerisini boş verelim 🎶",
            "İyi ki varsınız — birlikte kutlamak yeter 🎊",
            "Eğer içiniz rahat etmeyecekse, küçük bir katkıyı sevgiyle kabul ederiz 🤍",
            "Ama bilin ki: bizim için en değerli hediye hâlâ sizsiniz ✨"
        ],
        modal: {
            title: "Şaka bir yana, yanımızda olmanız en büyük hediye.",
            sub: "Yine de katkıda bulunmak isterseniz aşağıdan bilgilerimize ulaşabilirsiniz:",
            copy: "IBAN Kopyala",
            copied: "IBAN Kopyalandı"
        }
    },
    guestbook: {
        eyebrow: "SİZDEN KARELER",
        title: "Anı Duvarı",
        adminBadge: "Yönetici Modu Aktif",
        adminLogout: "Admin Modunu Kapat",
        headerLines: ["Bu hikâye yıllardır ‘biz’di.", "Şimdi resmileşiyor."],
        upload: {
            gallery: {
                title: "Galeriden Seç",
                sub: "Fotoğraf / Video"
            },
            camera: {
                title: "Kamerayı Aç",
                sub: "Anı Yakala"
            },
            post: "Duvara As",
            cancel: "İptal",
            placeholder: "Bir not bırakın... (İsteğe bağlı)",
            loading: "Yükleniyor..."
        },
        emptyState: "Henüz fotoğraf yok. İlk anıyı sen ekle! ✨",
        loadMore: "Daha Fazla Göster",
        delete: {
            button: "Sil",
            adminTitle: "Yönetici Silme Yetkisi",
            confirm: "Bu anıyı silmek istiyor musun? İşlem geri alınamaz."
        },
        errors: {
            fileSize: "Dosya boyutu çok büyük! Lütfen 100MB'dan küçük bir dosya seçin.",
            videoDuration: "Video süresi 15 saniyeden uzun olamaz.",
            upload: "Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
        }
    }
};

export const weddingTR: Content = {
    lang: 'tr',
    ...commonTR,
    date: {
        full: "7 Şubat 2026",
        weekday: "Cumartesi",
        time: "16:30",
        label: "Nikâh Başlangıcı",
        calendar: {
            title: "Şeyda & Oğuzhan Nikâh Töreni",
            description: "Bu özel günümüzde yanımızda olmanız dileğiyle... Kahkaha serbest, duygulanmak normal.",
            location: "Tarık Akan Nikâh Salonu, Bakırköy, İstanbul",
            start: "20260207T133000Z",
            end: "20260207T143000Z",
        }
    },
    location: {
        name: "Tarık Akan Nikâh Salonu",
        district: "Bakırköy, İstanbul",
        city: "İstanbul",
        mapLink: "https://maps.app.goo.gl/TvXrBjn2bMpvadt66",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.022060459553!2d28.851520876622743!3d40.98099777135443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa34de3054557%3A0x2fe1ee990a4772cf!2sTar%C4%B1k%20Akan%20Konferans%20Salonu!5e0!3m2!1str!2str!4v1766565419609!5m2!1str!2str",
    },
    hero: {
        eyebrow: "NİKAH DAVETİYESİ",
        sub: "7 Şubat 2026 · Bakırköy, İstanbul",
        signature: "Kahkaha serbest. Duygulanmak normal.",
        holdHint: "Kalbe Basılı Tutun",
        scrollText: "Gelin, Birlikte Kutlayalım",
        cta: {
            details: "Detaylar",
            map: "Konumu Aç",
            calendar: "Takvime Ekle"
        }
    },
    faqSection: {
        title: "MERAK EDİLENLER",
        subtitle: "Detaylar & Notlar"
    },
    detailsSection: {
        timeTitle: "ZAMAN",
        locationTitle: "MEKÂN",
        calendarBtn: "Takvime Ekle (.ics)",
        directionsBtn: "Haritada Yol Tarifi"
    },
    story: {
        text: "Bu hikâye yıllardır ‘biz’di. Bugün resmileşiyor."
    },
    faq: [
        { q: "Kıyafet?", a: "Şık rahat." },
        { q: "Fotoğraf?", a: "Bol bol çekin; bizi etiketlemeyi unutmayın." },
        { q: "Hediye?", a: "İsterseniz yuva hediyesi, isterseniz sadece sarılma." }
    ],
    preloader: {
        text: "Birlikte, nihayet..."
    },
    meta: {
        title: "Şeyda & Oğuzhan - Nikâh Davetiyesi",
        description: "Bu hikâye yıllardır ‘biz’di, bugün resmileşiyor. Şeyda ve Oğuzhan'ın nikâh törenine davetlisiniz. 7 Şubat 2026, Tarık Akan Nikâh Salonu.",
    }
};

export const partyTR: Content = {
    lang: 'tr',
    ...commonTR,
    gift: {
        ...commonTR.gift,
        eyebrow: "DESTEK",
    },
    guestbook: {
        ...commonTR.guestbook,
        headerLines: ["Kutlama asıl şimdi başlıyor.", "Gece bizim!"]
    },
    date: {
        full: "7 Şubat 2026",
        weekday: "Cumartesi",
        time: "20:00",
        label: "Eğlence Başlangıcı",
        calendar: {
            title: "Şeyda & Oğuzhan After Party",
            description: "Nikâh sonrası küçük bir kutlama ve eğlence!",
            location: "Parma Beyoğlu, İstanbul",
            start: "20260207T170000Z",
            end: "20260207T210000Z",
        }
    },
    location: {
        name: "Parma Beyoğlu",
        district: "Beyoğlu, İstanbul",
        city: "İstanbul",
        mapLink: "https://maps.app.goo.gl/DKAFXpVy3ut13dwCA",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.222384110839!2d28.9803362!3d40.9168943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab002ebac969b%3A0xe54959db62af7611!2sParma%20Beyo%C4%9flu!5e0!3m2!1str!2str!4v1706004631234!5m2!1str!2str",
    },
    hero: {
        eyebrow: "AFTER PARTY",
        sub: "7 Şubat 2026 · Beyoğlu, İstanbul",
        signature: "Mutluluğumuzu paylaşmaya, eğlenceli bir akşamla devam ediyoruz.",
        holdHint: "Partiye Giriş Yapın",
        scrollText: "Eğlenceye Hazır Olun",
        cta: {
            details: "Party Detayları",
            map: "Mekânı Gör",
            calendar: "Takvime Ekle"
        }
    },
    faqSection: {
        title: "MERAK EDİLENLER",
        subtitle: "Detaylar & Notlar"
    },
    detailsSection: {
        timeTitle: "ZAMAN",
        locationTitle: "MEKÂN",
        calendarBtn: "Takvime Ekle (.ics)",
        directionsBtn: "Haritada Yol Tarifi"
    },
    story: {
        text: "Kutlama devam ediyor. Bu özel akşamda birlikteyiz."
    },
    faq: [
        { q: "Kıyafet?", a: "Dans edebileceğin kadar rahat." },
        { q: "Kimler var?", a: "Sadece en yakınlar, biz bizeyiz." },
        { q: "Ne zaman biter?", a: "Enerjimiz tükenene kadar." }
    ],
    preloader: {
        text: "Gece başlıyor..."
    },
    meta: {
        title: "Şeyda & Oğuzhan - After Party",
        description: "Nikâh töreni sonrası küçük bir kutlama ve eğlence. 7 Şubat 2026, Parma Beyoğlu.",
    }
};

// ---------------------------------------------------------------------------
// 🇺🇸 ENGLISH CONTENT
// ---------------------------------------------------------------------------

const commonEN = {
    names: {
        bride: "Şeyda",
        groom: "Oğuzhan",
        title: "Şeyda & Oğuzhan",
    },
    footer: {
        copyright: "© ∞ Şeyda & Oğuzhan"
    },
    gift: {
        title: "Wedding Gift",
        sub: "If you wish to contribute to our home instead of flowers, the amount is up to you.",
        note: "Payment is securely processed via Shopier.",
        chips: [500, 1000, 1500, 2500],
        customLabel: "Custom Amount",
        button: "Contribute",
        successMessage: "Glad to have you. This gift will be a small part of our home.",
        eyebrow: "GIFT",
        catchPhrase: {
            default: "A small contribution?",
            caught: "Thank you for your support."
        },
        messages: [
            "The greatest gift for us is your presence 🤍",
            "Seriously, nothing else is needed 🙂",
            "We want this day remembered with love and friendship ✨",
            "We are happy — your presence is enough 🤍",
            "Don't worry about gifts, let's just enjoy the moment 🎉",
            "Look, we promise: we won't be offended 😄",
            "Your kind thought is more than valuable to us 🙏",
            "But we want to keep this day simple 🌿",
            "We know you are stubborn... but we still say no 😄",
            "Really: your presence is the most beautiful thing 🤍",
            "Now let's get back to fun, forget the rest 🎶",
            "Glad you're here — celebrating together is enough 🎊",
            "If you still insist, we accept your contribution with love 🤍",
            "But know that: you are still the most valuable gift ✨"
        ],
        modal: {
            title: "Jokes aside, your presence is the greatest gift.",
            sub: "If you still wish to contribute, our details are below:",
            copy: "Copy IBAN",
            copied: "IBAN Copied"
        }
    },
    guestbook: {
        eyebrow: "YOUR SHOTS",
        title: "Memory Wall",
        adminBadge: "Admin Mode Active",
        adminLogout: "Exit Admin Mode",
        headerLines: ["This story has been 'us' for years.", "Now it becomes official."],
        upload: {
            gallery: {
                title: "Choose from Gallery",
                sub: "Photo / Video"
            },
            camera: {
                title: "Open Camera",
                sub: "Capture Memory"
            },
            post: "Post to Wall",
            cancel: "Cancel",
            placeholder: "Leave a note... (Optional)",
            loading: "Uploading..."
        },
        emptyState: "No photos yet. Be the first to add a memory! ✨",
        loadMore: "Show More",
        delete: {
            button: "Delete",
            adminTitle: "Admin Delete Power",
            confirm: "Do you want to delete this memory? This cannot be undone."
        },
        errors: {
            fileSize: "File size too large! Please choose a file smaller than 100MB.",
            videoDuration: "Video duration cannot be longer than 15 seconds.",
            upload: "An error occurred while uploading. Please try again."
        }
    }
};

export const weddingEN: Content = {
    lang: 'en',
    ...commonEN,
    date: {
        full: "February 7, 2026",
        weekday: "Saturday",
        time: "16:30",
        label: "Ceremony Start",
        calendar: {
            title: "Şeyda & Oğuzhan Wedding Ceremony",
            description: "We hope you will be with us on this special day... Laughter is free, tears are normal.",
            location: "Tarık Akan Wedding Hall, Bakirkoy, Istanbul",
            start: "20260207T133000Z",
            end: "20260207T143000Z",
        }
    },
    location: {
        name: "Tarık Akan Wedding Hall",
        district: "Bakirkoy, Istanbul",
        city: "Istanbul",
        mapLink: "https://maps.app.goo.gl/TvXrBjn2bMpvadt66",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.022060459553!2d28.851520876622743!3d40.98099777135443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa34de3054557%3A0x2fe1ee990a4772cf!2sTar%C4%B1k%20Akan%20Konferans%20Salonu!5e0!3m2!1str!2str!4v1766565419609!5m2!1str!2str",
    },
    hero: {
        eyebrow: "WEDDING INVITATION",
        sub: "February 7, 2026 · Bakirkoy, Istanbul",
        signature: "Laughter is free. Tears are normal.",
        holdHint: "Hold the Heart",
        scrollText: "Come, Let's Celebrate Together",
        cta: {
            details: "Details",
            map: "Open Map",
            calendar: "Add to Calendar"
        }
    },
    faqSection: {
        title: "CURIOSITIES",
        subtitle: "Details & Notes"
    },
    detailsSection: {
        timeTitle: "TIME",
        locationTitle: "VENUE",
        calendarBtn: "Add to Calendar (.ics)",
        directionsBtn: "Get Directions"
    },
    story: {
        text: "This story has been 'us' for years. Today it becomes official."
    },
    faq: [
        { q: "Dress Code?", a: "Smart casual." },
        { q: "Photos?", a: "Take plenty; don't forget to tag us." },
        { q: "Gifts?", a: "A gift for our home if you wish, or just a hug." }
    ],
    preloader: {
        text: "Together, finally..."
    },
    meta: {
        title: "Şeyda & Oğuzhan - Wedding Invitation",
        description: "This story has been 'us' for years, today it becomes official. You are invited to Şeyda & Oğuzhan's wedding ceremony. February 7, 2026, Tarık Akan Wedding Hall.",
    }
};

export const partyEN: Content = {
    lang: 'en',
    ...commonEN,
    gift: {
        ...commonEN.gift,
        eyebrow: "SUPPORT",
    },
    guestbook: {
        ...commonEN.guestbook,
        headerLines: ["The celebration is just starting.", "The night is ours!"]
    },
    date: {
        full: "February 7, 2026",
        weekday: "Saturday",
        time: "20:00",
        label: "Party Start",
        calendar: {
            title: "Şeyda & Oğuzhan After Party",
            description: "A small celebration and fun after the ceremony!",
            location: "Parma Beyoglu, Istanbul",
            start: "20260207T170000Z",
            end: "20260207T210000Z",
        }
    },
    location: {
        name: "Parma Beyoglu",
        district: "Beyoglu, Istanbul",
        city: "Istanbul",
        mapLink: "https://maps.app.goo.gl/DKAFXpVy3ut13dwCA",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.222384110839!2d28.9803362!3d40.9168943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab002ebac969b%3A0xe54959db62af7611!2sParma%20Beyo%C4%9flu!5e0!3m2!1str!2str!4v1706004631234!5m2!1str!2str",
    },
    hero: {
        eyebrow: "AFTER PARTY",
        sub: "February 7, 2026 · Beyoglu, Istanbul",
        signature: "Continuing to share our happiness with a fun evening.",
        holdHint: "Enter the Party",
        scrollText: "Get Ready to Party",
        cta: {
            details: "Party Details",
            map: "View Venue",
            calendar: "Add to Calendar"
        }
    },
    faqSection: {
        title: "CURIOSITIES",
        subtitle: "Details & Notes"
    },
    detailsSection: {
        timeTitle: "TIME",
        locationTitle: "VENUE",
        calendarBtn: "Add to Calendar (.ics)",
        directionsBtn: "Get Directions"
    },
    story: {
        text: "The celebration continues. Together on this special evening."
    },
    faq: [
        { q: "Dress Code?", a: "Comfortable enough to dance." },
        { q: "Who's coming?", a: "Just close friends, it's just us." },
        { q: "When does it end?", a: "Until we run out of energy." }
    ],
    preloader: {
        text: "The night begins..."
    },
    meta: {
        title: "Şeyda & Oğuzhan - After Party",
        description: "A small celebration and fun after the wedding ceremony. February 7, 2026, Parma Beyoglu.",
    }
};
