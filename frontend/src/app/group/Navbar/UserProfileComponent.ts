import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ActionLogService } from '../../services/action-log.service';
import { GroupeService } from '../../services/GroupeService';
import { ProfileService } from '../../services/profileService';


@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [DialogModule, SkeletonModule,CommonModule,FormsModule,FloatLabelModule,ChipsModule,InputTextModule,TextareaModule , InputSwitchModule],
    template: `
    <p-dialog [(visible)]="visible" [modal]="true" [style]="{width: '40vw'}" (onHide)="close.emit()">
        <ng-template pTemplate="header">
            <div class="flex items-center justify-center gap-2 w-full">
            <i class="pi pi-id-card text-lg text-primary"></i>
            <span class="text-lg font-semibold">ID Card</span>
            </div>
        </ng-template>
        <div class="rounded-border border border-surface p-6">
            <div *ngIf="!userProfile; else loadedProfile">
            <div class="flex mb-4">
                <p-skeleton shape="circle" size="4rem" styleClass="mr-2"></p-skeleton>
                <div>
                <p-skeleton width="10rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton height=".5rem"></p-skeleton>
                </div>
            </div>
            </div>

            <ng-template #loadedProfile>
                <div *ngIf="!isEditing; else editMode">
                    <div class="flex items-center gap-8 mb-8">
                        <div class="relative w-48 h-48 shrink-0">
                            <ng-container *ngIf="userProfile.avatarUrl; else defaultIcon">
                                <img [src]="avatarSrc" alt="avatar" class="w-full h-full object-cover rounded-full border border-gray-300" />
                            </ng-container>
                            <ng-template #defaultIcon>
                                <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600 border border-gray-300">
                                    <i class="pi pi-user"></i>
                                </div>
                            </ng-template>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold">{{ userProfile.nom }}</h2>
                             <p *ngIf="userProfile.bio; else noBio">{{ userProfile.bio }}</p>
                            <ng-template #noBio>
                            <p class="italic text-gray-400">No bio provided</p>
                            </ng-template>
                        </div>
                        <div> <button (click)="startEdit()" title="Edit" class="text-green-500 hover:text-green-700"> <i class="pi pi-pencil"></i> </button> </div>
                    </div>
                <div class="flex items-start gap-8 mb-2">
                    <p><strong>Email:</strong> {{ userProfile.email }}</p>
                    <p *ngIf="userProfile.location; else noLocation"><strong>Location:</strong> {{ userProfile.location }}</p>
                    <ng-template #noLocation>
                        <span class="italic text-gray-400">No location provided</span>
                    </ng-template>
                    </div>

                    <div *ngIf="userProfile.talents?.length ?? 0 > 0; else noTalents" class="mt-2 mb-2">
                        <strong>Talents:</strong>
                        <ul class="list-disc list-inside">
                            <li *ngFor="let talent of userProfile.talents">{{ talent }}</li>
                        </ul>
                    </div>
                    <ng-template #noTalents>
                    <p class="italic text-gray-400">No talents added</p>
                    </ng-template>

                    <div *ngIf="userProfile.skills?.length ?? 0> 0; else noSkills" class="mt-2 mb-2">
                        <strong>Skills:</strong>
                        <ul class="list-disc list-inside">
                            <li *ngFor="let skill of userProfile.skills">{{ skill }}</li>
                        </ul>
                    </div>
                    <ng-template #noSkills>
                    <p class="italic text-gray-400">No skills added</p>
                    </ng-template>

                    <div *ngIf="userProfile.languages?.length ?? 0 > 0; else noLanguages" class="mt-2 mb-2">
                        <strong>Languages:</strong>
                        <ul class="list-disc list-inside">
                            <li *ngFor="let lang of userProfile.languages">{{ lang }}</li>
                        </ul>
                    </div>
                    <ng-template #noLanguages>
                    <p class="italic text-gray-400">No languages added</p>
                    </ng-template>

                    <p *ngIf="!hasAdditionalInfo()" class="text-sm text-blue-500 italic mt-4">
                    You haven't completed your profile yet.
                    <span class="cursor-pointer underline" (click)="startEdit()">Click here to edit</span>
                    </p>
                </div>

                <ng-template #editMode>
                    <div class="flex items-center gap-4 mb-4">
                        <div class="relative w-48 h-48">
                            <img [src]="avatarSrc" alt="avatar" class="w-full h-full object-cover rounded-full border border-gray-300" *ngIf="userProfile.avatarUrl; else defaultIconEdit" />
                            <ng-template #defaultIconEdit>
                                <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600 border border-gray-300">
                                    <i class="pi pi-user"></i>
                                </div>
                            </ng-template>
                            <label class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100" (click)="showPrivacyToggle = true">
                            <i class="pi pi-pencil text-xs"></i>
                            <input type="file" hidden accept="image/*" (change)="onAvatarSelected($event)" />
                            </label>

                            <div *ngIf="showPrivacyToggle" class="absolute left-1/2 -bottom-6 transform -translate-x-1/2 text-gray-700 text-sm flex items-center gap-2 cursor-pointer"
                                (click)="avatarPrivate = !avatarPrivate"
                                [title]="avatarPrivate ? 'Avatar is Private. Click to make it Public.' : 'Avatar is Public. Click to make it Private.'">
                            <i class="pi" [ngClass]="avatarPrivate ? 'pi-lock text-red-500' : 'pi-globe text-green-500'"></i>
                            <span class="font-semibold">{{ avatarPrivate ? 'Private' : 'Public' }}</span>
                            </div>

                        </div>
                        <div class="flex flex-col flex-1 gap-8" style="padding-top: 1.5rem;">
                            <p-floatlabel><input pInputText  [(ngModel)]="editedProfile.nom" id="userNom" class="w-full mb-2 p-2 border rounded" /><label for="userNom">Nom</label></p-floatlabel>
                            <p-floatlabel><textarea pTextarea  [(ngModel)]="editedProfile.bio" id="userBio" class="w-full mb-2 p-2 border rounded" [autoResize]="true"  rows="3" cols="30" style="width: 100%;"  ></textarea><label for="userBio">Bio</label></p-floatlabel>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8" style="padding-top: 1.5rem;">
                        <p-floatlabel> <input pInputText [(ngModel)]="editedProfile.email" id="userEmail" class="w-full mb-2 p-2 border rounded" /><label for="userEmail">Email</label></p-floatlabel>
                        <p-floatlabel> <input pInputText [(ngModel)]="editedProfile.location"id="userLocation" class="w-full mb-2 p-2 border rounded" /><label for="userLocation">Location</label></p-floatlabel>
                        <p-floatlabel>
                        <p-chips [(ngModel)]="editedProfile.talents" id="userTalent" separator="," [style]="{ width: '100%' }">
                            <ng-template let-item pTemplate="item">
                            <span class="px-2 py-1 rounded-full text-gray text-sm mr-2" [ngStyle]="{ 'background-color': getRandomColor(item) ,  'margin-right': '0.5rem'}">
                                {{ item }}
                                <i class="pi pi-times cursor-pointer text-xs align-middle" style="font-size: 0.75rem;" (click)="removeChip(editedProfile.talents, item)"></i>
                            </span>
                            </ng-template>
                        </p-chips>
                        <label for="userTalent">Add Talents</label>
                        </p-floatlabel>
                        <p-floatlabel>
                        <p-chips [(ngModel)]="editedProfile.skills" id="userskill" separator="," [style]="{ width: '100%' }">
                            <ng-template let-item pTemplate="item">
                            <span class="px-2 py-1 rounded-full text-gray text-sm mr-2" [ngStyle]="{ 'background-color': getRandomColor(item) ,  'margin-right': '0.5rem'}">
                                {{ item }}
                                <i class="pi pi-times cursor-pointer text-xs align-middle" style="font-size: 0.75rem;" (click)="removeChip(editedProfile.skills, item)"></i>
                            </span>
                            </ng-template>
                        </p-chips>
                        <label for="userskill">Add Skills</label>
                        </p-floatlabel>
                        <p-floatlabel>
                        <p-chips [(ngModel)]="editedProfile.languages" id="userlanguages" separator="," [style]="{ width: '100%' }">
                            <ng-template let-item pTemplate="item">
                            <span class="px-2 py-1 rounded-full text-gray text-sm mr-2" [ngStyle]="{ 'background-color': getRandomColor(item) ,  'margin-right': '0.5rem'}">
                                {{ item }}
                                <i class="pi pi-times cursor-pointer text-xs align-middle" style="font-size: 0.75rem;" (click)="removeChip(editedProfile.languages, item)"></i>
                            </span>
                            </ng-template>
                        </p-chips>
                        <label for="userlanguages">Add Languages</label>
                        </p-floatlabel>

                        <div class="flex gap-4 mt-4 justify-end">
                            <i class="pi pi-check text-green-600 cursor-pointer text-xl" title="Save" (click)="saveProfile()"></i>
                            <i class="pi pi-times text-gray-600 cursor-pointer text-xl" title="Cancel" (click)="cancelEdit()"></i>
                        </div>
                    </div>
                </ng-template>
            </ng-template>
        </div>
    </p-dialog>
`
})
export class UserProfileComponent {
    @Input() visible = false;
    @Output() close = new EventEmitter<void>();
    avatarPrivate: boolean = false;
    showPrivacyToggle = false;


