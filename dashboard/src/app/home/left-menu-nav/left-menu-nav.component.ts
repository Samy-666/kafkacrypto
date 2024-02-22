import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, map, shareReplay } from "rxjs";
import { AuthentificationService } from "src/app/authentification/authentification.service"
import { RegisterModel } from "src/app/models/login.model";
import { MenuList } from "src/app/models/menu.model";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: "app-left-menu-nav",
    templateUrl: "./left-menu-nav.component.html",
    styleUrls: ["./left-menu-nav.component.scss"]
})
export class LeftMenuNavComponent implements OnInit {
    @Input() userInformation: RegisterModel = {
        email: '',
        password: '',
        age: 0,
        address: '',
        first_name: '',
        last_name: ''
    };
    
    public navbarOpen = false;
    public flyer = false;
    public flyerTwo = false;
    public isAtHome = false;
    public menuList: MenuList[] = [{ id: 0, name: 'Dashboard', route: '/dashboard' },
                                   { id: 1, name: 'Toutes les Monnaies', route: '/crypto-list' },
                                   { id: 2, name: 'Favoris', route: '/favoris-list' },
                                   { id: 3, name: 'Actualités', route: '/rss' }];
    public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    constructor(private router: Router, private authentificationService: AuthentificationService,
        private breakpointObserver: BreakpointObserver) {
    }
    
    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    logout() {
        this.authentificationService.logout();
        this.router.navigate(['/authentification/login']);
    }

    toggleFlyer() {
        this.flyer = !this.flyer;
        this.flyerTwo = false;
    }


    ngOnInit(): void {
        this.isAtHome = this.router.url === "/home";
        if (this.isAtHome) {
            this.menuList.shift();
        }
    }

    goToPage(route: string) {
        this.router.navigate([route]);
    }

}

