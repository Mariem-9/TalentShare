import { Component } from '@angular/core';
import { NestedMenuComponent } from '../../components/nested-menu-items.component';
import {GroupRecommendationsComponent} from '../../components/group-recommendations.component';
import { PendingGroupListComponent } from '../../components/PendingGroupListComponent';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuditLogListComponent } from '../../components/AuditLogListComponent';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, NestedMenuComponent, GroupRecommendationsComponent,PendingGroupListComponent,AuditLogListComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div class="grid grid-cols-12 gap-2">

        <div class="col-span-12 xl:col-span-6 order-3 xl:order-2 space-y-6 overflow-auto">
            <app-nested-menu></app-nested-menu>
            <div *ngIf="roleAdmin">
                <app-pending-group-list></app-pending-group-list>
                <app-audit-log-list></app-audit-log-list>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6 order-1 xl:order-1 space-y-6">

            <div class="card min-h-32 p-4 rounded-lg shadow-md flex flex-col justify-center items-center text-center bg-white dark:bg-gray-800 animate-fadeIn">
            <div class="flex space-x-0 mb-3 select-none">
                <span class="text-6xl font-bold text-blue-500 tracking-tight animate-fadeIn" style="animation-delay: 0s">T</span>
                <span class="text-6xl font-bold text-green-500 tracking-tight animate-fadeIn" style="animation-delay: 0.1s">A</span>
                <span class="text-6xl font-bold text-yellow-400 tracking-tight animate-fadeIn" style="animation-delay: 0.2s">L</span>
                <span class="text-6xl font-bold text-red-500 tracking-tight animate-fadeIn" style="animation-delay: 0.3s">E</span>
                <span class="text-6xl font-bold text-purple-600 tracking-tight animate-fadeIn" style="animation-delay: 0.4s">N</span>
                <span class="text-6xl font-bold text-pink-500 tracking-tight animate-fadeIn" style="animation-delay: 0.4s">T</span>
                <span class="w-1"></span>
                <span class="text-6xl font-bold text-blue-500 tracking-tight animate-fadeIn" style="animation-delay: 0.5s">S</span>
                <span class="text-6xl font-bold text-green-500 tracking-tight animate-fadeIn" style="animation-delay: 0.6s">H</span>
                <span class="text-6xl font-bold text-yellow-400 tracking-tight animate-fadeIn" style="animation-delay: 0.7s">A</span>
                <span class="text-6xl font-bold text-red-500 tracking-tight animate-fadeIn" style="animation-delay: 0.8s">R</span>
                <span class="text-6xl font-bold text-purple-600 tracking-tight animate-fadeIn" style="animation-delay: 0.9s">E</span>
            </div>
            <p class="text-xl text-gray-600 dark:text-gray-300 font-bold tracking-wide w-max mx-auto">
                Where talents connect
            </p>
            </div>

            <div class="card p-4 min-h-80 rounded-lg shadow-md bg-white dark:bg-gray-800 animate-fadeIn order-2">
            <app-group-recommendations></app-group-recommendations>
            </div>
        </div>

        </div>
    </div>
`,
    styles: [`
        @keyframes fadeIn {
        from {opacity: 0; transform: translateY(15px);}
        to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
        animation: fadeIn 0.6s ease forwards;
        }
    `]
    })
export class Home {
    roleAdmin: boolean = false;
    constructor(private authService: AuthService) {}

    ngOnInit() {
        const role = this.authService.getRole();
        this.roleAdmin = role === 'ROLE_ADMIN';
    }
}


