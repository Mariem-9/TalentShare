import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { environment } from '../../environments/environment';


export interface ChatMessage {
    id: number;
    groupId: number;
    senderUsername: string;
    senderAvatarUrl: string | null;
    content: string;
    timestamp: string;
    }

@Injectable({ providedIn: 'root' })
export class ChatService {
    private stompClient!: Client;
    private connected = false;
    private baseUrl = environment.apiUrl;



    constructor(private http: HttpClient) {}

    connect(groupId: number, onMessage: (msg: ChatMessage) => void, onConnected?: () => void): void {
    console.log('Attempting to connect to WebSocket...');
    const token = sessionStorage.getItem('token');
    const socket = new SockJS(`${this.baseUrl.replace('/api', '')}/ws?token=${token}`);

    this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
        this.connected = true;
        this.stompClient.subscribe(`/topic/group/${groupId}`, (message: IMessage) => {
            const parsed = JSON.parse(message.body);
            onMessage(parsed);
        });
        if (onConnected) onConnected();
        },
        onStompError: (frame) => console.error('STOMP error:', frame),
        onWebSocketError: (event) => console.error('WebSocket error:', event),
    });

    this.stompClient.activate();
    }
    disconnect(): void {
        if (this.stompClient && this.connected) {
        this.stompClient.deactivate();
        this.connected = false;
        }
    }
    sendMessage(groupId: number, content: string): void {
    console.log('Connected flag:', this.connected);

    if (!this.connected) {
        console.error('Not connected to WebSocket');
        return;
    }

    this.stompClient.publish({
        destination: `/app/chat.send/${groupId}`,
        body: content,
    });
    console.log('Message published:', content);
    }

    editMessage(messageId: number, newContent: string): Observable<ChatMessage> {

    return this.http.put<ChatMessage>(`${this.baseUrl}/message/${messageId}`, newContent, {
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/message/${messageId}`);
    }

    getMessageHistory(groupId: number): Observable<ChatMessage[]> {
    if (!groupId) {
        throw new Error('Group ID is required');
    }
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/group/${groupId}/messages`);
    }
    }
