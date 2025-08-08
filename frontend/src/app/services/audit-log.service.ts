import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    log(action: string, details: string) {
        const skipEndpoints = [
            '/api/audit-logs',
            '/api/auth/refreshtoken',
            '/api/auth/authenticate'
        ];
        if (skipEndpoints.some(endpoint => action.includes(endpoint))) {
            return;
        }
        this.http.post(`${this.apiUrl}/audit-log`, { action, details }).subscribe({
            next: () => {},
            error: () => {}
        });
    }
}
