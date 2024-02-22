import { Component, OnInit } from '@angular/core';
import { RssService } from './rss.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss'],
})

export class RssComponent implements OnInit {
  public rssData: any[] = [];
  public xmlData: any;
  constructor(private rssService: RssService) {}
  ngOnInit(): void {
    this.getRssData();
    
  }

  getRssData() {
    this.rssService.getRss().subscribe(
      (response: string) => {
        console.log(response);
        if (response) {
          this.rssData = this.rssService.extractRssData(response);
          console.log(this.rssData);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du flux RSS : ', error);
      }
    );
  }
  
}
