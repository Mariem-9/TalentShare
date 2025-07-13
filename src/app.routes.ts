import { Routes } from '@angular/router';
import { Notfound } from './app/pages/notfound/notfound';
import { Home } from './app/pages/Home/Home';
import { AuthGuard } from './app/guards/auth.guard';
import { NoAuthGuard } from './app/guards/no-auth.guard';
import { RoleGuard } from './app/guards/role.guard';
import { AdminDashboardComponent } from './app/admin-dashboard.component';
import { Access } from './app/auth/access';
import { PasswordWidget } from './app/auth/forgetpassword';
import { Login } from './app/auth/login';
import { Register } from './app/auth/register';
import { PendingGroupListComponent } from './app/components/PendingGroupListComponent';


export const appRoutes: Routes = [
    { path: '', component: Login , pathMatch: 'full'}, //Root
     // Public routes
    { path: 'login', component: Login , canActivate: [NoAuthGuard]  },
    { path: 'register', component: Register , canActivate: [NoAuthGuard]},
    { path: 'reset-password', component: PasswordWidget , canActivate: [NoAuthGuard]},
    // Protected routes
    { path: 'home', component: Home , canActivate: [AuthGuard, RoleGuard],data: { roles: ['ROLE_USER', 'ROLE_ADMIN']}},
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard],data: { roles: ['ROLE_ADMIN'] }},
    { path: 'group/:id', loadComponent: () => import('./app/group/GroupComponent').then(m => m.GroupComponent),canActivate: [AuthGuard], },
    { path: 'admin/pending-groups', component: PendingGroupListComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }},
    // Fallbacks
    { path: 'unauthorized', component: Access },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: 'Login' }
];
