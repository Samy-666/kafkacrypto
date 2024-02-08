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
    name: string
}

export interface CryptoList {
    id: number;
    name: string;
}
export interface Values {
    time: string;
    value: number
}
export interface ResponseValue{
    data: Values[]
    evolution: number
}
export interface ResponseMarketCap{
    data: MarketCap[]
    evolution: number
}
export interface MarketCap {
    time: string;
    market_cap: number
}