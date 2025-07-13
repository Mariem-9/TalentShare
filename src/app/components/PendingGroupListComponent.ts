import { Component, OnInit, } from '@angular/core';
import { GroupeService } from '../services/GroupeService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ActionLogService } from '../services/action-log.service';


@Component({
    selector: 'app-pending-group-list',
    standalone: true,
        imports: [CommonModule, FormsModule, TableModule,ButtonModule, ConfirmDialogModule, ToastModule,],
    template: `
        <div *ngIf="groupes.length > 0" class="card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <div class="font-semibold text-xl mb-4">Pending Groups</div>
            <p-table [value]="groupes" [scrollable]="true" scrollHeight="400px" styleClass="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Group Name</th>
                        <th>Description</th>
                        <th>Creator</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-groupe>
                    <tr>
                        <td>{{ groupe.nom }}</td>
                        <td>{{ groupe.description }}</td>
                        <td>{{ groupe.createur?.username }}</td>
                        <td>
                            <div class="flex items-center justify-start gap-3 h-full">
                                <i class="pi pi-check text-green-500 cursor-pointer hover:text-green-700 text-lg"
                                (click)="confirmApprove(groupe.id)" title="Approve"></i>
                                <i class="pi pi-times text-red-500 cursor-pointer hover:text-red-700 text-lg"
                                (click)="confirmReject(groupe.id)" title="Reject"></i>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>
    `,
    providers: [ConfirmationService, MessageService]
})

export class PendingGroupListComponent implements OnInit {
    groupes: any[] = [];

    constructor(private groupeService: GroupeService ,private confirmationService: ConfirmationService,
        private messageService: MessageService ,  private actionLogService: ActionLogService ) {}

    ngOnInit(): void {
        this.loadPendingGroups();
    }

    loadPendingGroups() {
        this.groupeService.getPendingGroups().subscribe((data) => {
            console.log('Pending groups:', data);
            this.groupes = data;
            });
    }
    confirmApprove(id: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to approve this group?',
            header: 'Confirm Approval',
            icon: 'pi pi-check',
            accept: () => {
                this.groupeService.approveGroup(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Approved', detail: 'Group approved successfully' });
                        this.actionLogService.log('APPROVE_GROUP_SUCCESS', `Group ID ${id} approved`).subscribe({
                            next: () => console.log('Approve log sent'),
                            error: err => console.error('Error logging approve:', err)
                        });
                        this.loadPendingGroups();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve group' });
                    }
                });
            }
        });
    }

    confirmReject(id: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to reject this group?',
            header: 'Confirm Rejection',
            icon: 'pi pi-times',
            accept: () => {
                this.groupeService.rejectGroup(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Group rejected' });
                        this.actionLogService.log('REJECT_GROUP_SUCCESS', `Group ID ${id} rejected`).subscribe({
                            next: () => console.log('Reject log sent'),
                            error: err => console.error('Error logging reject:', err)
                        });
                        this.loadPendingGroups();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject group' });
                    }
                });
            }
        });
    }
}
