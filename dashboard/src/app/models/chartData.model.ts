export interface ChartMarketValue {
    id: number
    name: string;
    values : Values[];
}

export interface Values {
    time: string
    price: number;
    market_cap: number;
}