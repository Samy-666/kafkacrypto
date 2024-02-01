import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRYPTO_INFO, CRYPTO_LIST_ROUTE } from 'src/app/config/app.config';
import { environment } from 'src/environments/environment';
import { CryptoInfoModel } from 'src/app/models/crypto.model';


@Injectable({
    providedIn: 'root',
})
export class CryptoListService {
    constructor(private http: HttpClient) { }


    public getCryptoList() {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token
        };
        return this.http.get<CryptoInfoModel[]>(`${environment.apiUrl}` + CRYPTO_LIST_ROUTE, { headers: HttpHeaders });
    }

    public getCryptoInfo(id: string) {
        const token = JSON.parse(localStorage.getItem('token')!);
        const HttpHeaders = {
            'Authorization': 'Bearer ' + token
        };
        return this.http.get<CryptoInfoModel>(`${environment.apiUrl}` + CRYPTO_INFO + '/' + id, { headers: HttpHeaders });
    }

    public getTestData() {
        return this.http.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
    }

    public getDataFromJson() {
        const file = require('../../data/cryptoviz.json');
        return file;
    }
}