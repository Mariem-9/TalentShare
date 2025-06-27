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
    <!-- <div *ngIf="showHeader" class="grid grid-cols-12 gap-8">
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Talan Share</div>
                    <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
                </div>
            </div>
            <app-nested-menu></app-nested-menu>

        </div> -->
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
//     showHeader = true;
//     editingGroupId?: number;
//     showCreateGroupDialog: boolean = false;
//     excludedRoutes = ['/login', '/register', '/unauthorized', '/notfound'];

//     breadcrumbItems: any[] = [];
//     breadcrumbHome = { icon: 'pi pi-home', routerLink: '/home' };

//     constructor(private router: Router, private route: ActivatedRoute , private authService: AuthService ,private groupeService: GroupeService) {
//        this.router.events.pipe(
//   filter(event => event instanceof NavigationEnd)
// ).subscribe((event: NavigationEnd) => {
//   console.log('Current route:', event.urlAfterRedirects);
//   this.setBreadcrumb();
//   this.showHeader = !this.excludedRoutes.some(route => event.urlAfterRedirects.startsWith(route));
// });

//     }

//     setBreadcrumb() {
//         const root = this.route.root;
//         this.breadcrumbItems = this.createBreadcrumbs(root);
//     }

//     createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
//         const children: ActivatedRoute[] = route.children;

//         if (children.length === 0) {
//         return breadcrumbs;
//         }

//         for (const child of children) {
//         const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//         if (routeURL !== '') {
//             url += `/${routeURL}`;
//         }

//         const label = child.snapshot.data['breadcrumb'];
//         if (label) {
//             breadcrumbs.push({ label, routerLink: url });
//         }

//         return this.createBreadcrumbs(child, url, breadcrumbs);
//         }

//         return breadcrumbs;
//     }

}
