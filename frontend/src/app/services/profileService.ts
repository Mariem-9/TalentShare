// src/app/services/profileService.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = 'http://localhost:8080/api/utilisateur';
    constructor(private http: HttpClient) { }
    getUserProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }
    updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data);}

    getGroupRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations`);
  }
}
