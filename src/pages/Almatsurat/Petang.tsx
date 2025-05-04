import { useEffect, useState, useRef } from 'react';

import { DzikirItem } from "../../types/al-matsurat"

import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default function Petang() {
    const [dzikirList, setDzikirList] = useState<DzikirItem[]>([]);
    const [counts, setCounts] = useState<number[]>([]);
    const dzikirRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        fetch('/json/dzikir-petang.json')
            .then((res) => res.json())
            .then((data: DzikirItem[]) => {
                const filtered = data.slice(1); // skip item pertama
                setDzikirList(filtered);
                setCounts(filtered.map(() => 0)); // semua awalnya 0
                dzikirRefs.current = filtered.map(() => null);
            })
            .catch((err) => console.error('Gagal fetch:', err));
    }, []);

    const handleCount = (index: number) => {
        setCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            if (newCounts[index] < dzikirList[index].read) {
                newCounts[index]++;
                if (newCounts[index] + 1 > dzikirList[index].read) {
                    // Scroll ke item berikutnya jika masih ada
                    const nextRef = dzikirRefs.current[index + 1];
                    if (nextRef) {
                        nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
            return newCounts;
        });
    };

    return (
        <div className="bgb-white">
            <NavbarHeader bgClass="bg-sage-100" />

            <div className="pt-30 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-10 space-y-7">
                <h1 className="text-3xl py-5 font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl text-center sm:py-10">
                    Dzikir Al-Ma'tsurat Pagi
                </h1>
                {dzikirList.map((item, index) => (
                    <div key={index}
                        ref={(el) => {
                            dzikirRefs.current[index] = el;
                        }}
                        className="bg-sage-50 p-4 rounded-lg flex flex-col gap-4">
                        <p className="text-sm text-gray-600 sm:text-base text-center "> {decodeHtml(item.title)}</p>
                        <p className="font-arabic text-right text-2xl justify-end flex relative">
                            {item.arab}
                        </p>
                        <p className="text-yellow-600 text-sm sm:text-base">{decodeHtml(item.latin)}</p>
                        <p className="text-sm italic text-gray-600 italic text-sm sm:text-base">
                            {decodeHtml(item.arti)}
                        </p>
                        <div className="flex w-full justify-center">
                            <button
                                type="button"
                                onClick={() => handleCount(index)}
                                className={`rounded-md ${counts[index] >= item.read ? 'bg-gray-400' : 'bg-sage-600 hover:bg-sage-500'
                                    } px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs`}
                            >
                                Count {counts[index]}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}