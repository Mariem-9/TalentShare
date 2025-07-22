import { Component, OnInit, } from '@angular/core';
import { GroupeService } from '../../services/GroupeService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ActionLogService } from '../../services/action-log.service';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';


@Component({
    selector: 'app-pending-group-list',
    standalone: true,
        imports: [CommonModule, FormsModule, TableModule,ButtonModule, ConfirmDialogModule, ToastModule,AvatarModule,TagModule],
    template: `
        <div *ngIf="groupes.length > 0" class="card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <div class="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-white rounded-lg p-4 mb-6 font-extrabold text-2xl text-center drop-shadow-md">
                Groups Awaiting Approval
            </div>
            <img src="assets/images/pending_request.jpg" alt="pending_request" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
            <p-table [value]="groupes" [scrollable]="true" scrollHeight="400px" styleClass="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th class="font-bold text-lg" style="width: 180px;">Group Title</th>
                        <th class="font-bold text-lg" style="width: 110px;">Created By</th>
                        <th class="font-bold text-lg">Group Overview</th>
                        <th class="font-bold text-lg">Manage</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-groupe>
                    <tr >
                        <td style="padding: 20px 10px;">
                        <div class="flex items-center gap-2">
                            <p-avatar *ngIf="groupe.avatarSafeUrl; else defaultGroupAvatarGroup" [image]="groupe.avatarSafeUrl"
                            shape="circle" styleClass="bg-primary" [style.width.px]="48" [style.height.px]="48"> </p-avatar>
                            <ng-template #defaultGroupAvatarGroup>
                                <p-avatar [label]="groupe.nom?.charAt(0).toUpperCase() || '?'" shape="circle"
                                    styleClass="bg-secondary" [style.width.px]="40" [style.height.px]="40">
                                </p-avatar>
                            </ng-template>
                            <span>{{ groupe.nom }}</span>
                        </div>
                        </td>
                        <td class="text-center">
                            <div class="flex justify-center">
                                <p-tag [value]="groupe.createur?.username || 'Unknown'" [severity]="groupe.randomSeverity" class="text-base font-semibold"> </p-tag>
                            </div>
                        </td>
                        <td >{{ groupe.description }}</td>
                        <td >
                            <div class="flex items-center justify-start gap-3 h-full">
                                <button pButton type="button" icon="pi pi-check" class="p-button p-button-sm p-button-outlined p-button-success"
                                (click)="confirmApprove(groupe.id)" title="Approve" aria-label="Approve" > Approve </button>
                                <button pButton type="button" icon="pi pi-times" class="p-button p-button-sm p-button-outlined p-button-danger"
                                (click)="confirmReject(groupe.id)" title="Reject" aria-label="Reject" > Reject </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '500px'}"></p-confirmDialog>
    `,
    providers: [ConfirmationService, MessageService]
})

export class PendingGroupListComponent implements OnInit {
    groupes: any[] = [];
    groupSeverities = new Map<string, string>();

    constructor(private groupeService: GroupeService ,private confirmationService: ConfirmationService,
        private messageService: MessageService ,  private actionLogService: ActionLogService ) {}

    ngOnInit(): void {
        this.loadPendingGroups();
    }

    getRandomSeverity(): string {
        const severities = ['success', 'info', 'warning', 'danger', 'help'];
        const randomIndex = Math.floor(Math.random() * severities.length);
        return severities[randomIndex];
    }

    extractIdFromAvatarUrl(url: string): number {
        // "/api/files/8", extract the '8'
        const parts = url.split('/');
        return Number(parts[parts.length - 1]);
    }


    loadPendingGroups() {
    this.groupeService.getPendingGroups().subscribe((data) => {
        console.log('Pending groups loaded:', data);
        this.groupes = data;

        this.groupes.forEach((groupe) => {
        console.log('Processing group:', groupe.nom);
        console.log('Group avatarUrl:', groupe.avatarUrl);
        groupe.randomSeverity = this.getRandomSeverity();

        if (groupe.avatarUrl) {
            const avatarId = this.extractIdFromAvatarUrl(groupe.avatarUrl);
            console.log(`Extracted avatarId for group "${groupe.nom}":`, avatarId);

            if (avatarId) {
            this.groupeService.getUserAvatarBlob(avatarId).subscribe({
                next: (blob) => {
                const url = URL.createObjectURL(blob);
                console.log(`Blob URL created for group "${groupe.nom}":`, url);
                groupe.avatarSafeUrl = url;
                },
                error: (err) => {
                console.error(`Failed to load group avatar blob for "${groupe.nom}":`, err);
                groupe.avatarSafeUrl = undefined;
                },
            });
            } else {
            console.warn(`Invalid avatarId extracted from avatarUrl for group "${groupe.nom}"`);
            }
        } else {
            console.warn(`No avatarUrl found for group "${groupe.nom}"`);
        }
        });
    }, (err) => {
        console.error('Error loading pending groups:', err);
    });
    }

    confirmApprove(id: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to approve this group?',
            header: 'Confirm Approval',
            icon: 'pi pi-check',
            acceptLabel: 'Cancel',
            rejectLabel: 'Approve',
            acceptButtonStyleClass: 'p-button-danger',
            closable: false,
            dismissableMask: false,
            reject: () => {
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
            acceptLabel: 'Cancel',
            rejectLabel: 'Reject',
            acceptButtonStyleClass: 'p-button-danger',
            closable: false,
            dismissableMask: false,
            reject: () => {
                this.groupeService.rejectGroup(id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Group rejected' });
                    this.actionLogService.log('REJECT_GROUP_SUCCESS', `Group ID ${id} rejected`).subscribe();
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
