// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 || req.url.includes('/refreshtoken')) {
            return throwError(() => error);
            }
            const refreshToken = authService.getRefreshToken();
            if (!refreshToken) {
                authService.logout();
                return throwError(() => error);
            }
            return authService.refreshAccessToken().pipe(
                switchMap((newToken) => {
                    const newReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${newToken}`
                    }
                });
                return next(newReq);
            }),
            catchError((refreshError) => {
                authService.logout();
                return throwError(() => refreshError);
                })
            );
        })
    );
};
