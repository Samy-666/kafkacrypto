import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js';
import {
  BarElement,
  registerables,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import { CryptoListService } from 'src/app/home/crypto-list/crypto-list.service';
import {
  MarketCap,
  ResponseMarketCap,
  ResponseValue,
  Values,
} from 'src/app/models/crypto.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges {
  @Input() public selectedPeriod = '';
  @Input() public selectedFormat = '';
  @Input() public selectedTime = '';
  @Input() public selectedCrypto = 0;
  @Input() public selectedCryptoName = '';
  @Input() public selectedCryptoCompareTo = 0;
  @Input() public selectedCryptoCompareToName = '';

  public chartDataValue: number[] = [];
  public chartDataMarketCap: number[] = [];
  public chartColorsValues: any[] = [];
  public chartColorsMarketCap: any[] = [];
  public chartLabelsValues: string[] = [];
  public chartLabelsMarketCap: string[] = [];

  public chartDataValueCompareTo: number[] = [];
  public chartDataMarketCapCompareTo: number[] = [];
  public chartColorsValuesCompareTo: any[] = [];
  public chartColorsMarketCapCompareTo: any[] = [];
  public chartLabelsValuesCompareTo: string[] = [];
  public chartLabelsMarketCapCompareTo: string[] = [];

  public filtredDataMc: MarketCap[] = [];
  public filtredDataValue: Values[] = [];
  public myChartValue: Chart | null = null;
  public myChartMarketCap: Chart | null = null;

  public valueEvolution: number = 0;
  public marketCapEvolution: number = 0;
  public valueEvolutionCompareTo: number = 0;
  public marketCapEvolutionCompareTo: number = 0;
  constructor(private cryptoListService: CryptoListService) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip
    );
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshData();
    setInterval(() => {
      this.refreshData();
    }, 300000);
  }

  private refreshData(): void {
    
    this.getChartDataValue(this.selectedCrypto, this.selectedPeriod);
    this.getChartDataMc(this.selectedCrypto, this.selectedPeriod);

    this.getChartDataValueCompareTo(
      this.selectedCryptoCompareTo,
      this.selectedPeriod
    );
    this.getChartDataMcCompareTo(
      this.selectedCryptoCompareTo,
      this.selectedPeriod
    );
    this.createChart();
  }

  private filterDataByTime(time: string) {
    const date = new Date();
    let timeInMillis: number;

    switch (time) {
      case '2m':
        timeInMillis = 120000;
        break;
      case '5m':
        timeInMillis = 300000;
        break;
      case '30m':
        timeInMillis = 1800000;
        break;
      case '45m':
        timeInMillis = 2700000;
        break;
      case '1h':
        timeInMillis = 3600000;
        break;
      case '2h':
        timeInMillis = 7200000;
        break;
      case '6h':
        timeInMillis = 21600000;
        break;
      case '1j':
        timeInMillis = 86400000;
        break;
      case '7j':
        timeInMillis = 604800000;
        break;
      case '30j':
        timeInMillis = 2592000000;
        break;
      default:
        timeInMillis = 0;
        break;
    }

    if (timeInMillis > 0) {
      const filteredTime = date.getTime() - timeInMillis;
      this.filtredDataValue = this.filtredDataValue.filter(
        (item) => new Date(item.time).getTime() > filteredTime
      );
      this.filtredDataMc = this.filtredDataMc.filter(
        (item) => new Date(item.time).getTime() > filteredTime
      );
    }
  }
  private generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
  }

  private getChartDataMc(id: number, periode: string) {
    this.cryptoListService
      .getDataMCByTime(id, periode)
      .subscribe((data: ResponseMarketCap[]) => {
        this.marketCapEvolution = data[0]['evolution'];
        this.filtredDataMc = data[0]['data'];
        this.formatData();
        this.createChart();
      });
  }
  private getChartDataValue(id: number, periode: string) {
    this.cryptoListService
      .getDataValueByTime(id, periode)
      .subscribe((data: ResponseValue[]) => {
        this.valueEvolution = data[0]['evolution'];
        this.filtredDataValue = data[0]['data'];
        this.formatData();
        this.createChart();
      });
  }

  private getChartDataValueCompareTo(id: number, periode: string) {
    this.cryptoListService
      .getDataValueByTime(id, periode)
      .subscribe((data: ResponseValue[]) => {
        this.chartDataValueCompareTo = data[0]['data'].map(
          (item: any) => item.value
        );
        this.chartLabelsValuesCompareTo = data[0]['data'].map((item: any) => {
          const date = new Date(item.time);
          return date.toLocaleTimeString();
        });
        this.chartColorsValuesCompareTo = this.chartDataValueCompareTo.map(
          (item: any) => this.generateRandomColor()
        );
        this.valueEvolutionCompareTo = data[0]['evolution'];
      });
  }

  private getChartDataMcCompareTo(id: number, periode: string) {
    this.cryptoListService
      .getDataMCByTime(id, periode)
      .subscribe((data: ResponseMarketCap[]) => {
        this.chartDataMarketCapCompareTo = data[0]['data'].map(
          (item: any) => item.market_cap
        );
        this.chartLabelsMarketCapCompareTo = data[0]['data'].map(
          (item: any) => {
            const date = new Date(item.time);
            return date.toLocaleTimeString();
          }
        );
        this.chartColorsMarketCapCompareTo =
          this.chartDataMarketCapCompareTo.map((item: any) =>
            this.generateRandomColor()
          );
        this.marketCapEvolutionCompareTo = data[0]['evolution'];
      });
  }

  public formatData(): void {
    this.chartDataValue = this.filtredDataValue.map((item: any) => item.value);

    this.chartDataMarketCap = this.filtredDataMc.map(
      (item: any) => item.market_cap
    );
    this.chartLabelsValues = this.filtredDataValue.map((item: any) => {
      const date = new Date(item.time);
      return date.toLocaleTimeString();
    });
    this.chartLabelsMarketCap = this.filtredDataMc.map((item: any) => {
      const date = new Date(item.time);
      return date.toLocaleTimeString();
    });
    this.chartColorsValues = this.chartDataValue.map((item: any) =>
      this.generateRandomColor()
    );
    this.chartColorsMarketCap = this.chartDataMarketCap.map((item: any) =>
      this.generateRandomColor()
    );
    this.filterDataByTime(this.selectedTime);
  }

  createChart(): void {
    const ctxValue = document.getElementById(
      'myChartValue'
    ) as HTMLCanvasElement;
    const ctxMarketCap = document.getElementById(
      'myChartMarketCap'
    ) as HTMLCanvasElement;

    if (this.myChartValue) {
      this.myChartValue.destroy();
    }
    if (this.myChartMarketCap) {
      this.myChartMarketCap.destroy();
    }
    // Chart for Values
    this.myChartValue = new Chart(ctxValue, {
      type: this.selectedFormat as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabelsValues,
        datasets:
          this.selectedCryptoCompareToName.length > 0 &&
          this.selectedFormat == 'line'
            ? [
                {
                  label: this.selectedCryptoName,
                  data: this.chartDataValue,
                  backgroundColor: this.chartColorsValues,
                  borderColor: this.chartColorsValues,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 0,
                  pointBackgroundColor: this.chartColorsValues,
                  pointBorderColor: this.chartColorsValues,
                },
                {
                  label: this.selectedCryptoCompareToName,
                  data: this.chartDataValueCompareTo,
                  backgroundColor: this.chartColorsValuesCompareTo,
                  borderColor: this.chartColorsValuesCompareTo,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 1,
                  pointBackgroundColor: this.chartColorsValuesCompareTo,
                  pointBorderColor: this.chartColorsValuesCompareTo,
                },
              ]
            : [
                {
                  label: this.selectedCryptoName,
                  data: this.chartDataValue,
                  backgroundColor: this.chartColorsValues,
                  borderColor: this.chartColorsValues,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 1,
                  pointBackgroundColor: this.chartColorsValues,
                  pointBorderColor: this.chartColorsValues,
                },
              ],
      },
      options: {
        plugins: {
          legend: {
            display: this.selectedCryptoCompareToName.length > 0 ? true : false,
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value: any, index, values) {
                return value / 1000 + 'k$';
              },
            },
          },
        },
      },
    });

    // Chart for Market Cap
    this.myChartMarketCap = new Chart(ctxMarketCap, {
      type: this.selectedFormat as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabelsMarketCap,
        datasets:
          this.selectedCryptoCompareToName.length > 0 &&
          this.selectedFormat == 'line'
            ? [
                {
                  label: this.selectedCryptoName,
                  data: this.chartDataMarketCap,
                  backgroundColor: this.chartColorsMarketCap,
                  borderColor: this.chartColorsMarketCap,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 1,
                  pointBorderColor: this.chartColorsMarketCap,
                  pointBackgroundColor: this.chartColorsMarketCap,
                },
                {
                  label: this.selectedCryptoCompareToName,
                  data: this.chartDataMarketCapCompareTo,
                  backgroundColor: this.chartColorsMarketCapCompareTo,
                  borderColor: this.chartColorsMarketCapCompareTo,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 1,
                  pointBorderColor: this.chartColorsMarketCapCompareTo,
                  pointBackgroundColor: this.chartColorsMarketCapCompareTo,
                },
              ]
            : [
                {
                  label: this.selectedCryptoName,
                  data: this.chartDataMarketCap,
                  backgroundColor: this.chartColorsMarketCap,
                  borderColor: this.chartColorsMarketCap,
                  borderWidth: 1,
                  pointStyle: '',
                  pointRadius: 2,
                },
              ],
      },
      options: {
        plugins: {
          legend: {
            display: this.selectedCryptoCompareToName.length > 0 ? true : false,
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value: any, index, values) {
                return value / 1000 + 'k$';
              },
            },
          },
        },
      },
    });
  }
}
