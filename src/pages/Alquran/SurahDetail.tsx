import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { SurahDetail, Ayah } from "../../types/al-quran"
import { toArabicNumber } from "../../utils/utils"

import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

import borderIslamic from "../../assets/images/border-islamic.png"
import frameAyat from "../../assets/images/frame.png";

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

            <div className="pt-30 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-10 space-y-7 overflow-x-hidden">
                <div className="mt-3 w-full bg-contain bg-no-repeat bg-center scale-x-150 h-[80px] "
                    style={{
                        backgroundImage: `url(${borderIslamic})`,
                    }}>

                </div>

                <div className="p-4 flex w-full justify-between">
                    <p className="mb-2">
                        {surah.revelationType === "Meccan" ? "Mekah" : "Madinah"}
                    </p>
                    <h1 className="text-xl font-bold mb-2">
                        {surah.name.replace(/^سُورَةُ /, '')}
                    </h1>
                    <p className="mb-4">{surah.numberOfAyahs} Ayat</p>
                </div>
                {surah.number !== 1 && surah.number !== 9 && (
                    <p className="font-arabic text-center text-xl mb-4">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                    </p>
                )}
                <div className="bg-sage-50 p-8 rounded-lg flex flex-col gap-4 w-full">
                    {surah.ayahs.map((ayah, index) => {
                        const isFirstAyah = ayah.numberInSurah === 1;
                        const isAlFatihah = surah.number === 1;
                        const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ";

                        const arabText = !isAlFatihah && isFirstAyah && ayah.text.includes(bismillah)
                            ? ayah.text.replace(bismillah, "").trimStart()
                            : ayah.text;

                        const translatedText = translation[index]?.text ?? "";


                        return (
                            <div key={ayah.number} className="border-b border-sage-600 space-y-1 last:border-b-0">
                                <p className="font-arabic text-right text-2xl justify-end flex gap-2 relative">
                                    <span className="inline-flex items-center justify-center bg-cover bg-center min-w-[50px] h-[50px] text-lg font-arabic"
                                        style={{ backgroundImage: `url(${frameAyat})` }}>
                                        {toArabicNumber(ayah.numberInSurah.toString())}
                                    </span>
                                    <span className="whitespace-pre-wrap">
                                        {arabText}
                                    </span>
                                </p>
                                <p className="text-sm italic text-gray-600 italictext-sm sm:text-base mb-2">{ayah.numberInSurah}. {translatedText}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}