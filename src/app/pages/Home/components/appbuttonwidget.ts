import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-button-widget',
    standalone: true,
    imports: [ButtonModule, ButtonGroupModule, SplitButtonModule],
    template: `<div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Rounded Outlined</div>
                <div class="flex flex-wrap gap-2">
                    <p-button icon="pi pi-check" rounded outlined />
                    <p-button icon="pi pi-bookmark" severity="secondary" rounded outlined />
                    <p-button icon="pi pi-search" severity="success" rounded outlined />
                    <p-button icon="pi pi-user" severity="info" rounded outlined />
                    <p-button icon="pi pi-bell" severity="warn" rounded outlined />
                    <p-button icon="pi pi-heart" severity="help" rounded outlined />
                    <p-button icon="pi pi-times" severity="danger" rounded outlined (click)="handleLogout()"
                        [loading]="logoutLoading"/>
                </div>
            </div>
        </div>
    </div> `
})
export class ButtonWidget implements OnInit {
    items: MenuItem[] = [];
    loading = [false, false, false, false];
    logoutLoading = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.items = [
            { label: 'Update', icon: 'pi pi-refresh' },
            { label: 'Delete', icon: 'pi pi-times' },
            { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
            { separator: true },
            { label: 'Setup', icon: 'pi pi-cog' }
        ];
    }

    handleLogout() {
    this.logoutLoading = true;
    this.authService.logout();
    this.logoutLoading = false;
}

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
    }
}
