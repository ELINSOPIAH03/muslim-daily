import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

import searchIcon from "../../assets/icons/ic-seacrh.svg"
import frameAyat from "../../assets/images/frame.png";

import { Surah } from "../../types/al-quran"
import { toArabicNumber } from "../../utils/utils"

// import { ChevronDownIcon } from '@heroicons/react/16/solid'



export default function Index() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = surahs.filter((surah) =>
            surah.englishName.toLowerCase().includes(term)
        );
        setFilteredSurahs(filtered);
    };


    // Mengambil data by surah
    const getSurahs = async () => {
        try {
            const res = await fetch("https://api.alquran.cloud/v1/surah");
            const data = await res.json();
            setSurahs(data.data); // data.data a/ array surah
            setFilteredSurahs(data.data);
        } catch (error) {
            console.error("Gagal ambil data surah:", error);
        }
    };

    // Manggil saat mount
    useEffect(() => {
        getSurahs();
    }, []);

    return (
        <div className="bg-white">
            <NavbarHeader bgClass="bg-sage-100" />

            <div className="pt-30 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-10 space-y-7">
                <div className="flex items-center gap-4 w-full mt-7 sm:mt-10">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <input
                            className="w-full min-h-[44px] sm:min-h-[50px] py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            type="search"
                            placeholder="Search Nama Surat"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <img src={searchIcon} className="h-5 w-5" alt="Search" />
                        </button>
                    </div>

                    {/* Filter Select */}
                    {/* <div className="relative w-1/5">
                        <select
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            className="w-full min-h-[44px] sm:min-h-[50px] appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900  outline-1 outline-sage-300 focus:outline-2 focus:outline-sage-500 sm:text-sm"
                        >
                            <option>Surat</option>
                            <option>Juz</option>
                        </select>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500"
                        />
                    </div> */}
                </div>

                <div className="w-full space-y-4">
                    {filteredSurahs.map((surah) => (
                        <Link
                            to={`/surah/${surah.number}`}
                            key={surah.number}
                            className="bg-sage-50 p-4 rounded-lg flex gap-4 items-center w-full justify-between hover:bg-sage-300">
                            <div className="flex items-center gap-4">
                                <div style={{
                                    backgroundImage: `url(${frameAyat})`,
                                }}
                                    className="font-arabic p-2  items-center flex justify-center text-lg bg-cover bg-center min-w-[50px] max-w-auto sm:p-3 sm:min-w-[60px] sm:text-2xl">
                                    {/* {surah.number} */}
                                    {toArabicNumber(surah.number.toString())}
                                </div>
                                <p className="text-sm sm:text-lg text-gray-600">{surah.englishName} <br />
                                    {surah.revelationType === "Meccan" ? "Mekah" : "Madinah"} | {surah.numberOfAyahs} Ayat
                                </p>
                            </div>
                            <p className="text-xl text-nowrap sm:text-3xl">
                                {surah.name.replace(/^سُورَةُ /, '')}
                            </p>
                        </Link>
                    ))}
                </div>

            </div>
            <Footer />
        </div>
    );
}