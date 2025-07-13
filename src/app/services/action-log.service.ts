import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ActionLogService {
    private apiUrl = 'http://localhost:8080/api/action-logs';

    constructor(private http: HttpClient) {}

    log(action: string, context: string) {
        return this.http.post(this.apiUrl, { action, context });
    }
    getLogs() {
        return this.http.get<any[]>(this.apiUrl);
        }
}
