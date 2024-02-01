import { Component } from "@angular/core";
import { AuthentificationService } from "../authentification.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegisterModel } from "src/app/models/login.model";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    public registerForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
        age: ['', Validators.required],
        address: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required]
    },
    );
    public errorMessage: string = '';
    constructor(private formBuilder: FormBuilder, private authentificationService: AuthentificationService, private router: Router) { }

    onSubmit() {
        const isSamePassword = this.registerForm.value.password === this.registerForm.value.repeatPassword;
        if (!isSamePassword) {
            this.errorMessage = 'Les mots de passe ne sont pas identiques';
            return;
        }
        if (this.registerForm.valid && this.registerForm.value.email && this.registerForm.value.password && this.registerForm.value.age && this.registerForm.value.address && this.registerForm.value.first_name && this.registerForm.value.last_name) {
            const params: RegisterModel = {
                email: this.registerForm.value.email!,
                password: this.registerForm.value.password!,
                age: Number(this.registerForm.value.age!),
                address: this.registerForm.value.address!,
                first_name: this.registerForm.value.first_name!,
                last_name: this.registerForm.value.last_name!
            };
            this.authentificationService.register(params).subscribe(
                () => {
                    this.goToLogin();
                },
                (error) => {
                    this.errorMessage = error.error.message;
                }
            );
        } else {
            this.errorMessage = 'Veuillez remplir tous les champs';
        }
    }

    public goToLogin() {
        this.router.navigate(['/authentification/login']);
    }

}