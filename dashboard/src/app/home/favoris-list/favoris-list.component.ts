import { Component } from '@angular/core';
import { FavoriteService } from './favoris-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { CryptoInfoModel } from 'src/app/models/crypto.model';
import { Favorite, FavoriteCrypto } from 'src/app/models/favorite.model';

@Component({
  selector: 'app-favoris-list',
  templateUrl: './favoris-list.component.html',
  styleUrls: ['./favoris-list.component.scss'],
})
export class FavorisListComponent {
  public isLoading = true;
  public favoriteList = [];
  public displayedColumns: string[] = ['name', 'plus',];
  public datas: CryptoInfoModel[] = [];
  public dataSource: MatTableDataSource<FavoriteCrypto> =
  new MatTableDataSource<FavoriteCrypto>([]);
  constructor(private favoriteService: FavoriteService) {
    this.favoriteService.getFavoris().subscribe((data: Favorite) => {
      this.dataSource = new MatTableDataSource<FavoriteCrypto>(data.crypto_list);
      this.isLoading = false;
    });
  }

  public delete(element: any){
    const param = {
      crypto_list :[element]
    }
    this.favoriteService.deleteFromFavoris(param).subscribe((data: any) => {
      this.favoriteService.getFavoris().subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<FavoriteCrypto>(data.crypto_list);
        this.isLoading = false;
      });
    });

  }
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
