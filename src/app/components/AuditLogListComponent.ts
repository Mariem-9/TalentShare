import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActionLogService } from '../services/action-log.service';

@Component({
    selector: 'app-audit-log-list',
    standalone: true,
    imports: [CommonModule, TableModule],
    template: `
        <div *ngIf="logs.length > 0" class="card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
        <div class="font-semibold text-xl mb-4">Action Logs</div>
        <p-table [value]="logs" [paginator]="true" [rows]="5" [sortField]="'createdAt'" [sortOrder]="-1">
            <ng-template pTemplate="header">
            <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Date</th>
            </tr>
            </ng-template>
            <ng-template pTemplate="body" let-log>
            <tr>
                <td>{{ log.user?.username || 'Anonymous' }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.context  }}</td>
                <td>{{ log.ipAddress }}</td>
                <td>{{ log.createdAt | date: 'medium' }}</td>
            </tr>
            </ng-template>
        </p-table>
        </div>
    `,
    })
    export class AuditLogListComponent implements OnInit {
    logs: any[] = [];

    constructor(private actionLogService: ActionLogService ) {}

    ngOnInit(): void {
        this.actionLogService.getLogs().subscribe({
        next: data => this.logs = data,
        error: err => console.error('Error loading logs:', err)
        });
    }
}
