import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { CryptoListService } from "./crypto-list.service";
import { CryptoInfoModel } from "../../models/crypto.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { CryptoInfoModal } from "./crypto-info-modal/crypto-info-modal";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-crypto-list",
  templateUrl: "./crypto-list.component.html",
  styleUrls: ["./crypto-list.component.scss"]
})
export class CryptoListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  public dataSource: MatTableDataSource<CryptoInfoModel> = new MatTableDataSource<CryptoInfoModel>([]);
  public displayedColumns: string[] = ["id", "name", "symbol"];
  public isLoading = true;
  public datas: CryptoInfoModel[] = [];

  constructor(private cryptoListService: CryptoListService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.cryptoListService.getCryptoList().subscribe(
      (response: any) => {
        this.datas = response[0];
        console.log(111, this.datas);
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

  getCryptoInfo(id: string) {
    this.cryptoListService.getCryptoInfo(id).subscribe(
      (response: any) => {
        let dialogRef = this.dialog.open(CryptoInfoModal, {
            height: '400px',
            width: '600px',
            data: response
          });

      },
      (error) => {
        let dialogRef = this.dialog.open(CryptoInfoModal, {
            height: '400px',
            width: '600px',
            data: {error: 1}
          });
      }
    );
  }
}
