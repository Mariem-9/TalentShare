
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

    @Injectable({
    providedIn: 'root'
    })
    export class MomentService {

    private apiUrl = 'http://localhost:8080/api/moments';

    constructor(private http: HttpClient) { }

    publishMoment(texte: string, groupeId: number, mediaFileId?: number): Observable<Moment> {
        let params = new HttpParams()
        .set('texte', texte)
        .set('groupeId', groupeId);

        if (mediaFileId !== undefined) {
        params = params.set('mediaFileId', mediaFileId);
        }

        return this.http.post<Moment>(`${this.apiUrl}/publish`, null, { params });
    }

    getMomentsDuGroupe(groupeId: number): Observable<Moment[]> {
        return this.http.get<Moment[]>(`${this.apiUrl}/group/${groupeId}`);
    }

editMoment(momentId: number, texte: string, mediaId: number | null): Observable<Moment> {
  const body = {
    texte,
    mediaId
  };
  return this.http.put<Moment>(`${this.apiUrl}/${momentId}`, body);
}



    deleteMoment(momentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${momentId}`);
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
