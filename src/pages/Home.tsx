'use client'

import { useEffect, useState } from 'react'
import moment from 'moment';
// import { Dialog, DialogPanel } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import NavbarHeader from "../components/NavbarHeader"
import Footer from "../components/Footer"

import { Ayat, JadwalSalat, AdminLevel } from '../types/home';
import { convertHijriToArabicMonth, toArabicNumber, tampilkanJadwalSalat } from '../utils/home';

import mosqueImage from "../assets/images/mosque.jpg"
import mapIcon from "../assets/icons/ic-maps.svg"
import calenderIcon from "../assets/icons/ic-calender.svg"
import imsakIcon from "../assets/icons/ic-imsak.svg"
import subuhIcon from "../assets/icons/ic-subuh.svg"
import tarbitIcon from "../assets/icons/ic-tarbit.svg"
import dzuhurIcon from "../assets/icons/ic-dzuhur.svg"
import asharIcon from "../assets/icons/ic-ashar.svg"
import maghribIcon from "../assets/icons/ic-maghrib.svg"
import isyaIcon from "../assets/icons/ic-isya.svg"
import alquranIcon from "../assets/icons/ic-alquran.svg"
import pagiIcon from "../assets/icons/ic-pagi.svg"
import petangIcon from "../assets/icons/ic-petang.svg"

const data = [
    {
        id: 1,
        name: "Al-Qura'an Terjemah",
        href: '#',
        imageSrc: alquranIcon,
    },
    {
        id: 2,
        name: 'Al-Matsurat Pagi',
        href: '#',
        imageSrc: pagiIcon,
    },
    {
        id: 3,
        name: 'Al-Matsurat Petang',
        href: '#',
        imageSrc: petangIcon,
    },
]

