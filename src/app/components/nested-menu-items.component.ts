import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule} from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';
import { GroupeService } from '../services/GroupeService';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ChipsModule } from 'primeng/chips';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-nested-menu',
    standalone: true,
    imports: [RouterModule,CommonModule,FormsModule,ButtonModule,BreadcrumbModule,IconFieldModule, MenubarModule,InputIconModule, MenuModule,
        DialogModule, FloatLabelModule,TextareaModule,InputTextModule,SkeletonModule, TagModule,ChipsModule,ListboxModule,FileUploadModule],
    template: `
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <p-menubar [model]="nestedMenuItems">
                        <ng-template #end>
                            <p-iconfield>
                                <p-inputicon class="pi pi-search" />
                                <input type="text" pInputText  [(ngModel)]="searchText" (ngModelChange)="filterGroups()" placeholder="Search groups..." />
                            </p-iconfield>
                        </ng-template>
                    </p-menubar>
                </div>
            </div>
            <div *ngIf="searchText.trim() !== '' && filteredGroups.length > 0" class="col-span-12 xl:col-span-6 mt-6">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Search Results</div>
                    <p-listbox [(ngModel)]="selectedGroup" [options]="filteredGroups" optionLabel="nom" [filter]="false" [style]="{ width: '100%' }">
                    </p-listbox>
                </div>
            </div>
        <p-dialog header="Create New Group" [(visible)]="showCreateGroupDialog" [modal]="true" [style]="{width: '40vw'}">
            <div class="flex flex-col gap-8" style="padding-top: 1.5rem;">
                <p-floatlabel>
                    <input pInputText id="groupName" type="text" [(ngModel)]="newGroup.nom" style="width: 100%;" />
                    <label for="groupName">Group Name</label>
                    <!-- add that it must be not null -->
                </p-floatlabel>
                <p-floatlabel>
                    <p-chips [(ngModel)]="newGroup.tags" id="groupTags" separator="," [style]="{ width: '100%' }" [addOnBlur]="true" />
                    <label for="groupTags">Add Tags</label>
                </p-floatlabel>

                <!-- <div class="mt-4 font-semibold">Preview Tags</div>
                <div class="flex flex-wrap gap-2">
                     <p-tag *ngFor="let tag of newGroup.tags" [value]="tag" [rounded]="true" severity="info"></p-tag>
                </div> -->
                <p-floatlabel>
                    <textarea pTextarea id="Description" [(ngModel)]="newGroup.description" [autoResize]="true" rows="3" cols="30" style="width: 100%;"></textarea>
                    <label for="Description">Description</label>
                </p-floatlabel>
            </div>
                <hr class="my-4 border-t border-gray-300" />
                <div class="font-semibold text-xl mb-4" style="padding: 0.5rem;">Group Photo</div>
                <p-fileupload name="demo[]" (onUpload)="onUpload($event)" [multiple]="true" accept="image/*" maxFileSize="1000000" mode="advanced" url="https://www.primefaces.org/cdn/api/upload.php" >
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
                    <p-button icon="pi pi-times" severity="danger" rounded outlined (click)="showCreateGroupDialog = false"></p-button>
                </div>
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="showProfileDialog" [modal]="true" [style]="{width: '40vw'}" (onHide)="showProfileDialog = false">
            <ng-template pTemplate="header">
                <div class="flex items-center justify-center gap-2 w-full">
                    <i class="pi pi-id-card text-lg text-primary"></i>
                    <span class="text-lg font-semibold">ID Card</span>
                </div>
            </ng-template>
            <div class="rounded-border border border-surface p-6">
                <div *ngIf="!userProfile; else loadedProfile">
                    <!-- Skeleton while loading -->
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
                    <div class="flex items-center gap-4">
                        <ng-container *ngIf="userProfile.avatarUrl; else defaultIcon">
                        <img [src]="userProfile.avatarUrl" alt="avatar" width="64" height="64" class="rounded-full border border-gray-300" />
                        </ng-container>
                        <ng-template #defaultIcon>
                        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-600 border border-gray-300">
                            <i class="pi pi-user"></i>
                        </div>
                        </ng-template>
                        <div>
                        <h2 class="text-lg font-bold">{{ userProfile.nom }}</h2>
                        <p>{{ userProfile.email }}</p>
                        </div>
                    </div>
                </ng-template>
            </div>
        </p-dialog>

    `,
    providers: [MessageService]
})