    userProfile: {
        nom?: string;
        email?: string;
        avatarUrl?: string;
        location?: string;
        bio?: string;
        talents: string[];
        skills: string[];
        languages: string[];
        } = {
        talents: [],
        skills: [],
        languages: []
    };
    switchValue: boolean = false;
    uploadedUserAvatarFile?: File;
    avatarSrc: string | undefined;
    isEditing = false;
    editedProfile: typeof this.userProfile = {
        nom: '',
        email: '',
        avatarUrl: '',
        location: '',
        bio: '',
        talents: [],
        skills: [],
        languages: []
    };
    hasAdditionalInfo(): boolean {
    return !!(
        this.userProfile.bio ||
        this.userProfile.location ||
        (this.userProfile.talents?.length ?? 0) > 0 ||
        (this.userProfile.skills?.length ?? 0) > 0 ||
        (this.userProfile.languages?.length ?? 0) > 0
    );
    }

        chipColors: { [key: string]: string } = {};
        removeChip(array: string[], value: string) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

getRandomColor(item: string): string {
    if (!this.chipColors[item]) {
        const colors = [
        '#FDE68A', // soft yellow
        '#A7F3D0', // soft green
        '#BFDBFE', // soft blue
        '#FBCFE8', // soft pink
        '#DDD6FE', // soft purple
        '#FFE4E6', // soft rose
        '#C7D2FE', // light indigo
        '#E0F2FE', // baby blue
        '#D1FAE5', // mint green
        '#FEF9C3'  // pale yellow
        ];
        this.chipColors[item] = colors[Math.floor(Math.random() * colors.length)];
    }
    return this.chipColors[item];
}


