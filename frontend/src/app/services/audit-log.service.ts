import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private baseUrl = environment.apiUrl;
    private apiUrl =`${this.baseUrl}/audit-logs`;

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
        this.http.post(this.apiUrl, { action, details }).subscribe({
            next: () => {},
            error: () => {}
        });
        //         if (skipEndpoints.some(endpoint => action.includes(endpoint))) {
//             console.log('[SKIP AUDIT]', action, 'because matches:',
//                 skipEndpoints.find(e => action.includes(e)));
//             return;
//         }
//         console.log('[SEND AUDIT]', action, 'with details:', details);
//         this.http.post(this.apiUrl, { action, details }).subscribe({
//             next: () => console.log('[AUDIT SUCCESS]', action),
//             error: (err) => console.error('[AUDIT FAILED]', action, 'reason:', err.message)
//         });
    }
}
