// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth'; // Spring Boot backend URL
    constructor(private http: HttpClient, private router: Router) { }
    private setAuthData(token: string, role: string, refreshToken?: string): void {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        // Additional security: Set timestamp for token validation
        sessionStorage.setItem('token_init', new Date().getTime().toString());
        if (refreshToken) {
            sessionStorage.setItem('refreshToken', refreshToken);
        }
    }

    private clearAuthData(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('token_init');
        sessionStorage.removeItem('refreshToken');
    }

    getToken(): string | null {
    return sessionStorage.getItem('token');
    }

    login(username: string, password: string): Observable<any> {
        // Clear any existing tokens
        this.clearAuthData();
        return this.http.post(`${this.apiUrl}/authenticate`, { username, password }).pipe(

            tap((response: any) => {
                if (!response?.jwtToken || !response?.refreshToken) {
                throw new Error('Invalid token received');
                }
                this.setAuthData(response.jwtToken, response.role, response.refreshToken);
            }),
            catchError(error => {
            this.clearAuthData();
            return throwError(() => error);
            })
        );
    }

    logout(): void {
        this.clearAuthData();
        this.router.navigate(['/login']);
        }

    register(registerData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
            tap((response: any) => {
            if (response?.jwtToken && response?.refreshToken) {
                this.setAuthData(response.jwtToken, response.role, response.refreshToken);
            } else {
                throw new Error('Missing token(s) in response');
            }
            }),
            catchError(error => {
            let errorMsg = 'Registration failed';
            if (error.error?.message) {
                errorMsg = error.error.message;
            }
            return throwError(() => new Error(errorMsg));
            })
        );
        }
    getRole(): 'ROLE_USER' | 'ROLE_ADMIN' | null {
        const role = sessionStorage.getItem('role');
        return role === 'ROLE_USER' || role === 'ROLE_ADMIN' ? role : null;
        }
    refreshAccessToken(): Observable<string> {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }


        return this.http.post<{ accessToken: string }>(
            `${this.apiUrl}/refreshtoken`,
            {},
            {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
            }
        ).pipe(
            tap(response => {
            const newAccessToken = response.accessToken;
            if (!newAccessToken) {
                throw new Error('No new access token returned');
            }
            // Update only the access token, keep the same role and refresh
            sessionStorage.setItem('token', newAccessToken);
            sessionStorage.setItem('token_init', new Date().getTime().toString());
            }),
            map(response => response.accessToken),
		catchError(error => {
                //  If refresh fails, log out
                if (error.status === 401) {
                    this.logout();
                }
                return throwError(() => error);
            })
        );
}

    getRefreshToken(): string | null {
        return sessionStorage.getItem('refreshToken');
    }
    requestPasswordReset(email: string) {
        return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
    }

    resetPassword(token: string, newPassword: string) {
        return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
    }
    getUserProfile(): Observable<any> {
        return this.http.get('http://localhost:8080/api/utilisateur/me');
    }


}


