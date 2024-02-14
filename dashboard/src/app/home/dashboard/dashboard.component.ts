import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  CryptoList,
  FormatLabel,
  PeriodModel,
} from 'src/app/models/crypto.model';
import { CryptoListService } from '../crypto-list/crypto-list.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public cryptoId: string = '';
  public selectedPeriod = '';
  public selectedCryptoName = '';
  public selectedCryptoCompareToName = '';
  public selectedCrypto = 0;
  public selectedCryptoCompareTo = 0;
  public ready = false;
  public Periodes: PeriodModel[] = [
    { id: 0, value: '20s', viewValue: '20 secondes' },
    { id: 1, value: '40s', viewValue: '40 secondes' },
    { id: 2, value: '1m', viewValue: '1 minute' },
    { id: 3, value: '5m', viewValue: '5 minutes' },
    { id: 4, value: '10m', viewValue: '10 minutes' },
    { id: 5, value: '30m', viewValue: '30 minutes' },
  ];
  public FormatChart: FormatLabel[] = [
    { id: 0, type: 'line', name: 'Ligne' },
    { id: 1, type: 'bar', name: 'Barre' },
    { id: 2, type: 'pie', name: 'Camembert' },
  ];
  public selectedFormat = this.FormatChart[0].type;

  public CryptoList: CryptoList[] = [];
  public CryptoListCompareTo: CryptoList[] = [];
  public displayCompareTo = false;

  constructor(
    private router: Router,
    private cryptoListService: CryptoListService
  ) {}

  onPeriodChange(event: any) {
    this.selectedPeriod = event.value;
  }
  onFormatChange(event: any): void {
    // Gérer le changement de sélection si nécessaire
    this.selectedFormat = event.value;
    if (this.selectedFormat !== 'line') {
      this.clearFields();
    }
  }
  onCryptoChange(event: any) {
    if (this.selectedFormat === 'line') {
      this.CryptoListCompareTo = this.CryptoList.filter(
        (crypto) => crypto.id !== event.value
      );
      this.displayCompareTo = true;
    }
    this.selectedCrypto = event.value;
    this.selectedCryptoName = this.CryptoList.filter(
      (crypto) => crypto.id === event.value
    )[0].name;
  }
  clearFields() {
    this.selectedCryptoCompareTo = 0;
    this.selectedCryptoCompareToName = '';
    this.displayCompareTo = false;
  }

  onCryptoCompareToChange(event: any) {
    this.selectedCryptoCompareTo = event.value;
    this.selectedCryptoCompareToName = this.CryptoList.filter(
      (crypto) => crypto.id === event.value
    )[0].name;
  }

  private getChartData(): void {
    this.cryptoListService.getCryptoList().subscribe(
      (response: CryptoList[]) => {
        this.CryptoList = response;
        this.selectedCrypto =
          this.CryptoList.length > 0 ? this.CryptoList[0].id : 0;
        this.selectedCryptoName =
          this.CryptoList.length > 0 ? this.CryptoList[0].name : '';
        this.ready = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    if (queryParams['id'] && queryParams['id'].length > 0) {
      this.cryptoId = queryParams['id'];
    }
    this.getChartData();
    this.selectedPeriod = this.Periodes[0]?.value;
    this.selectedFormat = this.FormatChart[0]?.type;
    this.selectedCrypto = this.CryptoList[0]?.id;
  }
}
