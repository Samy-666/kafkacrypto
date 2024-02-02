
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { LeftMenuNavComponent } from './left-menu-nav/left-menu-nav.component';
import { CryptoListService } from './crypto-list/crypto-list.service';
import { CryptoListComponent } from './crypto-list/crypto-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CryptoInfoModal } from './crypto-list/crypto-info-modal/crypto-info-modal';
import { ChartComponent } from './dashboard/charts/chart/chart.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    declarations: [
        HomeComponent,
        DashboardComponent,
        LeftMenuNavComponent,
        CryptoListComponent,
        CryptoInfoModal,
        ChartComponent,
    ],
    imports: [
        HomeRoutingModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatDialogModule,    
        MatButtonModule,
        MatSelectModule
    ],
    providers: [
        CryptoListService
    ],
    bootstrap: [HomeComponent]
})

export class HomeModule { }
