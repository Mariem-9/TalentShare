// src/app/services/groupe.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GroupeService {
    private apiUrl = 'http://localhost:8080/api/groupes';
    constructor(private http: HttpClient) {}
    createGroupe(data: any) { return this.http.post(`${this.apiUrl}`, data);}
    getGroupesCrees() { return this.http.get<any[]>(`${this.apiUrl}/crees`);}
    updateGroupe(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data);}
    deleteGroupe(id: number) { return this.http.delete(`${this.apiUrl}/${id}`);}
    getAllGroupes() { return this.http.get<any[]>(`${this.apiUrl}`);}


    getGroupesRejoints() {
        return this.http.get<any[]>(`${this.apiUrl}/rejoints`);
    }
}
