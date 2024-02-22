import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenService } from "src/app/authentification/service/token-storage.service";
import {
    GET_RSS_BY_CRYPTO,
    GET_RSS,
  } from 'src/app/config/app.config';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class RssService {
    constructor(private http: HttpClient, private tokenService: TokenService) {}

    public getRss() {
        const token = this.tokenService.getToken();
        const headers = this.createHeaders(token);
        return this.http.get(environment.apiUrl + GET_RSS, {
            headers,
            responseType: 'text' // Définir le type de réponse comme 'text'
        });
    }

    private createHeaders(token: string | null): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    public extractRssData(xmlString: string): any[] {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const items = Array.from(xmlDoc.querySelectorAll('item'));
        return items.map(item => {
            const title = item.querySelector('title')?.textContent ?? '';
            const link = item.querySelector('link')?.textContent ?? '';
            const description = item.querySelector('description')?.textContent ?? '';
            const pubDate = item.querySelector('pubDate')?.textContent ?? '';
            const guid = item.querySelector('guid')?.textContent ?? '';
            return { title, link, description, pubDate, guid };
        });
    }
}
