export interface Ayat {
    numberInSurah: number;
    text: string;
}

export interface JadwalSalat {
    imsak: string;
    subuh: string;
    terbit: string;
    dzuhur: string;
    ashar: string;
    magrib: string;
    isya: string;
    [key: string]: string;
}

export interface AdminLevel {
    name: string;
    description: string;
    isoName: string;
    order: number;
    adminLevel: number;
    isoCode: string;
    wikidataId: string;
    geonameId: number;
}