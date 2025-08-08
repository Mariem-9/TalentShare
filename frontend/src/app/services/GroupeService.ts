// src/app/services/groupe.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupeService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}
    createGroupe(data: any) { return this.http.post(`${this.apiUrl}/groupes`, data);}
    getGroupesCrees() { return this.http.get<any[]>(`${this.apiUrl}/groupes/crees`);}
    updateGroupe(id: number, group: { nom: string, description: string, tags: string[] }): Observable<any> {
        return this.http.put(`${this.apiUrl}/groupes/${id}`, group);
        }
    deleteGroupe(id: number) { return this.http.delete(`${this.apiUrl}/groupes/${id}`);}
    getAllGroupes() { return this.http.get<any[]>(`${this.apiUrl}/groupes`);}
    getGroupeById(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/groupes/${id}`);}
    isUserGroupCreator(groupId: number): Observable<boolean> { return this.http.get<boolean>(`${this.apiUrl}/groupes/${groupId}/is-creator`);}
    //not used yet
    getJoinedGroups() {
        return this.http.get<any[]>(`${this.apiUrl}/groupes/rejoints`);
    }
    checkMembershipStatus(groupId: number): Observable<'NONE' | 'MEMBER' | 'PENDING'> {
    return this.http.get<{ status: 'NONE' | 'MEMBER' | 'PENDING' }>(`${this.apiUrl}/groups/${groupId}/membership-status`)
        .pipe(map(res => res.status));
    }
    joinGroup(groupId: number): Observable<any> { return this.http.post(`${this.apiUrl}/groups/${groupId}/join`, {});}
    getGroupMembersByRole(groupId: number): Observable<any> {return this.http.get(`${this.apiUrl}/groups/${groupId}/members-by-role`);}
    validateJoinRequest(groupId: number, userId: number, accepte: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/groups/${groupId}/requests/${userId}/validate?accepte=${accepte}`, {});}
    promoteToModerator(groupId: number, userId: number) { return this.http.post<void>(`${this.apiUrl}/groups/${groupId}/promote/${userId}`, {});}
    demoteModeratorToMember(groupId: number, userId: number) { return this.http.put<void>(`${this.apiUrl}/groups/${groupId}/demote/${userId}`, {});}
    leaveGroup(groupId: number): Observable<any> { return this.http.post(`${this.apiUrl}/groups/${groupId}/leave`, {});}

    getGroupesEnAttente(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/groupes/pending`);}

    getPendingGroups(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/admin/groupes`);}
    approveGroup(id: number): Observable<any> { return this.http.put<any>(`${this.apiUrl}/admin/groupes/${id}/approve`, {});}
    rejectGroup(id: number): Observable<any> { return this.http.put<any>(`${this.apiUrl}/admin/groupes/${id}/reject`, {});}


    //move it to file service next time
    uploadGroupAvatar(groupId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/files/upload/avatar/group/${groupId}`, formData);
    }
    uploadUserAvatar(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/files/upload/avatar/user`, formData);
    }
    getUserAvatarBlob(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/files/${id}`, { responseType: 'blob' });
    }
}
