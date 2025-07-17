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
import { ChipModule } from 'primeng/chip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
    selector: 'app-pending-group-list',
    standalone: true,
        imports: [CommonModule, FormsModule, TableModule,ButtonModule, ConfirmDialogModule, ToastModule,ChipModule,ToggleButtonModule],
    template: `
        <div *ngIf="groupes.length > 0" class="card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <div class="flex items-center mb-6">
                <h1 class="text-2xl font-semibold text-gray-600 flex items-center gap-2">
                    <i class="pi pi-clock text-orange-400 " style="font-size: 1.75rem;"></i>
                    Groups Awaiting Approval
                </h1>
            </div>
            <p-table [value]="groupes" [scrollable]="true" scrollHeight="400px" styleClass="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 25%; font-size: 1.3rem;">Group Title</th>
                        <th style="width: 45%; font-size: 1.3rem;">Group Overview</th>
                        <th style="width: 15%; font-size: 1.3rem;">Created By</th>
                        <th style="width: 15%; font-size: 1.3rem;">Manage</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-groupe>
                    <tr >
                        <td style="padding: 20px 10px;font-size: 1.1rem;">{{ groupe.nom }}</td>
                        <td style="padding: 20px 10px;font-size: 1.1rem;">{{ groupe.description }}</td>
                        <!-- <td>{{ groupe.createur?.username }}</td> -->
                        <td style="padding: 20px 10px;">
                            <!--
                            <p-chip
                                *ngIf="groupe.createur"
                                [label]="groupe.createur.username"
                                [image]="groupe.createur.avatarSafeUrl || undefined"
                                styleClass="m-1">
                            </p-chip> -->
                            <p-chip class="m-1">
  <ng-template pTemplate="content">
    <div class="flex items-center gap-2">
      <ng-container *ngIf="groupe.createur?.avatarSafeUrl; else defaultIcon">
        <img [src]="groupe.createur.avatarSafeUrl"
             alt="avatar"
             class="w-6 h-6 object-cover rounded-full border border-gray-300" />
      </ng-container>
      <ng-template #defaultIcon>
        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 border border-gray-300">
          <i class="pi pi-user text-xs"></i>
        </div>
      </ng-template>
      <span class="text-sm">{{ groupe.createur?.username }}</span>
    </div>
  </ng-template>
</p-chip>

                        </td>

                        <td style="padding: 20px 10px;">
                            <div class="flex gap-5 items-center justify-start">
                                <!-- <p-button
                                    icon="pi pi-check"
                                    severity="success"
                                    rounded

                                    (onClick)="confirmApprove(groupe.id)"
                                    styleClass="p-button p-button-lg px-4"
                                    tooltip="Approve">
                                </p-button>

                                <p-button
                                    icon="pi pi-times"
                                    severity="danger"
                                    rounded

                                    (onClick)="confirmReject(groupe.id)"
                                    styleClass="p-button p-button-lg px-4"
                                    tooltip="Reject">
                                </p-button>
                                </div> -->
                            <button
            (click)="confirmApprove(groupe.id)"
            class="h-10 w-10 rounded-full flex items-center justify-center transition-all border-2"
            style="background: #ECFDF5; color: #059669; border-color: #059669; box-shadow: 0 2px 4px rgba(0,0,0,0.05)">
            <i class="pi pi-check"></i>
        </button>

        <!-- Reject Button -->
        <button
            (click)="confirmReject(groupe.id)"
            class="h-10 w-10 rounded-full flex items-center justify-center transition-all border-2"
            style="background: #FEF2F2; color: #DC2626; border-color: #DC2626; box-shadow: 0 2px 4px rgba(0,0,0,0.05)">
            <i class="pi pi-times"></i>
        </button>

    </div>

                            <!-- <div class="flex items-center justify-start gap-3 h-full">
                                <i class="pi pi-check text-green-500 cursor-pointer hover:text-green-700 text-lg"
                                (click)="confirmApprove(groupe.id)" title="Approve"></i>
                                <i class="pi pi-times text-red-500 cursor-pointer hover:text-red-700 text-lg"
                                (click)="confirmReject(groupe.id)" title="Reject"></i>
                            </div> -->
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <p-toast></p-toast>
    <p-confirmDialog
  [style]="{ 'min-width': '400px', 'width': '500px', 'font-size': '1.1rem' }"
  header="Confirm Action"
  icon="pi pi-exclamation-triangle"
  appendTo="body"
  [rejectVisible]="false"
  [acceptVisible]="false"
>
  <ng-template pTemplate="footer" let-accept let-reject>
  <div style="display: flex; justify-content: flex-start; gap: 8px; align-items: center;">
    <button
      pButton
      type="button"
      label="Yes"
      class="p-button-success"
      (click)="accept()"
      style="min-width: 100px;"
    ></button>

    <button
      pButton
      type="button"
      label="No"
      class="p-button-danger p-button-outlined"
      (click)="reject()"
      style="min-width: 100px;"
    ></button>
  </div>
</ng-template>

</p-confirmDialog>





    `,
    providers: [ConfirmationService, MessageService]
})

export class PendingGroupListComponent implements OnInit {
    groupes: any[] = [];
    displayConfirm: boolean = false;

accept() {
  this.displayConfirm = false;
  // your accept logic here
}

reject() {
  this.displayConfirm = false;
  // your reject logic here
}


    constructor(private groupeService: GroupeService ,private confirmationService: ConfirmationService,
        private messageService: MessageService ,  private actionLogService: ActionLogService ) {}

    ngOnInit(): void {
        this.loadPendingGroups();
    }


    extractIdFromAvatarUrl(url: string): number {
        // "/api/files/8", extract the '8'
        const parts = url.split('/');
        return Number(parts[parts.length - 1]);
    }

    loadPendingGroups() {
        this.groupeService.getPendingGroups().subscribe((data) => {
            console.log('Pending groups:', data);
            this.groupes = data;
        this.groupes.forEach((groupe) => {
    if (!groupe.createur || !groupe.avatarUrl) return;

    const avatarId = this.extractIdFromAvatarUrl(groupe.avatarUrl);

    if (avatarId) {
        this.groupeService.getUserAvatarBlob(avatarId).subscribe({
            next: blob => {
                const url = URL.createObjectURL(blob);
                groupe.createur.avatarSafeUrl = url;
            },
            error: err => {
                console.error(`Erreur chargement avatar pour ${groupe.createur.username}`, err);
                groupe.createur.avatarSafeUrl = undefined;
            }
        });
    }
});

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
