// src/app/services/groupe.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupeService {
    private baseUrl = environment.apiUrl;
    private apiUrl =`${this.baseUrl}/groupes`;
    private apiUrlM = `${this.baseUrl}/groups`;
    private apiUrlA = `${this.baseUrl}/admin/groupes`;

    constructor(private http: HttpClient) {}
    createGroupe(data: any) { return this.http.post(`${this.apiUrl}`, data);}
    getGroupesCrees() { return this.http.get<any[]>(`${this.apiUrl}/crees`);}
    // updateGroupe(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data);}
    updateGroupe(id: number, group: { nom: string, description: string, tags: string[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, group);
}

    deleteGroupe(id: number) { return this.http.delete(`${this.apiUrl}/${id}`);}
    getAllGroupes() { return this.http.get<any[]>(`${this.apiUrl}`);}
    getGroupeById(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/${id}`);}
    isUserGroupCreator(groupId: number): Observable<boolean> { return this.http.get<boolean>(`${this.apiUrl}/${groupId}/is-creator`);}
    //not used yet
    getJoinedGroups() {
        return this.http.get<any[]>(`${this.apiUrl}/rejoints`);
    }
    checkMembershipStatus(groupId: number): Observable<'NONE' | 'MEMBER' | 'PENDING'> {
    return this.http.get<{ status: 'NONE' | 'MEMBER' | 'PENDING' }>(`${this.apiUrlM}/${groupId}/membership-status`)
        .pipe(map(res => res.status));
    }
    joinGroup(groupId: number): Observable<any> { return this.http.post(`${this.apiUrlM}/${groupId}/join`, {});}
    getGroupMembersByRole(groupId: number): Observable<any> {return this.http.get(`${this.apiUrlM}/${groupId}/members-by-role`);}
    validateJoinRequest(groupId: number, userId: number, accepte: boolean): Observable<any> {
        return this.http.post(`${this.apiUrlM}/${groupId}/requests/${userId}/validate?accepte=${accepte}`, {});}
    promoteToModerator(groupId: number, userId: number) { return this.http.post<void>(`${this.apiUrlM}/${groupId}/promote/${userId}`, {});}
    demoteModeratorToMember(groupId: number, userId: number) { return this.http.put<void>(`${this.apiUrlM}/${groupId}/demote/${userId}`, {});}
    leaveGroup(groupId: number): Observable<any> { return this.http.post(`${this.apiUrlM}/${groupId}/leave`, {});}

    getGroupesEnAttente(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/pending`);}

    getPendingGroups(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrlA}`);}
    approveGroup(id: number): Observable<any> { return this.http.put<any>(`${this.apiUrlA}/${id}/approve`, {});}
    rejectGroup(id: number): Observable<any> { return this.http.put<any>(`${this.apiUrlA}/${id}/reject`, {});}


    //move it to file service next time
    uploadGroupAvatar(groupId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/files/upload/avatar/group/${groupId}`, formData);
    }
    uploadUserAvatar(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/files/upload/avatar/user`, formData);
    }
    getUserAvatarBlob(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/files/${id}`, { responseType: 'blob' });
    }
}
