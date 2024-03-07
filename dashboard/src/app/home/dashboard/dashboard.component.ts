import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public selectedPeriod = '';
  public selectedTime = '';
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
  public Times: PeriodModel[] = [
    { id: 0, value: '2m', viewValue: '2 dernières minutes'},
    { id: 1, value: '5m', viewValue: '5 dernières minutes' },
    { id: 2, value: '30m', viewValue: '30 dernières minutes'},
    { id: 3, value: '45m', viewValue: 'Dernières 45 minutes'},
    { id: 4, value: '1h', viewValue: 'Dernière heure' },
    { id: 5, value: '2h', viewValue: 'Deux dernières heures' },
    { id: 6, value: '6h', viewValue: '6 dernières heures' },
    { id: 7, value: '1j', viewValue: 'Dernière journée'},
    { id: 8, value: '7j', viewValue: 'Dernière semaine'},
    { id: 9, value: '30j', viewValue: 'Dernier mois'},
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
    private cryptoListService: CryptoListService,
    private route: ActivatedRoute
  ) {}

  onPeriodChange(event: any) {
    this.selectedPeriod = event.value;
  }
  onTimeChange(event: any) {
    this.selectedTime = event.value;
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
        this.route.queryParams.subscribe((params) => {
          if (params['id']) {
            this.selectedCrypto = parseInt(params['id']);
            this.selectedCryptoName = params['crypto'];
            const event = { value: this.selectedCrypto };
            this.onCryptoChange(event);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getChartData();
    this.selectedPeriod = this.Periodes[0].value;
    this.selectedTime = this.Times[7].value;
    this.selectedFormat = this.FormatChart[0].type;
  }
}
