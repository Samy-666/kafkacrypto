import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MarketCap, Values } from 'src/app/models/crypto.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges, OnInit {
  @Input() public selectedPeriod = '';
  @Input() public selectedFormat = '';
  @Input() public selectedCrypto = 0;
  @Input() public selectedCryptoName = '';

  public chartDataValue: number[] = [];
  public chartDataMarketCap: number[] = [];
  public chartColorsValues: any[] = [];
  public chartColorsMarketCap: any[] = [];
  public chartLabelsValues: string[] = [];
  public chartLabelsMarketCap: string[] = [];

  public filtredDataMc: MarketCap[] = [];
  public filtredDataValue: Values[] = [];
  public myChartValue: Chart | null = null;
  public myChartMarketCap: Chart | null = null;

  constructor(
    private cryptoListService: CryptoListService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
  ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      const crypto = params['crypto'];
      if (id && crypto) {
        this.selectedCryptoName = crypto;
        this.selectedCrypto = id;
        this.getChartDataValue(id, this.selectedPeriod);
        this.getChartDataMc(id, this.selectedPeriod);
        this.createBarChart();
      }
    });
    // supprimer les query params
    const currentRoute = this.router.url;
    this.router.navigateByUrl(currentRoute.split('?')[0]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getChartDataValue(this.selectedCrypto, this.selectedPeriod);
    this.getChartDataMc(this.selectedCrypto, this.selectedPeriod);
    this.createBarChart();
  
  }

  private generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
  }

  private getChartDataMc(id: number, periode: string) {
    this.cryptoListService
      .getDataMCByTime(id, periode)
      .subscribe((data: MarketCap[]) => {
        this.filtredDataMc = data;
        this.formatData();
        this.createBarChart();
      });
  }
  private getChartDataValue(id: number, periode: string) {
    this.cryptoListService
      .getDataValueByTime(id, periode)
      .subscribe((data: Values[]) => {
        this.filtredDataValue = data;
        this.formatData();
        this.createBarChart();
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
    if(this.chartDataValue?.length > 50){
      this.chartDataValue = this.chartDataValue.slice(0, 50);
      this.chartLabelsValues = this.chartLabelsValues.slice(0, 50);
      this.chartColorsValues = this.chartColorsValues.slice(0, 50);
      this.chartDataMarketCap = this.chartDataMarketCap.slice(0, 50);
    }
  }

  createBarChart(): void {
    const ctx = document.getElementById('myChartValue') as HTMLCanvasElement;
    const ctx2 = document.getElementById(
      'myChartMarketCap'
    ) as HTMLCanvasElement;

    if (this.myChartValue) {
      this.myChartValue.destroy();
    }
    if (this.myChartMarketCap) {
      this.myChartMarketCap.destroy();
    }

    // Chart for Values

    this.myChartValue = new Chart(ctx, {
      type: this.selectedFormat as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabelsValues,
        datasets: [
          {
            label: 'Values',
            data: this.chartDataValue,
            backgroundColor: this.chartColorsValues,
            borderColor: this.chartColorsValues,
            borderWidth: 1,
            pointStyle: '',
            pointRadius: 0
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function (value: any, index, values) {
                // Divisez les valeurs par 1000 (ou tout autre facteur que vous trouvez approprié)
                return value / 1000 + 'k$';
              },
            },
          },
        },
      },
    });

    // Chart for Market Cap

    this.myChartMarketCap = new Chart(ctx2, {
      type: this.selectedFormat as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabelsMarketCap,
        datasets: [
          {
            label: 'Market Cap',
            data: this.chartDataMarketCap,
            backgroundColor: this.chartColorsMarketCap,
            borderColor: this.chartColorsMarketCap,
            borderWidth: 1,
            pointStyle: '',
            pointRadius: 0
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function (value: any, index, values) {
                // Divisez les valeurs par 1000 (ou tout autre facteur que vous trouvez approprié)
                return value / 1000 + 'k$';
              },
            },
          },
        },
      },
    });
  }
}
