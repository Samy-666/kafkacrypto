export interface CryptoInfoModel {
    id: string,
    name: string,
    symbol: string
}
export interface PeriodModel {
    id: number,
    value: string,
    viewValue: string
}
export interface FormatLabel {
    id: number,
    type: string
}

export interface CryptoList {
    id: number;
    name: string;
}