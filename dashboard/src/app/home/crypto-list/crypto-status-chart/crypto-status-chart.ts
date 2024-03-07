import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CryptoListService } from '../crypto-list.service';
import { ResponseValue, Values } from 'src/app/models/crypto.model';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  registerables,
} from 'chart.js';

@Component({
  selector: 'app-crypto-status-chart',
  templateUrl: './crypto-status-chart.html',
  styleUrls: ['./crypto-status-chart.scss'],
})
export class CryptoStatusChartComponent implements AfterViewInit {
  @Input() selectedCryptoId: number = 0;
  @Input() canvasId: string = '';
  public valueEvolution: number = 0;
  public filtredDataValue: Values[] = [];
  public chartDataValue: number[] = [];
  public chartColorsValues: any[] = [];
  public chartLabelsValues: string[] = [];
  public myChartValue: Chart | null = null;

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
  ngAfterViewInit(): void {
    if (this.selectedCryptoId !== undefined) {
      this.getChartDataValue(this.selectedCryptoId, '5m');
    }
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
  private formatData(): void {
    this.chartDataValue = this.filtredDataValue.map((item: any) => item.value);

    this.chartLabelsValues = this.filtredDataValue.map((item: any) => {
      const date = new Date(item.time);
      return date.toLocaleTimeString();
    });

    this.chartColorsValues = this.chartDataValue.map((item: any) =>
      this.generateRandomColor()
    );
  }

  private generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#008000';
  }

  createChart(): void {
    const ctxValue = document.getElementById(
      this.canvasId
    ) as HTMLCanvasElement;

    if (this.myChartValue) {
      this.myChartValue.destroy();
    }
    if (
      this.chartDataValue.length > 0 &&
      this.chartLabelsValues.length > 0 &&
      this.chartColorsValues.length > 0
    ) {
      this.myChartValue = new Chart(ctxValue, {
        type: 'line',
        data: {
          labels: this.chartLabelsValues,
          datasets: [
            {
              data: this.chartDataValue,
              backgroundColor: this.chartColorsValues,
              borderColor: this.chartColorsValues,
              borderWidth: 1,
              pointStyle: '',
              pointRadius: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              ticks: {
                display: false,
                callback: function (value: any, index, values) {
                  return Math.round(value / 1000) + 'k$';
                },
              },
            },
          },
        },
      });
    }
  }
}
