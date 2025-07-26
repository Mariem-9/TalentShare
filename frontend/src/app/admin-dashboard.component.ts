// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    template: `
        <div class="admin-container p-4">
        <h1>Hi Admin!</h1>
        </div>
    `,
    styles: [`
        .admin-container {
        max-width: 800px;
        margin: 2rem auto;
        text-align: center;
        }
    `]
})
export class AdminDashboardComponent {
    constructor(
        public authService: AuthService,
        public router: Router
    ) {}
}
