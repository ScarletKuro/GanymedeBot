export interface ITimezonedbModel {
    status: string;
    message: string;
    countryCode: string;
    countryName: string;
    zoneName: string;
    abbreviation: string;
    gmtOffset: number;
    dst: string;
    dstStart: number;
    dstEnd: number;
    nextAbbreviation: string;
    timestamp: number;
    formatted: string;
}