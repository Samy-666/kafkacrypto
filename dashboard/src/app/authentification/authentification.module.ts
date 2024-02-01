
import { NgModule } from '@angular/core';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthentificationService } from './authentification.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent, 
    ],
    imports: [
        AuthentificationRoutingModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    providers: [
        AuthentificationService
    ],
})

export class AuthentificationModule { }
