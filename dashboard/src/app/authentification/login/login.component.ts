import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../authentification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });
    public errorMessage: string = '';
    constructor(private formBuilder: FormBuilder, private authentificationService: AuthentificationService, private router: Router) { }

    onSubmit() {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        if (email && password) {
            this.authentificationService.login(email, password).subscribe(
                () => {
                    this.router.navigate(['/dashboard']);
                },
                (error) => {
                    this.errorMessage = error.error.message;
                }
            );
        } else {
            this.errorMessage = 'Veuillez remplir tous les champs';
        }
    }
    goToRegister() {
        this.router.navigate(['/authentification/register']);
    }
}
