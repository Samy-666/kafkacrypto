import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CryptoListComponent } from './crypto-list/crypto-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { PAGE_ID } from '../enums/page.enum';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { pageId: PAGE_ID.HOME },
        children: [
            {
                path: '', 
                pathMatch: 'full', 
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { pageId: PAGE_ID.DASHBOARD },
            },
            {
                path: 'crypto-list',
                component: CryptoListComponent,
                data: { pageId: PAGE_ID.CRYPTO_LIST },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRoutingModule {

}