    constructor(private groupService: GroupeService , private profileService : ProfileService,private actionLogService: ActionLogService ) {}

    ngOnInit() {
        this.loadUserProfile();
    }

        onAvatarSelected(event: any) {
        const file = event.target.files?.[0];
        if (file) {
            this.uploadUserAvatar(file, this.avatarPrivate);
        }
    }

    uploadUserAvatar(file: File, isPrivate: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrivate', String(isPrivate));

    this.groupService.uploadUserAvatar(formData).subscribe({
        next: () => {
        this.actionLogService.log('UPLOAD_USER_AVATAR_SUCCESS', 'User avatar uploaded successfully').subscribe();
        this.loadUserProfile();
        },
        error: err => console.error('User avatar upload failed:', err)
    });
    }


    loadUserProfile() {
        this.profileService.getUserProfile().subscribe({
            next: profile => {
            this.userProfile = profile;

            if (profile.avatarUrl) {
                const id = this.extractIdFromAvatarUrl(profile.avatarUrl);
                this.loadAvatarBlob(id);
            }
            },
            error: err => console.error('Failed to load user profile:', err)
        });
        }

    extractIdFromAvatarUrl(url: string): number {
        // "/api/files/8", extract the '8'
        const parts = url.split('/');
        return Number(parts[parts.length - 1]);
    }

    loadAvatarBlob(id: number) {
        this.groupService.getUserAvatarBlob(id).subscribe({
            next: blob => {
            this.avatarSrc = URL.createObjectURL(blob);
            },
            error: err => {
            console.error('Failed to load avatar blob:', err);
            this.avatarSrc = undefined;
            }
        });
    }

    handleClose() {
        this.close.emit();
    }
    startEdit() {
        this.isEditing = true;
        this.editedProfile = JSON.parse(JSON.stringify(this.userProfile));
    }
    cancelEdit() {
        this.isEditing = false;
        this.editedProfile = {
        nom: '',
        email: '',
        avatarUrl: '',
        location: '',
        bio: '',
        talents: [],
        skills: [],
        languages: []
        };
    }
    saveProfile() {
    this.profileService.updateUserProfile(this.editedProfile).subscribe({
        next: updated => {
        this.userProfile = updated;
        this.isEditing = false;
        this.loadUserProfile();
        this.actionLogService.log('UPDATE_PROFILE_SUCCESS', `User profile updated for ${updated.nom || 'unknown user'}`).subscribe({
            next: () => console.log('Profile update logged'),
            error: err => console.error('Logging failed:', err)
            });

        },
        error: err => {
        console.error('Erreur de sauvegarde', err);
        }
    });

    }

}
