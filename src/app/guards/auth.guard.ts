// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(): boolean | Promise<boolean> {
    const token = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();
    if (token) {
        return true;
    } else if (refreshToken) {
        return new Promise((resolve) => {
        this.authService.refreshAccessToken().subscribe({
        next: () => {
            resolve(true);
        },
        error: (err) => {
            this.authService.logout();
            resolve(false);
        }
        });
    });
    } else {
        this.router.navigate(['/login']);
        return false;
        }
    }
}

