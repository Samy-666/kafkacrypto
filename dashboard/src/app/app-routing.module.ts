import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './config/guard/auth.guard';



const routes: Routes = [
    { path: '',  loadChildren: () => import('./home/home.module').then(m => m.HomeModule),  canActivate: [AuthGuard]}, 
    { path: 'authentification', loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule) },
    { path: '**', redirectTo: '' },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}