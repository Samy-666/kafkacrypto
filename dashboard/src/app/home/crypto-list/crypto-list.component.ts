import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CryptoListService } from './crypto-list.service';
import { CryptoInfoModel } from '../../models/crypto.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  public dataSource: MatTableDataSource<CryptoInfoModel> =
    new MatTableDataSource<CryptoInfoModel>([]);
  public displayedColumns: string[] = [
    'id',
    'crypto',
    'price',
    'market_cap',
    'plus',
  ];
  public isLoading = true;
  public datas: CryptoInfoModel[] = [];

  constructor(
    private cryptoListService: CryptoListService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  public voirPlus(id: number, crypto: string) {
    const queryParams: any = { id: id, crypto: crypto};
    this.router.navigate(['/dashboard'], { queryParams });
  }

  ngAfterViewInit() {
    this.cryptoListService.getListingCrypto().subscribe(
      (response: any) => {
        this.datas = response.slice(0, 100);
        this.dataSource = new MatTableDataSource<CryptoInfoModel>(this.datas);

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

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
