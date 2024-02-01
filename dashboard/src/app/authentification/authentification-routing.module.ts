import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PAGE_ID } from '../enums/page.enum';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { pageId: PAGE_ID.LOGIN },
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: { pageId: PAGE_ID.REGISTER },
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthentificationRoutingModule { }