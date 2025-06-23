// no-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
    const accessToken = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();

    if (!accessToken && !refreshToken) {
        return true;
    }
    this.router.navigate(['/home']);
    return false;
    }
}
