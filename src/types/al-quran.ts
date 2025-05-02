// Definisikan tipe Surah
export interface Surah {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
    numberOfAyahs: number;
}

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface SurahDetail {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: "Meccan" | "Medinan";
    numberOfAyahs: number;
    ayahs: Ayah[];
}
