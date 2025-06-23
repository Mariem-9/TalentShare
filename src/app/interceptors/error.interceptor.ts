import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((err) => {
        if (err.status === 401) {
            authService.logout();
            router.navigate(['/login'], {
            state: { error: 'Session expired. Please login again.' }
            });
        }
        else if (err.status === 403) {
            // First show the error message
            messageService.add({
            severity: 'error',
            summary: 'Forbidden',
            detail: 'You lack required permissions',
            life: 5000
            });
            // Then redirect to unauthorized page
            router.navigate(['/unauthorized']);
        }
        else {
            messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'An error occurred',
            life: 5000 //5 seconds
            });
        }
        return throwError(() => err);
        })
    );
};
