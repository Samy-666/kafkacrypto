export interface CryptoToAdd {
    id: number,
    name: string,
}

export interface Favorite {
    crypto_list: CryptoToAdd[],
    id:number,
    user_id: number
}


