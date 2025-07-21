import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MessageService } from "primeng/api";
import { MessageModule } from "primeng/message";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ActionLogService } from "../../services/action-log.service";
import { GroupeService } from "../../services/GroupeService";

@Component({
    selector: 'app-group-details-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, FileUploadModule, ButtonModule,TagModule,InputTextModule,
        TextareaModule, MessageModule, ConfirmDialogModule, ToastModule],
    template: `
        <div class="col flex items-start justify-center h-full gap-4 p-4">
            <!-- Image or fallback icon -->
            <div (click)="isEditing && (showAvatarUpload = true)"
                class="w-36 h-36 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                <img *ngIf="avatarSrc; else fallbackIcon" [src]="avatarSrc" alt="Group Avatar"
                    class="w-full h-full object-cover" />
                <ng-template #fallbackIcon>
                <i class="pi pi-users"></i>
                </ng-template>
            </div>

            <!-- Avatar Upload Dialog -->
            <p-dialog header="Upload Group Photo" [(visible)]="showAvatarUpload" [modal]="true" [style]="{ width: '40vw' }">
                <p-fileupload name="avatar" [customUpload]="true" [auto]="true" [multiple]="false"
                            accept="image/*" maxFileSize="1000000" (uploadHandler)="uploadGroupAvatar($event)">
                <ng-template #empty>
                    <div>Drag and drop files here to upload.</div>
                </ng-template>
                <ng-template #content>
                    <ul *ngIf="uploadedFiles.length">
                    <li *ngFor="let file of uploadedFiles">{{ file.name }} - {{ file.size }} bytes</li>
                    </ul>
                </ng-template>
                </p-fileupload>
            </p-dialog>
            <div class="flex flex-col gap-4 w-full">
                <!-- Editable fields -->
                <div *ngIf="isEditing; else viewMode">
                    <input [(ngModel)]="editedGroup.nom" class="font-bold text-xl" style="border:none; outline:none;" />
                    <textarea  pTextarea [(ngModel)]="editedGroup.description" class="text-gray-600 mt-2" style="border:none; outline:none;" [autoResize]="true"  rows="3" cols="30" style="width: 100%;"></textarea>

                    <!-- Edit mode: editable tags -->
                    <div class="flex flex-wrap gap-2 items-center">
                        <p-tag *ngFor="let tag of editedGroup.tags; let i = index" [value]="tag" [rounded]="true" severity="info">
                            <i class="pi pi-times-circle ml-2 cursor-pointer" (click)="removeTag(i)"></i>
                        </p-tag>
                        <input type="text" placeholder="Add tag" [(ngModel)]="newTag" (keydown.enter)="addTag()" class="border rounded px-2 py-1" style="border:none; outline:none;"/>
                    </div>

                    <!-- Save / Cancel icons now moved under tags -->
                    <div class="flex gap-4 mt-2 justify-end">
                        <i class="pi pi-check text-green-600 cursor-pointer text-xl" title="Save" (click)="saveGroup()"></i>
                        <i class="pi pi-times text-gray-600 cursor-pointer text-xl" title="Cancel" (click)="cancelEditGroup()"></i>
                    </div>
                </div>
                <!-- View mode -->
                <ng-template #viewMode>
                    <div class="flex flex-col text-left">
                        <h2 class="text-3xl font-bold">{{ group?.nom }}</h2>
                        <p class="mt-2 text-gray-600">{{ group?.description }}</p>
                    </div>
                </ng-template>

                <!-- Tags in view mode -->
             <div *ngIf="!isEditing">
                <div *ngIf="group?.tags?.length > 0" class="flex flex-wrap gap-2">
                    <p-tag *ngFor="let tag of group?.tags" [value]="tag" [rounded]="true" severity="info"></p-tag>
                </div>
                <div *ngIf="!group?.tags || group.tags.length === 0" class="text-gray-400 italic">
                    No tags available.
                </div>
            </div>

            </div>
            <!-- Actions -->
            <ng-container *ngIf="isCreator">
                <button (click)="startEditGroup()" title="Editer" class="text-green-500 hover:text-green-700"> <i class="pi pi-pencil"></i> </button>
                <button (click)="onDeleteGroup()" title="Delete Group" class="text-red-500 hover:text-red-700"> <i class="pi pi-trash"></i> </button>
            </ng-container>
            <ng-container *ngIf="!isCreator && !isMember && !isPending">
                <button (click)="joinGroup()" title="Join the group" class="text-blue-500 hover:text-blue-700"> <i class="pi pi-user-plus"></i> </button>
            </ng-container>
            <ng-container *ngIf="isPending"> <span class="text-gray-400 italic">Pending Request</span> </ng-container>
            <ng-container *ngIf="!isCreator && isMember">
                <button (click)="leaveGroup()" title="Leave the group" class="text-orange-500 hover:text-orange-700"> <i class="pi pi-sign-out"></i> </button>
            </ng-container>
        </div>
        <p-confirmDialog></p-confirmDialog>
        <p-toast></p-toast>

    `,
    providers: [ConfirmationService, MessageService]
})
export class GroupDetailsWidget implements OnInit {
    @Input() groupId!: number;
    @Output() membershipChanged = new EventEmitter<void>();


    group: any;
    avatarSrc?: string;
    isCreator: boolean = false;
    isMember: boolean = false;
    isPending: boolean = false;
    isEditing = false;
    editedGroup: any = {};
    showAvatarUpload = false;
    uploadedFiles: File[] = [];
    newTag: string = '';

    constructor(private groupeService: GroupeService, private router: Router, private messageService: MessageService,
                private confirmationService: ConfirmationService , private actionLogService: ActionLogService) {}


