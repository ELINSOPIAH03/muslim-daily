import { JadwalSalat } from '../types/home'; 

// Mengonversi bulan Hijriah ke dalam bahasa Arab
export const convertHijriToArabicMonth = (month: number) => {
    const months = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
        'جمادى الأولى', 'جمادى الثانية', 'رجب',
        'شعبان', 'رمضان', 'شوال', 'ذوالقعدة', 'ذوالحجة'
    ];
    return months[month - 1]; // Bulan dalam format 1-based
};

// Mengonversi angka latin ke arab
export const toArabicNumber = (str: string) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    // Hilangkan nol di depan, tapi jangan ubah angka nol asli
    const cleaned = str.replace(/^0+/, '') || '0';
    return cleaned.split('').map(d => arabicDigits[parseInt(d)] || d).join('');
};


// Menampilkan jadwal salat
export const tampilkanJadwalSalat = (timings: JadwalSalat) => {
    const namaSalatKeys = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const namaSalatLabels = ['Imsak', 'Subuh', 'Terbit', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

    const list = document.getElementById('waktu-sholat-list');
    const items = list?.querySelectorAll('div.bg-sage-50, div.bg-sage-300');

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const waktuMenit = namaSalatKeys.map(k => {
        const [h, m] = timings[k].split(':').map(Number);
        return h * 60 + m;
    });

    let activeIndex = 0;
    for (let i = 0; i < waktuMenit.length; i++) {
        if (nowMinutes >= waktuMenit[i]) {
            activeIndex = i;
        } else {
            break;
        }
    }

    items?.forEach((item, index) => {
        const key = namaSalatKeys[index];
        const labelText = namaSalatLabels[index];
        const waktuText = timings[key];

        if (!waktuText) return;

        item.classList.remove('bg-sage-50', 'bg-sage-300');
        item.classList.add(index === activeIndex ? 'bg-sage-300' : 'bg-sage-50');

        let teksLabel = item.querySelector('.waktu-label');
        let teksJam = item.querySelector('.waktu-jam');

        if (!teksLabel || !teksJam) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex w-full justify-between items-center';

            teksLabel = document.createElement('p');
            teksLabel.className = 'text-lg sm:text-xl/6 waktu-label';

            teksJam = document.createElement('p');
            teksJam.className = 'text-lg sm:text-xl/6 waktu-jam';

            wrapper.appendChild(teksLabel);
            wrapper.appendChild(teksJam);
            item.appendChild(wrapper);
        }

        teksLabel.textContent = labelText;
        teksJam.textContent = waktuText;
    });
};
