import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CryptoListService } from './crypto-list.service';
import { CryptoList } from '../../models/crypto.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CryptoToAdd, Favorite } from 'src/app/models/favorite.model';
import { QueryCrypto } from 'src/app/models/query.model';
import { FavoriteService } from '../favoris-list/favoris-list.service';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  public favotiteCrypto: string[] = [];
  public dataSource: MatTableDataSource<CryptoList> =
    new MatTableDataSource<CryptoList>([]);
  public displayedColumns: string[] = [
    'crypto',
    'price',
    'market_cap',
    'status',
    'evolution',
    'plus',
  ];
  public isLoading = true;
  public datas: CryptoList[] = [];

  constructor(
    private cryptoListService: CryptoListService,
    public dialog: MatDialog,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  public voirPlus(id: number, crypto: string) {
    const queryParams: QueryCrypto = { id: id, crypto: crypto };
    this.router.navigate(['/dashboard'], { queryParams });
  }
  public addToOrDeleteFromFavorite(favorite: any) {
    if (favorite.favorite) {
      this.deleteFromFavorite(favorite.id, favorite.crypto);
    } else {
      this.addToFavorite(favorite.id, favorite.crypto);
    }
    favorite.favorite = !favorite.favorite;
  }

  public deleteFromFavorite(id: number, crypto: string) {
    const params: CryptoToAdd = { id: id, name: crypto };
    this.favoriteService
      .deleteFromFavoris(params)
      .subscribe((data: CryptoToAdd) => {
      });
  }

  public addToFavorite(id: number, crypto: string) {
    const params: CryptoToAdd = { id: id, name: crypto };
    this.favoriteService.addToFavoris(params).subscribe((data: CryptoToAdd) => {
    });
  }

  public getCryptoList() {
    this.cryptoListService.getListingCrypto().subscribe(
      (response: CryptoList[]) => {
        this.datas = response.slice(0, 100);
        this.datas.forEach((crypto: CryptoList) => {
          crypto.favorite = false;
        });
        this.setFavoriteCrypto();
        this.dataSource = new MatTableDataSource<CryptoList>(this.datas);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngAfterViewInit() {
    this.getCryptoList();
  }

  public setFavoriteCrypto() {
    this.favoriteService.getFavoris().subscribe((data: Favorite) => {
      data.crypto_list.forEach((crypto: CryptoToAdd) => {
        this.favotiteCrypto.push(crypto.name);
      });
      this.datas.forEach((crypto: any) => {
        if (this.favotiteCrypto.includes(crypto['crypto'])) {
          crypto.favorite = true;
        }
      });
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
