import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActionLogService } from '../../services/action-log.service';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { GroupeService } from '../../services/GroupeService';

@Component({
    selector: 'app-audit-log-list',
    standalone: true,
    imports: [CommonModule, TableModule,TagModule,AvatarModule],
    template: `
        <div *ngIf="logs.length > 0" class="card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
        <div class="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-white rounded-lg p-4 mb-6 font-extrabold text-2xl text-center drop-shadow-md">
            Recent Activity Log
        </div>
        <img src="https://tse1.mm.bing.net/th/id/OIP.2VjxEQIBmuYk_lvW7ren7AHaCA?w=1920&h=520&rs=1&pid=ImgDetMain&o=7&rm=3" alt="log_activity"
        class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block">
        <p-table [value]="logs" [paginator]="true" [rows]="5" [sortField]="'createdAt'" [sortOrder]="-1">
            <ng-template pTemplate="header">
            <tr>
                <th style="width: 140px;">Performed By</th>
                <th>Action Type</th>
                <th>Action Details</th>
                <th>IP Address</th>
                <th>Timestamp</th>
            </tr>
            </ng-template>
            <ng-template pTemplate="body" let-log>
            <tr>
                <td>
                    <div class="flex items-center gap-2">
                        <p-avatar *ngIf="log.user?.avatarSafeUrl; else defaultAvatar" [image]="log.user.avatarSafeUrl" shape="circle" styleClass="bg-primary"
                        [style.width.px]="28" [style.height.px]="28" ></p-avatar>
                    <ng-template #defaultAvatar>
                        <p-avatar [label]="log.user?.username?.charAt(0).toUpperCase() || '?'" shape="circle" styleClass="bg-secondary"
                        [style.width.px]="28" [style.height.px]="28"></p-avatar>
                    </ng-template>
                    <span>{{ log.user?.username || 'Anonymous' }}</span>
                    </div>
                </td>
                <td>{{ getFriendlyAction(log.action) }}</td>
                <td>{{ log.context  }}</td>
                <td> <p-tag [value]="log.ipAddress" [severity]="getColorForText(log.ipAddress)" class="text-xs" /></td>
                <td>{{ log.createdAt | date: 'medium' }}</td>
            </tr>
            </ng-template>
        </p-table>
        </div>
    `,
    })
    export class AuditLogListComponent implements OnInit {
    logs: any[] = [];
    colors = ['success', 'info', 'warning', 'danger', 'secondary'];

    constructor(private actionLogService: ActionLogService ,private groupeService: GroupeService ) {}

    ngOnInit(): void {
        this.actionLogService.getLogs().subscribe({
        next: data => {
            this.logs = data;
            this.prepareAvatars();
    },
        error: err => console.error('Error loading logs:', err)
        });
    }
    getFriendlyAction(action: string): string {
        switch (action) {
            case 'ACCEPT_JOIN_REQUEST': return 'Accepted Join Request';
            case 'JOIN_GROUP': return 'Joined Group';
            case 'UPDATE_GROUP_SUCCESS': return 'Updated Group';
            case 'SEND_CHAT_MESSAGE': return 'Sent a Chat Message';
            case 'SEARCH_GROUP': return 'Searched for a Group';
            case 'UPDATE_PROFILE_SUCCESS': return 'Updated Profile';
            case 'UPLOAD_USER_AVATAR_SUCCESS': return 'Uploaded Profile Picture';
            default: return action;
        }
    }
    getColorForText(text: string): string {
    // Generate a consistent pseudo-random index based on the text
    const hash = Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.colors[hash % this.colors.length];
    }
    prepareAvatars(): void {
    //   console.log('Preparing avatars for logs:', this.logs);

        this.logs.forEach(log => {
            const avatarUrl = log.user?.avatarUrl;

            if (!avatarUrl) {
            console.warn(`No avatar URL found for user: ${log.user?.username}`);
            return;
            }

            const idMatch = avatarUrl.match(/\/api\/files\/(\d+)/);
            const fileId = idMatch ? +idMatch[1] : null;

            if (!fileId) {
            console.warn(`Invalid avatar URL for user ${log.user?.username}: ${avatarUrl}`);
            return;
            }

            this.groupeService.getUserAvatarBlob(fileId).subscribe({
            next: blob => {
                const blobUrl = URL.createObjectURL(blob);
                log.user.avatarSafeUrl = blobUrl;
            },
            error: err => {
                console.error(`Failed to load avatar for ${log.user?.username} from ID ${fileId}`, err);
            },
            });
        });
    }
}
