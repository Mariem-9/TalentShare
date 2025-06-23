import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AppFloatingConfigurator } from '../layout/component/app.floatingconfigurator';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule,ToggleSwitchModule,CommonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator/>
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="https://www.talan.com/images/talan-logo.svg" alt="Talan Logo" class="mb-8 w-64 h-8 mx-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Talan!</div>
                            <span class="text-muted-color font-medium">Sign up to continue</span>

                        </div>

                        <div>
                            <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                            <input pInputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" [(ngModel)]="username" />

                            <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Email</label>
                            <input pInputText id="email1" type="email" [(ngModel)]="email" placeholder="Email" class="w-full md:w-[30rem] mb-8"/>

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <p-toggleswitch [(ngModel)]="switchValue" (onChange)="onToggleChange()" />
                                <div *ngIf="switchValue" class="flex items-center gap-3">
                                    <input pInputText type="password" placeholder="Admin activation code" [(ngModel)]="adminCode" class="w-48" />
                                </div>
                            </div>
                            <p-button label="Sign up" styleClass="w-full" (onClick)="register()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class Register {

    username = '';
    password = '';
    email = '';
    isAdmin = false;
    role = 'ROLE_USER';
    errorMessage: string = '';
    switchValue: boolean = false;
    adminCode = '';

    onToggleChange() {
        if (!this.switchValue) {
            this.adminCode = '';
            this.isAdmin = false;
        }
    }
    constructor(private authService: AuthService, private router: Router) {}
    register() {
        this.errorMessage = '';

        if (!this.email || this.email.trim() === '') {
            this.errorMessage = "Email is required";
            return;
    }

        const registerData = {
            username: this.username,
            password: this.password,
            email: this.email,
            adminCode: this.adminCode,
            role: this.switchValue ? 'ROLE_ADMIN' : 'ROLE_USER',
        };

        this.authService.register(registerData).subscribe({
            next: (response) => {
            console.log(' Registration successful');
            this.router.navigate(['/home'], {
                state: { successMessage: 'Registration successful!' }
            });
            },
            error: (err) => {
            this.errorMessage = err.message;
            console.error('Registration failed:', err);
            }
        });
    }
}

