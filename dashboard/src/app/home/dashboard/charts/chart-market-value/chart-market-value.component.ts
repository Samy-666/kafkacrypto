import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Chart, ChartTypeRegistry } from 'chart.js';
import { BarElement, registerables, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
import { CryptoListService } from "src/app/home/crypto-list/crypto-list.service";
import { ChartMarketValue, Values } from "src/app/models/chartData.model";

@Component({
    selector: "app-chart-market-value",
    templateUrl: "./chart-market-value.component.html",
    styleUrls: ["./chart-market-value.component.scss"]
})
export class ChartMarketValueComponent implements OnChanges {
    @Input() public cryptoId: string = '';
    @Input() public selectedPeriod = '';
    @Input() public selectedFormat = '';
    @Input() public selectedCrypto = 0;

    public chartDataValue: number[] = [];
    public chartDataMarketCap: number[] = [];
    public chartColors: any[] = [];
    public currentDate: string = '';
    public chartLabels: string[] = [];
    public filtredData: ChartMarketValue[] = [];
    public myChartValue: Chart | null = null;
    public myChartMarketCap: Chart | null = null;


    constructor(private cryptoListService: CryptoListService) {
        Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);
        Chart.register(...registerables);
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.getChartData(this.selectedCrypto);
        this.createBarChart();
    }

    private generateRandomColor(): string {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + randomColor;
    }

    private getChartData(id: number): void {
        const data = this.cryptoListService.getDataFromJson();
        this.filtredData = data.filter((item: any) => item.id === id);
        this.formatData(this.selectedPeriod);
    }

    public formatData(selectedPeriod: string): void {
        const instantT = new Date().getTime();
        const startTime = this.filtredData[0].values[0].time;
        switch (this.selectedPeriod) {
            case '10S':
                this.chartDataValue = this.filtredData[0].values.map((item: any) => item.price);
                this.chartDataMarketCap = this.filtredData[0].values.map((item: any) => item.market_cap);
                this.chartLabels = this.filtredData[0].values.map((item: any) => {
                    const date = new Date(item.time);
                    return date.toLocaleTimeString();
                });
                this.chartColors = this.chartDataValue.map((item: any) => this.generateRandomColor());
                break;
            case '1M':
                let values = this.filtredData[0].values;
                values.map((item: any) => {
                    item.time = new Date(item.time).getTime();
                });
                let newValues: Values[] = [];
                newValues.push(values[0]);
                for (let i = 1; i < values.length; i++) {
                    const timeDifference = Number(values[i].time) - Number(newValues[newValues.length - 1].time);
                    if (timeDifference >= 60000) {
                        newValues.push(values[i]);
                    }
                }
                this.chartDataMarketCap = newValues.map((item: any) => item.market_cap);
                this.chartDataValue = newValues.map((item: any) => item.price);
                this.chartLabels = newValues.map((item: any) => {
                    const date = new Date(item.time);
                    return date.toLocaleTimeString();
                });
                this.chartColors = this.chartDataValue.map((item: any) => this.generateRandomColor());
                break;
            default:
                break;
        }
    }


    createBarChart(): void {
        const ctx = document.getElementById('myChartValue') as HTMLCanvasElement;
        const ctx2 = document.getElementById('myChartMarketCap') as HTMLCanvasElement;

        if (this.myChartValue) {
            this.myChartValue.destroy();
        }
        if (this.myChartMarketCap) {
            this.myChartMarketCap.destroy();
        }

        this.myChartValue = new Chart(ctx, {
            type: this.selectedFormat as keyof ChartTypeRegistry,
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: 'Values',
                    data: this.chartDataValue,
                    backgroundColor: this.chartColors,
                    borderColor: this.chartColors,
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        this.myChartMarketCap = new Chart(ctx2, {
            type: this.selectedFormat as keyof ChartTypeRegistry,
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: 'Market Cap',
                    data: this.chartDataMarketCap,
                    backgroundColor: this.chartColors,
                    borderColor: this.chartColors,
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

}