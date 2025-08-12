// src/app/services/profileService.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private baseUrl = environment.apiUrl;
    private apiUrl =`${this.baseUrl}/utilisateur`;
    // private apiUrl = '/api/utilisateur';
    constructor(private http: HttpClient) { }
    getUserProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }
    updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data);}

    getGroupRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations`);
    }
        getTalentOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/talents`);
    }

    getSkillOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/skills`);
    }
    getLanguageOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/languages`);
    }
}
