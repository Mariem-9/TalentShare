import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import { AuthService } from '../../services/auth.service';
import { GroupeService } from '../../services/GroupeService';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ChipsModule } from 'primeng/chips';
import { ListboxModule } from 'primeng/listbox';
import { FileUploadModule } from 'primeng/fileupload';
import { ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ActionLogService } from '../../services/action-log.service';
import { UserProfileComponent } from './UserProfileComponent';
import { CreateGroupComponent } from './CreateGroupComponent';



@Component({
    selector: 'app-nested-menu',
    standalone: true,
    imports: [RouterModule,CommonModule,FormsModule,ButtonModule,BreadcrumbModule,IconFieldModule, MenubarModule,InputIconModule, MenuModule,
        DialogModule, FloatLabelModule,TextareaModule,InputTextModule,SkeletonModule, TagModule,ChipsModule,ListboxModule,FileUploadModule,
        UserProfileComponent,CreateGroupComponent,ToastModule,ConfirmDialogModule],
    template: `
        <div class="col-span-12 xl:col-span-6 space-y-6">
            <div class="card p-4 min-h-32 rounded-lg shadow-md bg-white dark:bg-gray-800 animate-fadeIn">
                <p-menubar *ngIf="nestedMenuItems.length" [model]="nestedMenuItems">
                    <ng-template #end>
                        <p-iconfield style="width: 100%;">
                            <p-inputicon class="pi pi-search" />
                            <input type="text" pInputText  [(ngModel)]="searchText" (ngModelChange)="filterGroups()" placeholder="Search groups..."
                            class=" w-full min-w-[280px] w-[280px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1" />
                        </p-iconfield>
                    </ng-template>
                </p-menubar>
                </div>
            </div>
            <div *ngIf="searchText.trim() !== '' && filteredGroups.length > 0" class="col-span-12 xl:col-span-6 mt-6">
                <div class="card flex flex-col gap-4 rounded-lg shadow-md bg-white dark:bg-gray-800 animate-fadeIn">
                    <div class="font-semibold text-xl">Search Results</div>
                    <p-listbox [(ngModel)]="selectedGroup" [options]="filteredGroups" optionLabel="nom" [filter]="false"
                    [style]="{ width: '100%' }" (ngModelChange)="navigateToGroup($event)">
                    </p-listbox>
                </div>
            </div>
        <app-create-group #createGroupDialog (groupCreated)="loadDynamicMenu()"></app-create-group>
        <app-user-profile [visible]="showProfileDialog" (close)="showProfileDialog = false"></app-user-profile>
        <p-dialog [header]="selectedPendingGroup?.nom" [(visible)]="displayDialog" [modal]="true" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '40vw' }" (onHide)="closeGroupDialog()">
            <div *ngIf="selectedPendingGroup">
                <div class="mb-2">
                    <span *ngIf="selectedPendingGroup.tags?.length > 0">
                        <span *ngFor="let tag of selectedPendingGroup.tags" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{{ tag }}</span>
                    </span>
                    <span *ngIf="!selectedPendingGroup.tags?.length">None</span>
                </div>
                <p class="text-sm text-gray-500">{{ selectedPendingGroup.description }}</p>

            </div>

            <ng-template #footer>
                <button pButton type="button" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" (click)="confirmDeleteGroup(selectedPendingGroup.id)"></button>
            </ng-template>
        </p-dialog>
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>


    `,
    providers: [ConfirmationService, MessageService],

})

export class NestedMenuComponent implements OnInit {
    @ViewChild('createGroupDialog') createGroupDialog!: CreateGroupComponent;
    showProfileDialog = false;
    nestedMenuItems: any[] = [];
    searchText = '';
    filteredGroups: any[] = [];
    selectedGroup: any;

    constructor( private authService: AuthService, private groupeService: GroupeService, private router: Router,
        private confirmationService: ConfirmationService, private messageService: MessageService,private actionLogService: ActionLogService) {}

