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
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [DialogModule, SkeletonModule,CommonModule,FormsModule,FloatLabelModule,ChipsModule,InputTextModule,TextareaModule ,
        InputSwitchModule, MultiSelectModule,AutoCompleteModule,ButtonModule],
    template: `
    <p-dialog [(visible)]="visible" [modal]="true" [style]="{width: '50vw'}" (onHide)="close.emit()">
        <ng-template pTemplate="header">
            <div class="flex items-center justify-center gap-2 w-full">
                <button pButton icon="pi pi-id-card" class="p-button-text p-button-lg p-button-secondary" disabled></button>
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
                        <div class="space-y-1">
                            <h2 class="text-lg font-bold m-0">{{ userProfile.nom }}</h2>
                            <div class="flex items-center space-x-4 text-gray-700 text-sm">
                                <span>{{ userProfile.email }}</span>
                                <span *ngIf="userProfile.location" class="text-gray-400">|</span>
                                <span *ngIf="userProfile.location">{{ userProfile.location }}</span>
                            </div>
                             <p *ngIf="userProfile.bio; else noBio">{{ userProfile.bio }}</p>
                            <ng-template #noBio>
                                <p class="italic text-gray-400">You haven’t added any bio information yet.
                                    Take a moment to introduce yourself — it helps others know who you are and what you’re passionate about.
                                    Just click the “Edit” button to get started!</p>
                            </ng-template>
                        </div>
                        <div> <button pButton type="button" icon="pi pi-pencil" label="Edit" class="p-button p-button-sm p-button-outlined p-button-info"
                            (click)="startEdit()" title="Edit"> </button> </div>
                        </div>
                        <div class="mb-4">
                            <div *ngIf="(userProfile.talents?.length ?? 0) > 0 || (userProfile.skills?.length ?? 0) > 0 || (userProfile.languages?.length ?? 0) > 0">
                                <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2"> Profile Highlights: </h3>
                                <div class="flex flex-wrap gap-2">
                                <span *ngFor="let talent of userProfile.talents"
                                        [ngStyle]="{
                                        'background-color': getRandomColor(talent),
                                        'border': '1px solid ' + getRandomColor(talent)
                                        }"
                                        class="text-sm font-medium px-2 py-0.5 rounded-full">
                                    {{ talent }}
                                </span>
                                <span *ngFor="let skill of userProfile.skills"
                                        [ngStyle]="{
                                        'background-color': getRandomColor(skill),
                                        'border': '1px solid ' + getRandomColor(skill)
                                        }"
                                        class="text-sm font-medium px-2 py-0.5 rounded-full">
                                    {{ skill }}
                                </span>
                                <span *ngFor="let lang of userProfile.languages"
                                        [ngStyle]="{
                                        'background-color': getRandomColor(lang),
                                        'border': '1px solid ' + getRandomColor(lang)
                                        }"
                                        class="text-sm font-medium px-2 py-0.5 rounded-full">
                                    {{ lang }}
                                </span>
                                </div>

                            </div>
                        </div>
                    <div *ngIf="!(userProfile.talents?.length ?? 0 > 0) &&  !(userProfile.skills?.length ?? 0 > 0) &&  !(userProfile.languages?.length ?? 0 > 0)"
                    class="flex items-center justify-center gap-3 italic text-center text-gray-400 mt-4 px-4">
                        <button pButton icon="pi pi-info-circle" class="p-button-text p-button-lg p-button-info" disabled></button>
                        <div>It looks like you haven't added any talents, skills, or languages yet. Start by updating your profile to let others know more about you!</div>
                    </div>
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
                            <p-autocomplete [style]="{ width: '100%' }" [(ngModel)]="editedProfile.talents" [suggestions]="talentSuggestions"
                            placeholder="" dropdown multiple  display="chip" (completeMethod)="filterTalents($event)"
                            (keydown.enter)="onTalentInput($event)" (blur)="onTalentInput($event)" >
                            <ng-template let-item pTemplate="selectedItem">
                                <span class="px-2 py-1 rounded-full text-gray-700 text-sm mr-2"
                                    [ngStyle]="{ 'background-color': getRandomColor(item), 'margin-right': '0.5rem' }">
                                {{ item }}
                                <i class="pi pi-times cursor-pointer text-xs align-middle"
                                    style="font-size: 0.75rem;"
                                    (click)="removeChip(editedProfile.talents, item)">
                                </i>
                                </span>
                            </ng-template>
                            </p-autocomplete>
                            <label for="talentInput">Add Talents</label>
                        </p-floatlabel>
                        <p-floatlabel>
                            <p-autocomplete [style]="{ width: '100%' }" [(ngModel)]="editedProfile.skills" [suggestions]="skillSuggestions"
                                placeholder=" " dropdown multiple display="chip" (completeMethod)="filterSkills($event)"
                                (keydown.enter)="onSkillInput($event)" (blur)="onSkillInput($event)" inputId="skillInput" >
                                <ng-template let-item pTemplate="selectedItem">
                                <span class="px-2 py-1 rounded-full text-gray-700 text-sm mr-2"
                                        [ngStyle]="{ 'background-color': getRandomColor(item), 'margin-right': '0.5rem' }">
                                    {{ item }}
                                    <i class="pi pi-times cursor-pointer text-xs align-middle"
                                    style="font-size: 0.75rem;"
                                    (click)="removeChip(editedProfile.skills, item)">
                                    </i>
                                </span>
                                </ng-template>
                            </p-autocomplete>
                            <label for="skillInput">Add Skills</label>
                        </p-floatlabel>
                        <p-floatlabel>
                            <p-autocomplete class="w-full" [style]="{ width: '100%' }" [(ngModel)]="editedProfile.languages" [suggestions]="languageSuggestions"
                                placeholder=" " dropdown multiple display="chip" (completeMethod)="filterLanguages($event)"
                                (keydown.enter)="onLanguageInput($event)" (blur)="onLanguageInput($event)" inputId="languageInput" >
                                <ng-template let-item pTemplate="selectedItem">
                                <span class="px-2 py-1 rounded-full text-gray-700 text-sm mr-2"
                                        [ngStyle]="{ 'background-color': getRandomColor(item), 'margin-right': '0.5rem' }">
                                    {{ item }}
                                    <i class="pi pi-times cursor-pointer text-xs align-middle"
                                    style="font-size: 0.75rem;"
                                    (click)="removeChip(editedProfile.languages, item)">
                                    </i>
                                </span>
                                </ng-template>
                            </p-autocomplete>
                            <label for="languageInput">Add Languages</label>
                        </p-floatlabel>
                        <div class="flex gap-4 mt-4 justify-end">
                            <button pButton type="button" icon="pi pi-check" label="Save"class="p-button p-button-sm p-button-outlined p-button-success"
                                (click)="saveProfile()" title="Save">
                            </button>
                            <button pButton  type="button" icon="pi pi-times" label="Cancel" class="p-button p-button-sm p-button-outlined p-button-secondary"
                                (click)="cancelEdit()" title="Cancel"> </button>
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

    talentSuggestions: string[] = [];
    allTalentOptions: { name: string }[] = []; // loaded from API
    skillSuggestions: string[] = [];
    languageSuggestions: string[] = [];
    allSkillOptions: { name: string }[] = [];
    allLanguageOptions: { name: string }[] = [];
    chipColors: { [key: string]: string } = {};


    constructor(private groupService: GroupeService , private profileService : ProfileService,private actionLogService: ActionLogService ) {}

    ngOnInit() {
        this.loadUserProfile();
        this.profileService.getTalentOptions().subscribe(talents => {
            this.allTalentOptions = talents.map(t => ({ name: t }));
        });

        this.profileService.getSkillOptions().subscribe(skills => {
            this.allSkillOptions = skills.map(s => ({ name: s }));
        });

        this.profileService.getLanguageOptions().subscribe(langs => {
            this.allLanguageOptions = langs.map(l => ({ name: l }));
        });
    }
    startEdit() {
        this.isEditing = true;
        this.editedProfile = JSON.parse(JSON.stringify(this.userProfile));
    }

    filterItems(event: any, allOptions: any[], setSuggestions: (s: string[]) => void) {
        const query = event.query.toLowerCase();
        const suggestions = allOptions
            .map(o => o.name)
            .filter(name => name.toLowerCase().includes(query));
        setSuggestions(suggestions);
    }

    onInput(event: any, targetList: string[]) {
        const value = event.target.value?.trim();
        if (value && !targetList.includes(value)) {
            targetList.push(value);
        }
        event.target.value = '';
    }
    filterTalents(event: any) {
    this.filterItems(event, this.allTalentOptions, suggestions => this.talentSuggestions = suggestions);
    }

    filterSkills(event: any) {
    this.filterItems(event, this.allSkillOptions, suggestions => this.skillSuggestions = suggestions);
    }

    filterLanguages(event: any) {
    this.filterItems(event, this.allLanguageOptions, suggestions => this.languageSuggestions = suggestions);
    }

    onTalentInput(event: any) {
    this.onInput(event, this.editedProfile.talents);
    }

    onSkillInput(event: any) {
    this.onInput(event, this.editedProfile.skills);
    }

    onLanguageInput(event: any) {
    this.onInput(event, this.editedProfile.languages);
    }
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

}
