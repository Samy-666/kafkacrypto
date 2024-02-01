import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CryptoList, FormatLabel, PeriodModel } from "src/app/models/crypto.model";
import { CryptoListService } from "../crypto-list/crypto-list.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public cryptoId: string = '';
    public selectedPeriod = ''
    public selectedFormat = ''
    public selectedCrypto = 0
    public Periodes: PeriodModel[] = [
        { id: 0, value: '10S', viewValue: '10 secondes' },
        { id: 1, value: '1M', viewValue: '1 minute' },
    ]
    public FormatChart: FormatLabel[] = [
        { id: 0, type: 'line' },
        { id: 1, type: 'bar' },
        { id: 2, type: 'pie' },
    ]

    public CryptoList: CryptoList[] = []


    constructor(private router: Router, private cryptoListService: CryptoListService) { }

    onPeriodChange(event: any) {
        this.selectedPeriod = event.value;
    }
    onFormatChange(event: any) {
        this.selectedFormat = event.value;
    }
    onCryptoChange(event: any) {
        this.selectedCrypto = event.value;
    }

    private getChartData(): void {
        const data = this.cryptoListService.getDataFromJson();
        data.map((item: any) => {
            this.CryptoList.push({ id: item.id, name: item.name })
        }
        );
    }

    ngOnInit(): void {
        const queryParams = this.router.parseUrl(this.router.url).queryParams;
        if (queryParams["id"] && queryParams["id"].length > 0) {
            this.cryptoId = queryParams["id"];
        }
        this.getChartData();
        this.selectedPeriod = this.Periodes[0].value;
        this.selectedFormat = this.FormatChart[0].type;
        this.selectedCrypto = this.CryptoList[0].id;
      
    }
}