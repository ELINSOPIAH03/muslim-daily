import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import type { SurahDetail, Ayah } from "../../types/al-quran"
import { toArabicNumber } from "../../utils/utils"

import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

import { ArrowRightCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/solid'
import borderIslamic from "../../assets/images/borderSage.png"
import frameAyat from "../../assets/images/frame.png";

export default function SurahDetail() {
    const { id } = useParams(); // Ambil ID dari URL
    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [translation, setTranslation] = useState<Ayah[]>([]);

    const navigate = useNavigate();
    const currentSurahNumber = Number(id);

    const handlePrev = () => {
        if (currentSurahNumber > 1) {
            navigate(`/surah/${currentSurahNumber - 1}`);
        }
    };

    const handleNext = () => {
        if (currentSurahNumber < 114) {
            navigate(`/surah/${currentSurahNumber + 1}`);
        }
    };

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
        // window.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo(0, 0);
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

                <div className="w-full flex justify-between items-center gap-4 mt-3 mb-3">
                    <p className="text-sm text-gray-500 w-full text-start">
                        {surah.revelationType === "Meccan" ? "Mekah" : "Madinah"}
                    </p>
                    {surah.number !== 1 && surah.number !== 9 && (
                        <div className="font-arabic text-center text-xl w-full bg-contain bg-no-repeat bg-center flex items-center justify-center p-3"
                            style={{
                                backgroundImage: `url(${borderIslamic})`,
                            }}>
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </div>
                    )}
                    <p className="text-sm text-gray-500 font-arabic w-full text-end">
                        {surah.numberOfAyahs} Ayat - {surah.name.replace(/^سُورَةُ /, '')}
                    </p>
                </div>

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

                <div className="flex justify-center items-center gap-7 mt-6">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentSurahNumber === 1}
                        className={currentSurahNumber === 1 ? 'opacity-40 cursor-not-allowed' : ''}
                    >
                        <ArrowLeftCircleIcon aria-hidden="true" className="size-6 text-sage-700" />
                    </button>

                    <p className="text-lg sm:text-xl text-gray-900 font-arabic">
                        {surah.name.replace(/^سُورَةُ /, '')}
                    </p>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentSurahNumber === 114}
                        className={currentSurahNumber === 114 ? 'opacity-40 cursor-not-allowed' : ''}
                    >
                        <ArrowRightCircleIcon aria-hidden="true" className="size-6 text-sage-700" />
                    </button>
                </div>

            </div>
            <Footer />
        </div>
    );
}