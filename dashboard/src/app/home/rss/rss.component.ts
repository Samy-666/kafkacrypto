import { Component, OnInit } from '@angular/core';
import { RssService } from './rss.service';
import { FavoriteService } from '../favoris-list/favoris-list.service';
import { CryptoToAdd, Favorite } from 'src/app/models/favorite.model';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss'],
})
export class RssComponent implements OnInit {
  public rssData: any[] = [];
  public xmlData: any;
  public favotiteCrypto: string[] = [];
  public isLoaded = false;
  constructor(
    private rssService: RssService,
    private favoriteService: FavoriteService
  ) {}
  ngOnInit(): void {
    this.getRssData();
    setInterval(() => {
      this.getRssData(); 
    }, 3600000);
  }

  getRssData() {
    this.getFavoris();
    this.rssService.getRss().subscribe(
      (response: string) => {
        if (response) {
          this.rssData = this.rssService.extractRssData(response);
          this.rssData.forEach((item) => {
            item.description = this.stripHtmlTags(item.description);
            item.description = item.description.replace(
              /appeared first on CoinJournal/g,
              ''
            );
            const date = new Date(item.pubDate);
            item.pubDate = date.toLocaleString('fr-FR', { timeZone: 'UTC' });
          });
          if (this.favotiteCrypto.length > 0) {
            this.rssData = this.rssData.filter((item) => {
              return this.favotiteCrypto.some((crypto) => {
                return item.title.includes(crypto);
              });
            });
          }
          this.isLoaded = true;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du flux RSS : ', error);
      }
    );
  }

  public getFavoris() {
    this.favoriteService.getFavoris().subscribe((data: Favorite) => {
      data.crypto_list.forEach((crypto: CryptoToAdd) => {
        this.favotiteCrypto.push(crypto.name);
      });
    });
  }

  stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
}