    ngOnInit() {
        this.loadDynamicMenu();
    }
    loadDynamicMenu() {
    this.groupeService.getGroupesCrees().subscribe(createdGroups => {
        const createdGroupItems = createdGroups.map(g => ({
        label: g.nom,
        icon: 'pi pi-fw pi-users',
        command: () => this.router.navigate(['/group', g.id]),
        }));

        const createdSection = {
        label: 'Groups Created',
        icon: 'pi pi-fw pi-users',
        items: [
            {
            label: 'Create New Group',
            icon: 'pi pi-fw pi-plus-circle',
            command: () => this.createGroupDialog.show()
            },
            ...createdGroupItems
        ]
        };

        this.groupeService.getJoinedGroups().subscribe(joinedGroups => {
        const joinedGroupItems = joinedGroups.map(g => ({
            label: g.nom,
            icon: 'pi pi-fw pi-users',
            command: () => this.router.navigate(['/group', g.id]),
        }));

        const joinedSection = {
            label: 'Joined Groups',
            icon: 'pi pi-fw pi-users',
            items: joinedGroupItems.length > 0 ? joinedGroupItems : [
            { label: 'No groups joined', disabled: true }
            ]
        };

        const userRole = this.authService.getRole();
        if (userRole === 'ROLE_USER') {
            this.groupeService.getGroupesEnAttente().subscribe(pendingGroups => {
            const pendingItems = pendingGroups.map(g => ({
                label: g.nom,
                icon: 'pi pi-fw pi-clock',
                command: () => this.openGroupDialog(g)
            }));

            const pendingSection = {
                label: 'Pending Requests',
                icon: 'pi pi-fw pi-clock',
                items: pendingItems.length > 0 ? pendingItems : [
                { label: 'No pending requests', disabled: true }
                ]
            };

            this.nestedMenuItems = [
                createdSection,
                pendingSection,
                joinedSection,
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
            });
        } else {
            // Admin: no pending section
            this.nestedMenuItems = [
            createdSection,
            joinedSection,
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
        }
        });
    });
    }
    navigateToGroup(group: any) {
        console.log('Navigating to group:', group);
        if (group?.id) {
            this.router.navigate(['/group', group.id]);
        } else {
            console.warn('No group selected');
        }
    }

    loadUserProfile() { this.showProfileDialog = true;}

    filterGroups() {
        const searchLower = this.searchText.toLowerCase();
        this.groupeService.getAllGroupes().subscribe(groups => {
            this.actionLogService.log('SEARCH_GROUP', `Search query: ${this.searchText}`).subscribe({
                next: () => console.log('Search action logged'),
                error: err => console.error('Error logging search:', err)
            });
            this.filteredGroups = groups.filter(g =>
            g.nom.toLowerCase().includes(searchLower) ||
            g.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))

            );
        });
    }

    handleLogout() { this.authService.logout();}

    ///Pending Request code
    displayDialog = false;
    selectedPendingGroup: any = null;

    openGroupDialog(group: any) {
    this.selectedPendingGroup = group;
    this.displayDialog = true;
    this.actionLogService.log('VIEW_PENDING_GROUP', `Viewed pending group: ${group.nom} (ID ${group.id})`).subscribe({
        next: () => console.log('Viewed pending group logged'),
        error: err => console.error('Error logging view:', err)
    });
    }

    closeGroupDialog() {
    this.displayDialog = false;
    this.selectedPendingGroup = null;
    }

    confirmDeleteGroup(id: number) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete this group?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
        this.groupeService.deleteGroupe(id).subscribe({
            next: () => {
            this.actionLogService.log('DELETE_GROUP_SUCCESS', `Group ID ${id} deleted successfully`).subscribe({
                next: () => console.log('Delete group logged'),
                error: err => console.error('Error logging delete:', err)
            });
            this.closeGroupDialog();
            this.loadDynamicMenu();
            this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Group deleted successfully'
            });
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



}