export default function Home() {
    const [surahName, setSurahName] = useState('');
    const [ayatArab, setAyatArab] = useState('');
    const [ayatIndo, setAyatIndo] = useState('');
    const [lokasi, setLokasi] = useState<string>('Memuat...');
    const [tanggalMasehi, setTanggalMasehi] = useState<string>('Memuat...');
    const [tanggalHijriah, setTanggalHijriah] = useState<string>('Memuat...');
    const [waktuMenujuSalat, setWaktuMenujuSalat] = useState<string>('Memuat...');
    // const [waktuSalat, setWaktuSalat] = useState<string>('Memuat...');

    const tampilkanAyatRandom = async () => {
        try {
            const randomSurah = Math.floor(Math.random() * (114 - 46 + 1)) + 46;

            const resArab = await fetch(`https://api.alquran.cloud/v1/surah/${randomSurah}/ar.alafasy`);
            const dataArab = await resArab.json();

            const ayahsArab: Ayat[] = dataArab.data.ayahs;
            const randomAyatIndex = Math.floor(Math.random() * ayahsArab.length);
            const randomAyatArab = ayahsArab[randomAyatIndex];

            const resIndo = await fetch(`https://api.alquran.cloud/v1/surah/${randomSurah}/id.indonesian`);
            const dataIndo = await resIndo.json();
            const ayahsIndo: Ayat[] = dataIndo.data.ayahs;
            const randomAyatIndo = ayahsIndo[randomAyatIndex];

            setSurahName(`${dataArab.data.englishName} : ${randomAyatArab.numberInSurah}`);
            setAyatArab(randomAyatArab.text);
            setAyatIndo(randomAyatIndo.text.charAt(0).toUpperCase() + randomAyatIndo.text.slice(1));
        } catch (error) {
            console.error('Gagal fetch ayat:', error);
        }
    };

    // Menampilkan tanggal masehi dan hijriah
    const tampilkanTanggal = async (lat: number, lon: number) => {
        const masehi = moment().format('dddd, D MMMM YYYY');

        // Mengambil data Hijriah dari API
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=20`);
            const data = await response.json();
            if (data.status === 'OK') {
                const hijriDate = data.data.date.hijri.date.split('-');
                const hijriDay = hijriDate[0];
                const hijriMonth = convertHijriToArabicMonth(parseInt(hijriDate[1]));
                const hijriYear = hijriDate[2];

                setTanggalMasehi(masehi);
                setTanggalHijriah(`${toArabicNumber(hijriDay)} ${hijriMonth} ${toArabicNumber(hijriYear)}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Menampilkan waktu menuju salat berikutnya
    const tampilkanMenujuWaktuBerikutnya = (timings: JadwalSalat) => {
        const now = moment();
        const urutanSalat: (keyof JadwalSalat)[] = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const namaSalat = {
            Imsak: 'Imsak',
            Fajr: 'Subuh',
            Sunrise: 'Terbit',
            Dhuhr: 'Dzuhur',
            Asr: 'Ashar',
            Maghrib: 'Maghrib',
            Isha: 'Isya'
        };

        for (let i = 0; i < urutanSalat.length; i++) {
            const waktuSalat = moment(timings[urutanSalat[i]], 'HH:mm');
            if (now.isBefore(waktuSalat)) {
                const durasi = moment.duration(waktuSalat.diff(now));
                const jam = Math.floor(durasi.asHours());
                const menit = durasi.minutes();
                const nama = namaSalat[urutanSalat[i] as keyof typeof namaSalat];
                // const nama = namaSalat[urutanSalat[i]];

                let teks = '';
                if (jam === 0 && menit === 0) {
                    teks = `Waktu ${nama} tiba`;
                } else if (jam === 0) {
                    teks = `Menuju Waktu ${nama} ± ${menit} menit`;
                } else {
                    teks = `Menuju Waktu ${nama} ± ${jam} jam ${menit} menit`;
                }

                setWaktuMenujuSalat(teks);
                break;
            }
        }
    };

    // Mendapatkan nama lokasi dari latitude dan longitude
    const getLocationName = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
            );
            const data = await response.json();
            // console.log("lat:"+lat);
            // console.log("lon:"+lon);


            const adminLevels: AdminLevel[] = data.localityInfo.administrative;
            let negara = '',
                provinsi = '',
                kabupaten = '',
                kecamatan = '';

            adminLevels.forEach((level) => {
                switch (level.adminLevel) {
                    case 2:
                        negara = level.name;
                        break;
                    case 4:
                        provinsi = level.name;
                        break;
                    case 5:
                        kabupaten = level.name;
                        break;
                    case 6:
                        kecamatan = level.name;
                        break;
                }
            });

            const lokasi = `${kecamatan}, ${kabupaten}, <br>${provinsi}, ${negara}`;
            setLokasi(lokasi);
        } catch {
            setLokasi('Lokasi tidak ditemukan');
        }
    };

    // Mendapatkan jadwal salat
    const dapatkanJadwalSalat = async (lat: number, lon: number) => {
        const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=20`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const timings = data.data.timings;
            tampilkanTanggal(lat, lon);
            tampilkanJadwalSalat(timings);
            tampilkanMenujuWaktuBerikutnya(timings);
        } catch (error) {
            console.error('Error fetching salat schedule:', error);
        }
    };

    useEffect(() => {
        tampilkanAyatRandom();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    getLocationName(lat, lon);
                    dapatkanJadwalSalat(lat, lon);
                },
                () => {
                    setLokasi('Gagal mendapatkan lokasi.');
                }
            );
        } else {
            setLokasi('Geolocation tidak didukung.');
        }
    }, []);


    return (
        <div className="bg-white">
            <NavbarHeader />

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-6xl py-32 sm:py-40 lg:py-50">
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold font-arabic tracking-tight text-balance text-gray-900 sm:text-5xl">
                            {ayatArab}
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            {ayatIndo}
                        </p>
                        <p className="mt-3 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8" >
                            ({surahName})
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#jadwalSholat"
                                className="rounded-md bg-sage-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sage-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
                            >
                                Get started
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-10 " id="jadwalSholat">
                <h1 className="text-3xl mb-15 font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl text-center sm:mb-20">
                    Jadwal Sholat
                </h1>
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row space-x-4">
                    {/* Kolom Kiri */}
                    <div className="w-full sm:w-3/5 space-y-4">
                        <div
                            style={{
                                backgroundImage: `url(${mosqueImage})`,
                            }}
                            className="h-[calc(100%/7*5)] bg-bottom bg-cover rounded-lg">
                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-4 items-center">
                            <img src={mapIcon}
                                className="h-9"
                                alt="ic-maps" />
                            <div className="flex flex-col sm:flex-row w-full justify-between items-start">
                                <p className="text-lg w-full sm:text-xl/5 sm:w-1/2" dangerouslySetInnerHTML={{ __html: lokasi }}></p>
                                <p className="text-lg w-full text-start sm:text-xl/5 sm:w-1/2 sm:text-end">{waktuMenujuSalat}</p>
                            </div>
                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-4 items-center">
                            <img src={calenderIcon}
                                className="h-9"
                                alt="ic-calender"
                            />
                            <div className="flex flex-col sm:flex-row w-full justify-between items-center">
                                <p className="text-lg w-full sm:text-xl/6 sm:w-1/2">{tanggalMasehi}</p>
                                <p className="text-lg text-start w-full sm:text-xl/6 sm:w-1/2 sm:text-end font-arabic" >{tanggalHijriah}</p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="w-full sm:w-2/5 space-y-4" id="waktu-sholat-list">
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-4 items-center">
                            <img src={imsakIcon}
                                className="h-10"
                                alt="ic-imsak"
                            />
                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={subuhIcon}
                                className="h-10"
                                alt="ic-subuh"
                            />
                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={tarbitIcon}
                                className="h-10"
                                alt="ic-tarbit"
                            />

                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={dzuhurIcon}
                                className="h-10"
                                alt="ic-dzuhur"
                            />

                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={asharIcon}
                                className="h-10"
                                alt="ic-ashar"
                            />

                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={maghribIcon}
                                className="h-10"
                                alt="ic-maghrib"
                            />

                        </div>
                        <div className="bg-sage-50 p-4 rounded-lg flex gap-6 items-center">
                            <img
                                src={isyaIcon}
                                className="h-9"
                                alt="ic-isya"
                            />

                        </div>
                    </div>
                </div>
            </div>


            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0  z-[-10] -top-20  transform-gpu overflow-hidden blur-3xl sm:-top-50"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-6xl py-20 sm:py-30 lg:py-30">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:mb-20 ">
                        <h1 className="text-3xl mb-15 font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl text-center sm:mb-20">
                            Dzikir & Tilawah Harian
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-20">
                            {data.map((data) => (
                                <a href={data.href}
                                    key={data.id}
                                    className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm hover:shadow-md hover:bg-sage-200 transition "
                                >
                                    <img
                                        src={data.imageSrc}
                                        alt={data.name}
                                        className="mx-auto h-30 w-30 sm:h-50 sm:w-50 object-contain mb-4"
                                    />
                                    <p className="mt-8 text-lg font-medium text-pretty text-gray-900 sm:text-xl/8">
                                        {data.name}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] z-[-10] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}