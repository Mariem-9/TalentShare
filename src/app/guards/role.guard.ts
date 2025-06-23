import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {

        const expectedRoles = route.data['roles'] as Array<string>;
        const userRole = this.authService.getRole();

        if (!this.authService.getToken()) {
        this.router.navigate(['/login']);
        return false;
        }

        // Handle null case
        if (!userRole || !expectedRoles) {
        this.router.navigate(['/unauthorized']);
        return false;
        }

        if (expectedRoles.includes(userRole)) {
        return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
    }

}
