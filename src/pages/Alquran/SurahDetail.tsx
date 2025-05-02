import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { SurahDetail, Ayah } from "../../types/al-quran"

import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

export default function SurahDetail() {
    const { id } = useParams(); // Ambil ID dari URL
    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [translation, setTranslation] = useState<Ayah[]>([]);

    const getSurahDetail = async () => {
        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
            const data = await res.json();
            setSurah(data.data);
        } catch (err) {
            console.error("Gagal ambil detail surah:", err);
        }
    };

    const getTranslation = async () => {
        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/id.indonesian`);
            const data = await res.json();
            setTranslation(data.data.ayahs);
        } catch (err) {
            console.error("Gagal ambil terjemahan:", err);
        }
    };

    useEffect(() => {
        getSurahDetail();
        getTranslation();
    }, [id]);

    if (!surah) {
        return <p className="p-4">Loading Dulu Gois...</p>;
    }
    return (
        <div className="bg-white">
            <NavbarHeader bgClass="bg-sage-100" />

            <div className="pt-30 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-10 space-y-7">
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
                        {surah.ayahs.map((ayah, index) => {
                            const isFirstAyah = ayah.numberInSurah === 1;
                            const isAlFatihah = surah.number === 1;
                            const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ";

                            const arabText = !isAlFatihah && isFirstAyah && ayah.text.includes(bismillah)
                                ? ayah.text.replace(bismillah, "").trimStart()
                                : ayah.text;

                            const translatedText = translation[index]?.text ?? "";

                            return (
                                <li key={ayah.number} className="border-b pb-2 space-y-1">
                                    <p className="font-arabic text-right text-2xl">{arabText}</p>
                                    <p className="text-sm text-gray-500 italic">{translatedText}</p>
                                    <p className="text-xs text-gray-400">Ayat {ayah.numberInSurah}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}