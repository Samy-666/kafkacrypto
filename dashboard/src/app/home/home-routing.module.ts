import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CryptoListComponent } from './crypto-list/crypto-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { PAGE_ID } from '../enums/page.enum';
import { AuthGuard } from '../config/guard/auth.guard';
import { FavorisListComponent } from './favoris-list/favoris-list.component';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { pageId: PAGE_ID.HOME },
        children: [
    
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { pageId: PAGE_ID.DASHBOARD, queryParams: true},
                canActivate: [AuthGuard],

            },
            {
                path: 'crypto-list',
                component: CryptoListComponent,
                data: { pageId: PAGE_ID.CRYPTO_LIST },
                canActivate: [AuthGuard],
            },
            {
                path: 'favoris-list',
                component: FavorisListComponent,
                data: { pageId: PAGE_ID.FAVORIS_LIST },
                canActivate: [AuthGuard],
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRoutingModule {
    

}