export class NestedMenuComponent implements OnInit {
    newGroup = { nom: '', description: '' ,tags: [] };
    editingGroupId?: number;
    showCreateGroupDialog = false;
    showProfileDialog = false;

    nestedMenuItems: any[] = [];

    constructor( private authService: AuthService, private groupeService: GroupeService, private messageService: MessageService) {}

    ngOnInit() {
        this.loadDynamicMenu();
    }

    loadDynamicMenu() {
        this.groupeService.getGroupesCrees().subscribe(groupes => {
        const groupItems = groupes.map(g => ({
            label: g.nom,
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-file-edit',
                    command: () => this.startEditGroup(g)
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-trash',
                    command: () => this.deleteGroup(g.id)
                }
            ]
            }));
                this.nestedMenuItems = [
                {
                    label: 'Groups',
                    icon: 'pi pi-fw pi-users',
                    items: [
                    {
                        label: 'Create New Group',
                        icon: 'pi pi-fw pi-plus-circle',
                        command: () => { this.showCreateGroupDialog = true; }
                    } ,
                ...groupItems
            ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => this.loadUserProfile()
            },
            {
                label: 'Quit',
                icon: 'pi pi-fw pi-sign-out',
                command: () => this.handleLogout()
            }
            ];

        })}
        // {
        //     label: 'Orders',
        //     icon: 'pi pi-fw pi-shopping-cart',
        //     items: [
        //     { label: 'View', icon: 'pi pi-fw pi-list' },
        //     { label: 'Search', icon: 'pi pi-fw pi-search' }
        //     ]
        // },
        // {
        //     label: 'Shipments',
        //     icon: 'pi pi-fw pi-envelope',
        //     items: [
        //     { label: 'Tracker', icon: 'pi pi-fw pi-compass' },
        //     { label: 'Map', icon: 'pi pi-fw pi-map-marker' },
        //     { label: 'Manage', icon: 'pi pi-fw pi-pencil' }
        //     ]
        // },

        startEditGroup(group: any) {
            this.newGroup = { ...group };
            this.editingGroupId = group.id;
            this.showCreateGroupDialog = true;
        }

        deleteGroup(id: number) {
            this.groupeService.deleteGroupe(id).subscribe({
            next: () => this.loadDynamicMenu(),
            error: err => console.error('Group deletion failed:', err)
            });
        }
        //Create Group Form
        createGroup() {
            if (!this.newGroup.nom || this.newGroup.nom.trim() === '') {
                alert('Group name is required!');
                return;
            }
            const request = this.editingGroupId
            ? this.groupeService.updateGroupe(this.editingGroupId, this.newGroup)
            : this.groupeService.createGroupe(this.newGroup);

            request.subscribe({
            next: () => {
                this.showCreateGroupDialog = false;
                this.newGroup = { nom: '', description: '',tags: []};
                this.editingGroupId = undefined;
                this.loadDynamicMenu();
            },
            error: err => console.error('Group creation/update failed:', err)
            });
        }
        //Profile
        userProfile: any = null;
        loadUserProfile() {
        this.authService.getUserProfile().subscribe(profile => {
            this.userProfile = profile;
            this.showProfileDialog = true;
        });
        }
        //Quit-->Log Out
        handleLogout() {
            this.authService.logout();
        }
        //Search
        searchText = '';
        filteredGroups: any[] = [];
        selectedGroup: any;
        filterGroups() {
        const searchLower = this.searchText.toLowerCase();
        this.groupeService.getAllGroupes().subscribe(groups => {
            this.filteredGroups = groups.filter(g =>
            g.nom.toLowerCase().includes(searchLower) ||
            g.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
            );
        });
        }
        //Upload Photo
        uploadedFiles: any[] = [];

            onUpload(event: any) {
                for (const file of event.files) {
                    this.uploadedFiles.push(file);
                }

                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
            }
}
