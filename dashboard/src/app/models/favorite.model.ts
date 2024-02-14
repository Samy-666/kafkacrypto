export interface FavoriteCrypto {
    id: string,
    name: string,
}

export interface Favorite {
    crypto_list: FavoriteCrypto[],
    id:number,
    user_id: number
}

export interface AddedOfRemovedFav {
    crypto_list: FavoriteCrypto[],
}

