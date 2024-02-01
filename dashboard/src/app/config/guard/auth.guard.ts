// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthentificationService } from '../../authentification/authentification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authentificationService: AuthentificationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authentificationService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/authentification/login']);
      return false;
    }
  }
}
