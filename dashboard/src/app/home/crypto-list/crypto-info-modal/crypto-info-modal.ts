import { query } from "@angular/animations";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
    selector: 'crypto-info-modal',
    templateUrl: './crypto-info-modal.html',
  })
  export class CryptoInfoModal implements OnInit{
    public cryptoName: string = '';
    public description: string = '';
    public priceChange : number = 0;
    public error = 0;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,public dialogRef: MatDialogRef<CryptoInfoModal>) {

     }
    ngOnInit(): void {
       this.cryptoName = this.data["Name"];
       this.description = this.data["Description"];
       this.priceChange = this.data["PriceChange"];

       if(this.data.error){
           this.error = this.data.error;
       }
    }

    public voirPlus(){
      const queryParams: any = {id: this.cryptoName};
      this.router.navigate(['/dashboard/crypto'], { queryParams });
      this.dialogRef.close();
    }
  }