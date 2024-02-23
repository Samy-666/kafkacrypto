import { AfterViewInit, Component, Input } from "@angular/core";
import { CryptoListService } from "../crypto-list.service";
import { ResponseValue } from "src/app/models/crypto.model";

@Component({
    selector: 'app-crypto-evolution-chart',
    templateUrl: './crypto-evolution-chart.html',
    styleUrls: ['./crypto-evolution-chart.scss'],
  })
  
  export class CryptoEvolutionChart implements AfterViewInit {
    @Input() selectedCryptoId : number = 0;
    public valueEvolution : number = 0;
    constructor(private cryptoListService : CryptoListService){
    }


    ngAfterViewInit(): void {
        this.getChartDataValue(this.selectedCryptoId, '10m')
        }
      
          private getChartDataValue(id: number, periode: string) {
            this.cryptoListService
              .getDataValueByTime(id, periode)
              .subscribe((data: ResponseValue[]) => {
                this.valueEvolution = data[0]['evolution'];
              
              });
          }
         
          getClassObject() {
            return {
              'green': this.valueEvolution > 0,
              'red': this.valueEvolution < 0,
              'grey': this.valueEvolution == 0
            };
          }
        
}
    