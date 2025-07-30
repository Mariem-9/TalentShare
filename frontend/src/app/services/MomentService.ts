
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


    export interface Moment {
        id: number;
        texte: string;
        groupe: any;
        auteur: any;
        media: any;
        isPublic: boolean;
        isApprovedByCreator: boolean;
    }
    export interface Commentaire {
        id: number;
        contenu: string;
        dateCommentaire: string;
        auteur: {
            user: {
            username: string;
            }
        };
        moment: Moment;
    }

    export interface MomentReaction {
        id: number;
        type: string;
        username: string;
        momentId: number;
    }


    @Injectable({
    providedIn: 'root'
    })
    export class MomentService {

    private apiUrl = 'http://localhost:8080/api/moments';

    constructor(private http: HttpClient) { }

    publishMoment(texte: string, groupeId: number, mediaFileId?: number, isPublic: boolean = false): Observable<Moment> {
        let params = new HttpParams()
        .set('texte', texte)
        .set('groupeId', groupeId)
        .set('isPublic', isPublic.toString());

        if (mediaFileId !== undefined) {
        params = params.set('mediaFileId', mediaFileId);
        }

        return this.http.post<Moment>(`${this.apiUrl}/publish`, null, { params });
    }

    getMomentsDuGroupe(groupeId: number): Observable<Moment[]> {
        return this.http.get<Moment[]>(`${this.apiUrl}/group/${groupeId}`);
    }

    editMoment(momentId: number, texte: string, mediaId: number | null, isPublic: boolean): Observable<Moment> {
    const body = { texte, mediaId, isPublic };
    return this.http.put<Moment>(`${this.apiUrl}/${momentId}`, body);
    }

    deleteMoment(momentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${momentId}`);
    }

    getCommentsForMoment(momentId: number) {
        return this.http.get<Commentaire[]>(`${this.apiUrl}/${momentId}/comments`);
    }

    addCommentToMoment(momentId: number, contenu: string) {
        return this.http.post<Commentaire>(`${this.apiUrl}/${momentId}/comments`, { contenu });
    }

    updateComment(momentId: number, commentId: number, contenu: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${momentId}/comments/${commentId}`, { contenu });
    }

    deleteComment(momentId: number, commentId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${momentId}/comments/${commentId}`);
    }

    reactToMoment(momentId: number, reactionType: string): Observable<MomentReaction> {
        const params = new HttpParams().set('reaction', reactionType);
        return this.http.post<MomentReaction>(`${this.apiUrl}/${momentId}/reactions`, null, { params });
    }

    removeReaction(momentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${momentId}/reactions`);
    }

    getReactionsForMoment(momentId: number): Observable<MomentReaction[]> {
        return this.http.get<MomentReaction[]>(`${this.apiUrl}/${momentId}/reactions`);
    }

    approveMoment(momentId: number): Observable<Moment> {
        return this.http.put<Moment>(`${this.apiUrl}/${momentId}/approve`, {});
    }

    rejectMoment(momentId: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${momentId}/reject`, {});
    }

    getMomentsPublics(): Observable<Moment[]> {
            return this.http.get<Moment[]>(`${this.apiUrl}/public`);
        }

  //file service
    uploadMomentFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('http://localhost:8080/api/files/upload/moment', formData);
    }

}
