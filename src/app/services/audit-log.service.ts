import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
    })
    export class AuditLogService {
    private apiUrl = 'http://localhost:8080/api/audit-logs';

    constructor(private http: HttpClient) {}

    log(action: string, details: string) {
        this.http.post(this.apiUrl, { action, details }).subscribe();
    }
}
