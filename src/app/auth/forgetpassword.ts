import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';



@Component({
    selector: 'Password-Widget',
    standalone: true,
    imports: [CommonModule,FormsModule,ButtonModule,InputTextModule,DividerModule,RouterModule],
    template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="card w-full max-w-4xl p-6">
            <h2 class="text-center text-2xl font-semibold mb-6"> Password Reset</h2>
            <div class="flex flex-col md:flex-row">
                <!-- Form -->
                <div class="w-full md:w-6/12 flex flex-col items-center justify-center gap-3 px-4">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="username">Username</label>
                        <input pInputText id="username" type="text" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="password">New Password</label>
                        <input pInputText id="password" type="password" class="w-full" [(ngModel)]="newPassword" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="confirmPassword">Confirm Password</label>
                        <input pInputText id="confirmPassword" type="password" class="w-full" [(ngModel)]="confirmPassword" />
                    </div>
                    <p-button label="Done" class="w-full mt-2" (onClick)="resetPassword()"></p-button>
                </div>

                <!-- Divider -->
                <div class="w-full md:w-1/12 flex items-center justify-center">
                    <p-divider layout="vertical" class="!hidden md:!flex"><b>OR</b></p-divider>
                    <p-divider layout="horizontal" class="!flex md:!hidden" align="center"><b>OR</b></p-divider>
                </div>

                <!-- Sign up -->
                <div class="w-full md:w-5/12 flex items-center justify-center px-4">
                    <p-button label="Sign Up" icon="pi pi-user-plus" severity="success"
                        styleClass="w-full max-w-[17.35rem] mx-auto" [routerLink]="['/register']"></p-button>
                </div>
            </div>
        </div>
    </div>
    `
})
export class PasswordWidget {
    token = '';
    newPassword = '';
    confirmPassword = '';

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private auth: AuthService) {}

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token') || '';
    }

    resetPassword() {
        if (!this.newPassword || !this.confirmPassword) {
        alert("Please fill both fields");
        return;
        }

        if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
        }

        this.auth.resetPassword(this.token, this.newPassword).subscribe({
        next: () => {
            alert('Password reset successful!');
            this.router.navigate(['/login']);
        },
        error: (err) => {
            alert(err.error?.message || 'Error occurred');
        }
        });
    }
}
