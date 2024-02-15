import { Component } from '@angular/core';
import { FavoriteService } from './favoris-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { CryptoList } from 'src/app/models/crypto.model';
import { CryptoToAdd, Favorite } from 'src/app/models/favorite.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoris-list',
  templateUrl: './favoris-list.component.html',
  styleUrls: ['./favoris-list.component.scss'],
})
export class FavorisListComponent {
  public isLoading = true;
  public isEmptyFavorite = true;
  public favoriteList = [];
  public displayedColumns: string[] = ['name', 'plus'];
  public datas: CryptoList[] = [];
  public dataSource: MatTableDataSource<CryptoToAdd> =
    new MatTableDataSource<CryptoToAdd>([]);
  constructor(private router: Router, private favoriteService: FavoriteService) {
    this.getFavoris();
  }

  public getFavoris() {
    this.favoriteService.getFavoris().subscribe((data: Favorite) => {
      this.dataSource = new MatTableDataSource<CryptoToAdd>(data.crypto_list);
      if (data && data.crypto_list.length > 0) {
        this.isEmptyFavorite = false;
      }
      else{
        this.isEmptyFavorite = true;
      }
      
      this.isLoading = false;
    });
  }

  public delete(id: number, crypto: string) {
    const params: CryptoToAdd = { id: id, name: crypto };
    this.favoriteService
      .deleteFromFavoris(params)
      .subscribe((data: CryptoToAdd) => {
        this.getFavoris();
      });
  }
  public goToCryptoList() {
    this.router.navigate(['/crypto-list']);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
