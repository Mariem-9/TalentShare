// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Skip auth for refresh token and login requests
    if (req.url.includes('/refreshtoken') || req.url.includes('/authenticate')) {
        return next(req);
    }

    const token = authService.getToken();

    let authReq = req.clone({
        setHeaders: {
        Authorization: `Bearer ${token}`
        }
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 || req.url.includes('/refreshtoken') || req.url.includes('/authenticate')) {
            return throwError(() => error);
        }

        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => error);
        }

        return authService.refreshAccessToken().pipe(
            switchMap(() => {
            const newToken = authService.getToken();
            const newReq = req.clone({
                setHeaders: {
                Authorization: `Bearer ${newToken}`
                }
            });
            return next(newReq);
            }),
            catchError((refreshError) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
            })
        );
        })
    );
};

