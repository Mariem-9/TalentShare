import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { ActionLogService } from '../../services/action-log.service';
import { GroupeService } from '../../services/GroupeService';

@Component({
    selector: 'app-create-group',
    standalone: true,
    imports: [FormsModule, CommonModule ,DialogModule, FloatLabelModule, ChipsModule, FileUploadModule, ButtonModule, InputTextModule, TextareaModule],
    template: `
        <p-dialog header="Create New Group" [(visible)]="visible" [modal]="true" [style]="{width: '40vw'}" (onHide)="onClose()">
        <div class="flex flex-col gap-8" style="padding-top: 1.5rem;">
            <p-floatlabel>
            <input pInputText id="groupName" type="text" [(ngModel)]="newGroup.nom" style="width: 100%;" />
            <label for="groupName">Group Name</label>
            </p-floatlabel>
            <p-floatlabel>
            <p-chips [(ngModel)]="newGroup.tags" id="groupTags" separator="," [style]="{ width: '100%' }" [addOnBlur]="true" />
            <label for="groupTags">Add Tags</label>
            </p-floatlabel>
            <p-floatlabel>
            <textarea pTextarea id="Description" [(ngModel)]="newGroup.description" [autoResize]="true" rows="3" cols="30" style="width: 100%;"></textarea>
            <label for="Description">Description</label>
            </p-floatlabel>
        </div>
        <hr class="my-4 border-t border-gray-300" />
        <div class="font-semibold text-xl mb-4" style="padding: 0.5rem;">Group Photo</div>
        <p-fileupload name="avatar" [customUpload]="true" [auto]="true" [multiple]="false" accept="image/*" maxFileSize="1000000" (uploadHandler)="uploadGroupAvatar($event)">
            <ng-template #empty>
            <div>Drag and drop files to here to upload.</div>
            </ng-template>
            <ng-template #content>
            <ul *ngIf="uploadedFiles.length">
                <li *ngFor="let file of uploadedFiles">{{ file.name }} - {{ file.size }} bytes</li>
            </ul>
            </ng-template>
        </p-fileupload>
        <ng-template pTemplate="footer">
            <div class="flex justify-end gap-2 w-full">
            <p-button icon="pi pi-check" severity="success" rounded outlined (click)="createGroup()"></p-button>
            <p-button icon="pi pi-times" severity="danger" rounded outlined (click)="close()"></p-button>
            </div>
        </ng-template>
        </p-dialog>
    `
    })
    export class CreateGroupComponent {
    visible = false;
    newGroup = { nom: '', description: '', tags: [] ,status: 'PENDING'};
    uploadedAvatarFile?: File;
    uploadedFiles: File[] = [];

    @Output() groupCreated = new EventEmitter<void>();
    @Output() dialogClosed = new EventEmitter<void>();

    constructor(private groupeService: GroupeService,private actionLogService: ActionLogService) {}

    show() {
        this.newGroup = { nom: '', description: '', tags: [] , status: 'PENDING'};
        this.uploadedFiles = [];
        this.uploadedAvatarFile = undefined;
        this.visible = true;
        }


    createGroup() {
        if (!this.newGroup.nom?.trim()) {
        alert('Group name is required!');
        return;
        }
        const request = this.groupeService.createGroupe(this.newGroup);
        request.subscribe({
        next: (group: any) => {
            this.actionLogService.log('CREATE_GROUP_SUCCESS', `Group ID ${group.id} created successfully`).subscribe({
                next: () => console.log('Group creation logged'),
                error: err => console.error('Logging failed:', err)
            });
            if (this.uploadedAvatarFile) {
            this.uploadGroupAvatarFile(group.id, this.uploadedAvatarFile);
            } else {
            this.close();
            this.groupCreated.emit();
            }
        },
        error: err => console.error('Group creation/update failed:', err)
        });
    }

    uploadGroupAvatar(event: any) {
        const file = event.files?.[0];
        if (file) {
        this.uploadedAvatarFile = file;
        this.uploadedFiles = [file];
        }
    }

    uploadGroupAvatarFile(groupId: number, file: File) {
        this.groupeService.uploadGroupAvatar(groupId, file).subscribe({
        next: () => {
            this.actionLogService.log('UPLOAD_AVATAR_SUCCESS', `Avatar uploaded for group ${groupId}`).subscribe({
                next: () => console.log('Avatar upload logged'),
                error: err => console.error('Logging failed:', err)
            });
            this.close();
            this.groupCreated.emit();
        },
        error: err => console.error('Group avatar upload failed:', err)
        });
    }

    close() {
        this.visible = false;
        this.newGroup = { nom: '', description: '', tags: [] , status: 'PENDING' };
        this.uploadedAvatarFile = undefined;
        this.uploadedFiles = [];
        this.dialogClosed.emit();
    }

    onClose() {
        this.close();
    }
}
