import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ActionLogService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    log(action: string, context: string) {
        return this.http.post(`${this.apiUrl}/action-logs`, { action, context });
    }
    getLogs() {
        return this.http.get<any[]>(`${this.apiUrl}/action-logs`);
        }
}
