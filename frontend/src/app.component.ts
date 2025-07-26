import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ RouterModule,FormsModule,ButtonModule,BreadcrumbModule,IconFieldModule, MenubarModule,InputIconModule, MenuModule,],
    template: `
        <router-outlet></router-outlet>
    `
})
export class AppComponent {

}