    messageVisible = false;
    messageText = 'Profile updated!';
    messageSeverity: 'success' | 'info' | 'warn' | 'error' = 'success';


    ngOnInit() {
        if (this.groupId) {
            this.loadGroup(this.groupId);
            this.checkUserMembership(this.groupId);
        }
    }

    loadGroup(id: number) {
        this.groupeService.getGroupeById(id).subscribe(group => {
        this.group = group;
        if (group.avatarUrl) {
            const avatarId = this.extractIdFromAvatarUrl(group.avatarUrl);
            this.loadAvatarBlob(avatarId);
        }
        });

        this.groupeService.isUserGroupCreator(id).subscribe({
        next: result => this.isCreator = result,
        error: err => {
            console.error('Error checking group creator:', err);
            this.isCreator = false;
        }
        });
    }

    extractIdFromAvatarUrl(url: string): number {
        const parts = url.split('/');
        return Number(parts[parts.length - 1]);
    }

    loadAvatarBlob(id: number) {
        this.groupeService.getUserAvatarBlob(id).subscribe({
        next: blob => this.avatarSrc = URL.createObjectURL(blob),
        error: err => {
            console.error('Failed to load avatar blob:', err);
            this.avatarSrc = undefined;
        }
        });
    }

    onDeleteGroup() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this group?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
        this.groupeService.deleteGroupe(this.groupId).subscribe({
            next: () => {
            this.actionLogService.log('DELETE_GROUP', `Group ID ${this.groupId} deleted`).subscribe({
                next: () => console.log('Delete group action logged'),
                error: err => console.error('Logging error:', err)
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Group deleted successfully'
            });
            this.router.navigate(['/home']);
            },
            error: err => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete group'
            });
            }
        });
        }
    });
    }


    startEditGroup() {
        this.isEditing = true;
        this.editedGroup = { ...this.group,tags: [...(this.group.tags || [])] };
        if (!this.editedGroup.tags) { this.editedGroup.tags = [];}
    }

    cancelEditGroup() {
        this.isEditing = false;
        this.editedGroup = {};
        this.showAvatarUpload = false;
    }

    saveGroup() {

    const cleanGroup = {
        nom: this.editedGroup.nom,
        description: this.editedGroup.description,
        tags: Array.isArray(this.editedGroup.tags) ? this.editedGroup.tags : []
    };

    this.groupeService.updateGroupe(this.groupId, cleanGroup).subscribe({
        next: updated => {
            this.group = updated;
            this.isEditing = false;
            setTimeout(() => {
                this.actionLogService.log('UPDATE_GROUP_SUCCESS', `Group ID ${this.groupId} updated`).subscribe({
                    error: err => console.error('Logging error:', err)
                });
            }, 0);
        },
        error: err => console.error('Update failed:', err)
    });
    }

    uploadGroupAvatar(event: any) {
        const file = event.files[0];
        if (file) {
        this.groupeService.uploadGroupAvatar(this.groupId, file).subscribe({
            next: () => {
            this.groupeService.getGroupeById(this.groupId).subscribe(updatedGroup => {
                this.group = updatedGroup;
                const avatarId = this.extractIdFromAvatarUrl(this.group.avatarUrl);
                this.loadAvatarBlob(avatarId);
                this.showAvatarUpload = false;
                this.uploadedFiles = [];
                this.actionLogService.log('UPLOAD_GROUP_AVATAR_SUCCESS', `Avatar updated for group ID ${this.groupId}`).subscribe({
                    next: () => console.log('Upload avatar action logged'),
                    error: err => console.error('Logging error:', err)
                });
            });
            },
            error: err => {
            console.error('Avatar upload failed:', err);
            this.uploadedFiles = [];
            }
        });
        }
    }

    addTag() {
    if (this.newTag?.trim() && !this.editedGroup.tags.includes(this.newTag.trim())) {
        this.editedGroup.tags.push(this.newTag.trim());
    }
    this.newTag = '';
    }

    removeTag(index: number) {
    this.editedGroup.tags.splice(index, 1);
    }

    checkUserMembership(groupId: number) {
    this.groupeService.checkMembershipStatus(groupId).subscribe({
        next: status => {
        this.isMember = status === 'MEMBER';
        this.isPending = status === 'PENDING';
        },
        error: err => {
        console.error('Erreur statut membre :', err);
        this.isMember = false;
        this.isPending = false;
        }
    });
    }

    joinGroup() {
    this.groupeService.joinGroup(this.groupId).subscribe({
        next: () => {
            this.actionLogService.log('JOIN_GROUP', `Joined group ID ${this.groupId}`).subscribe({
                next: () => console.log('Join group action logged'),
                error: err => console.error('Logging error:', err)
            });
            this.checkUserMembership(this.groupId);
        },
        error: err => {
            console.error('Join error:', err);
        }
    });
    }

    leaveGroup() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to leave this group?',
        header: 'Leave Group',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Leave',
        rejectLabel: 'Cancel',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
        this.groupeService.leaveGroup(this.groupId).subscribe({
            next: () => {
            this.actionLogService.log('LEAVE_GROUP', `Left group ID ${this.groupId}`).subscribe({
                next: () => console.log('Leave group action logged'),
                error: err => console.error('Logging error:', err)
            });
            this.messageService.add({
                severity: 'success',
                summary: 'Left Group',
                detail: 'You have left the group'
            });
            this.checkUserMembership(this.groupId);
            this.membershipChanged.emit();
            },
            error: err => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to leave the group'
            });
            }
        });
        }
    });
    }


}
