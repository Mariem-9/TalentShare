// src/app/services/profileService.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }
    getUserProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/utilisateur/me`);
    }
    updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/utilisateur/me`, data);}

    getGroupRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/utilisateur/recommendations`);
    }
        getTalentOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/utilisateur/talents`);
    }

    getSkillOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/utilisateur/skills`);
    }
    getLanguageOptions() {
    return this.http.get<string[]>(`${this.apiUrl}/utilisateur/languages`);
    }
}
