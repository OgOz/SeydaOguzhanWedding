export const content = {
    names: {
        bride: "Şeyda",
        groom: "Oğuzhan",
        title: "Şeyda & Oğuzhan",
    },
    date: {
        full: "7 Şubat 2026",
        weekday: "Cumartesi",
        time: "16:30",
        label: "Nikâh Başlangıcı",
        calendar: {
            title: "Şeyda & Oğuzhan Nikâh Töreni",
            description: "Bu özel günümüzde yanımızda olmanız dileğiyle... Kahkaha serbest, duygulanmak normal.",
            location: "Tarık Akan Nikâh Salonu, Bakırköy, İstanbul",
            start: "20260207T133000Z", // 16:30 TRT (UTC+3) is 13:30 UTC
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
        cta: {
            details: "Detaylar",
            map: "Konumu Aç",
            calendar: "Takvime Ekle"
        }
    },
    story: {
        text: "Bu hikâye yıllardır ‘biz’di. Bugün resmileşiyor."
    },
    gift: {
        title: "Yuva Hediyesi",
        sub: "Çiçek yerine yuvamıza küçük bir katkı bırakmak isterseniz, tutarı siz belirleyin.",
        note: "Ödeme Shopier üzerinden güvenli şekilde alınır.",
        chips: [500, 1000, 1500, 2500],
        customLabel: "Farklı Tutar",
        button: "Katkıda Bulunun",
        successMessage: "İyi ki varsın. Bu hediye, yuvamızın küçük bir parçası olacak."
    },
    faq: [
        {
            q: "Kıyafet?",
            a: "Şık rahat."
        },
        {
            q: "Fotoğraf?",
            a: "Bol bol çekin; bizi etiketlemeyi unutmayın."
        },
        {
            q: "Hediye?",
            a: "İsterseniz yuva hediyesi, isterseniz sadece sarılma."
        }
    ],
    footer: {
        copyright: "© ∞ Şeyda & Oğuzhan"
    },
    meta: {
        title: "Şeyda & Oğuzhan - Nikâh Davetiyesi",
        description: "Bu hikâye yıllardır ‘biz’di, bugün resmileşiyor. Şeyda ve Oğuzhan'ın nikâh törenine davetlisiniz. 7 Şubat 2026, Tarık Akan Nikâh Salonu.",
        lang: "tr"
    }
};

export const afterPartyContent = {
    ...content,
    hero: {
        eyebrow: "AFTER PARTY",
        sub: "7 Şubat 2026 · Beyoğlu, İstanbul",
        signature: "Mutluluğumuzu paylaşmaya, eğlenceli bir akşamla devam ediyoruz.",
        cta: {
            details: "Party Detayları",
            map: "Mekânı Gör",
            calendar: "Takvime Ekle"
        }
    },
    date: {
        ...content.date,
        time: "20:00",
        label: "Eğlence Başlangıcı",
        calendar: {
            title: "Şeyda & Oğuzhan After Party",
            description: "Nikâh sonrası küçük bir kutlama ve eğlence!",
            location: "Parma Beyoğlu, İstanbul",
            start: "20260207T170000Z", // 20:00 TRT is 17:00 UTC
            end: "20260207T210000Z",   // 00:00 TRT is 21:00 UTC
        }
    },
    location: {
        name: "Parma Beyoğlu",
        district: "Beyoğlu, İstanbul",
        city: "İstanbul",
        mapLink: "https://maps.app.goo.gl/DKAFXpVy3ut13dwCA",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.222384110839!2d28.9803362!3d40.9168943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab002ebac969b%3A0xe54959db62af7611!2sParma%20Beyo%C4%9flu!5e0!3m2!1str!2str!4v1706004631234!5m2!1str!2str", // Placeholder for Parma Beyoglu embed if possible, or leave blank if unsure. I'll use a generic search embed if I can't find exact.
    },
    story: {
        text: "Kutlama devam ediyor. Bu özel akşamda birlikteyiz."
    },
    meta: {
        title: "Şeyda & Oğuzhan - After Party",
        description: "Nikâh töreni sonrası küçük bir kutlama ve eğlence. 7 Şubat 2026, Parma Beyoğlu.",
        lang: "tr"
    }
};
