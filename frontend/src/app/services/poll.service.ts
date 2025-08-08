// src/app/services/poll.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PollRequest {
    question: string;
    endDate: string;
    choices: string[];
    groupId: number;
}

export interface PollChoiceDTO {
    id: number;
    text: string;
    voteCount: number;
}

export interface PollResponse {
    id: number;
    question: string;
    endDate: string;
    choices: PollChoiceDTO[];
    votedChoiceId?: number;
    creatorUsername ?: number;

}

@Injectable({
    providedIn: 'root',
})
export class PollService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createPoll(poll: PollRequest): Observable<PollResponse> {
        return this.http.post<PollResponse>(`${this.apiUrl}/polls/create`, poll);
    }

    vote(pollId: number, choiceId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/polls/${pollId}/vote`, null, {
        params: { choiceId: choiceId.toString() },
        });
    }

    getResults(pollId: number): Observable<PollResponse> {
        return this.http.get<PollResponse>(`${this.apiUrl}/polls/${pollId}`);
    }

    editPoll(pollId: number, updatedPoll: PollRequest): Observable<PollResponse> {
        return this.http.put<PollResponse>(`${this.apiUrl}/polls/${pollId}/edit`, updatedPoll);
    }

    deletePoll(pollId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/polls/${pollId}`);
    }

    editChoice(choiceId: number, newText: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/polls/choices/${choiceId}/edit`, null, {
        params: { newText },
        });
    }

    deleteChoice(choiceId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/polls/choices/${choiceId}`);
    }

    editVote(pollId: number, newChoiceId: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/polls/${pollId}/vote/edit`, null, {
        params: { newChoiceId: newChoiceId.toString() },
        });
    }

    deleteVote(pollId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/polls/${pollId}/vote`);
    }

    getPollsByGroup(groupId: number): Observable<PollResponse[]> {
    return this.http.get<PollResponse[]>(`${this.apiUrl}/polls/group/${groupId}`);
    }

    getClosedPollsByGroup(groupId: number): Observable<PollResponse[]> {
    return this.http.get<PollResponse[]>(`${this.apiUrl}/polls/group/${groupId}/closed`);
    }


}
