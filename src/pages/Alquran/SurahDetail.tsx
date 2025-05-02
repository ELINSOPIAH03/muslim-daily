import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { SurahDetail } from "../../types/al-quran"

export default function SurahDetail() {
    const { id } = useParams(); // Ambil ID dari URL
    const [surah, setSurah] = useState<SurahDetail | null>(null);


    const getSurahDetail = async () => {
        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
            const data = await res.json();
            setSurah(data.data);
        } catch (err) {
            console.error("Gagal ambil detail surah:", err);
        }
    };

    useEffect(() => {
        getSurahDetail();
    }, [id]);

    if (!surah) {
        return <p className="p-4">Loading Dulu Gois...</p>;
    }
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">SurahDetail</h1>
            <p>Selamat datang di aplikasi Al-Qur'an interaktif.</p>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-2">
                    {surah.englishName} ({surah.name})
                </h1>
                <p className="mb-2">
                    Tempat Turun: {surah.revelationType === "Meccan" ? "Mekah" : "Madinah"}
                </p>
                <p className="mb-4">Jumlah Ayat: {surah.numberOfAyahs}</p>

                <ul className="space-y-3">
                    {surah.ayahs.map((ayah) => (
                        <li key={ayah.number} className="border-b pb-2">
                            <p className="font-arabic text-right text-2xl">{ayah.text}</p>
                            <p className="text-sm text-gray-500">Ayat {ayah.numberInSurah}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}