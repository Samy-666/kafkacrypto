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

          const cryptoCounts: any = {};
          this.rssData.forEach((item) => {
            this.favotiteCrypto.forEach((crypto) => {
              const regex = new RegExp(crypto, 'gi');
              const matches = (item.description.match(regex) || []).length;
              cryptoCounts[crypto] = (cryptoCounts[crypto] || 0) + matches;
            });
          });
          if (this.favotiteCrypto.length === 1) {
            this.rssData.sort((a, b) => {
              const countA = this.getCountForCrypto(
                a.description,
                cryptoCounts
              );
              const countB = this.getCountForCrypto(
                b.description,
                cryptoCounts
              );
              return countB - countA;
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

  // Fonction utilitaire pour obtenir le nombre de mentions d'une crypto dans un titre
  getCountForCrypto(title: string, cryptoCounts: any): number {
    let count = 0;
    Object.keys(cryptoCounts).forEach((crypto) => {
      const regex = new RegExp(crypto, 'gi');
      count += (title.match(regex) || []).length * cryptoCounts[crypto];
    });
    return count;
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
