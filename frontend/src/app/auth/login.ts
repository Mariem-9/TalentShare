import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { DialogModule } from 'primeng/dialog';
import { AppFloatingConfigurator } from '../layout/component/app.floatingconfigurator';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, DialogModule],
    template: `
        <app-floating-configurator/>
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="https://www.talan.com/images/talan-logo.svg" alt="Talan Logo" class="mb-8 w-64 h-8 mx-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Talan!</div>
                            <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                                Don't have an account?
                                <a routerLink="/register" class="text-primary-500 hover:underline">Register here</a>
                            </p>

                        </div>
                        <div>
                            <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                            <input pInputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" [(ngModel)]="username" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <div class="flex items-center justify-end mt-2 mb-8 gap-8">
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" (click)="displayPasswordReset = true">Forgot your password?</a>
                                <p-dialog header="Reset Password" [(visible)]="displayPasswordReset" [modal]="true" [style]="{width: '30vw'}">
                                <div class="flex flex-col gap-4">
                                    <label for="email">Email</label>
                                    <input pInputText id="email" type="email" [(ngModel)]="email" placeholder="Enter your email" />
                                    <small>We’ll send you a link to reset your password.</small>
                                    <p-button label="Send reset link" (onClick)="sendResetLink()" class="mt-4"></p-button>
                                </div>
                                </p-dialog>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="login()"></p-button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

})
export class Login {

    username = '';
    password = '';
    checked: boolean = false;
    errorMessage = '';
    email= '';
    displayPasswordReset = false;

    constructor(private auth: AuthService, private router: Router) {}

    login() {
        console.log('Login form submitted');
        this.auth.login(this.username, this.password).subscribe({
            next: (response: any) => {
                console.log('✅ Login successful:', response);
                this.router.navigate(['/home']).then(() => {
                    console.log('✅ Navigation done!');
                });
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Login failed';
                console.error('Login error:', err);
            }
        });
    }
    sendResetLink() {
    if (!this.email) {
        alert("Please enter your email.");
        return;
    }

    this.auth.requestPasswordReset(this.email).subscribe({
        next: () => {
        alert("Reset link sent! Check your email.");
        this.displayPasswordReset = false;
        this.email = '';
        },
        error: err => {
        alert("Error: " + (err.error?.message || err.message));
        }
    });
    }
}

