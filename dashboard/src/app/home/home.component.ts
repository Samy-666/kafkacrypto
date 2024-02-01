import { Component, OnInit } from "@angular/core";
import { RegisterModel } from "../models/login.model";
import { AuthentificationService } from "../authentification/authentification.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    constructor(private authentificationService: AuthentificationService) { }

    public userInformation: RegisterModel = {
        email: '',
        password: '',
        age: 0,
        address: '',
        first_name: '',
        last_name: ''
    };
    ngOnInit(): void {
        this.authentificationService.getUserInfo().subscribe(
            (response) => {
                this.userInformation = response;
            }
        )
    }
}
