import { Component, ViewChild } from '@angular/core';
import { NestedMenuComponent } from '../../group/Navbar/nested-menu-items.component';
import {GroupRecommendationsComponent} from '../../group/Dashboard/group-recommendations.component';
import { PendingGroupListComponent } from '../../group/Dashboard/PendingGroupListComponent';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuditLogListComponent } from '../../group/Dashboard/AuditLogListComponent';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, NestedMenuComponent, GroupRecommendationsComponent,PendingGroupListComponent,AuditLogListComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div class="card min-h-32 p-4 pl-16 pr-16 rounded-lg shadow-md text-center bg-white dark:bg-gray-800 ">
            <div class=" border-2 border-blue-300 rounded-lg p-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div class="animate-fadeIn px-16 w-[700px]">
                    <h1 class="text-7xl font-extrabold tracking-tight text-blue-400 select-none leading-tight text-left">
                        TalentShare
                    </h1>
                    <p class="text-base font-medium text-slate-500 dark:text-slate-300  tracking-wide text-right">
                        Join the hub where talents connect, collaborate, and create.
                    </p>
                </div>
                    <img src="assets/images/Home.png" alt="Home" class="max-h-64 max-w-6xl object-contain transition-transform duration-300 hover:scale-105 mx-auto block" />
            </div>
        </div>

        <div *ngIf="roleAdmin; else userView" class="grid grid-cols-12 gap-2">
            <div class="col-span-12 xl:col-span-6 order-3 xl:order-2 space-y-6 overflow-auto">
                <app-nested-menu></app-nested-menu>
                <div *ngIf="roleAdmin">
                    <app-pending-group-list #pendingList></app-pending-group-list>
                    <app-audit-log-list></app-audit-log-list>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6 order-1 xl:order-1 space-y-6">
                <div class="card p-4 min-h-80 rounded-lg shadow-md bg-white dark:bg-gray-800 animate-fadeIn order-2">
                <app-group-recommendations></app-group-recommendations>
                </div>
            </div>

        </div>
        <ng-template #userView>
            <div class="space-y-6 mt-6 gap-6">
                <app-nested-menu></app-nested-menu>
                <div class="h-4"></div>
                <app-group-recommendations></app-group-recommendations>
            </div>
        </ng-template>
    </div>
`,
    })
export class Home {
    roleAdmin: boolean = false;
    constructor(private authService: AuthService) {}

    ngOnInit() {
        const role = this.authService.getRole();
        this.roleAdmin = role === 'ROLE_ADMIN';
    }
}


