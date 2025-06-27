
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { tap } from "rxjs";
import { AuditLogService } from "../services/audit-log.service";

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const auditLogService = inject(AuditLogService);
    const action = `${req.method} ${req.url}`;
    if (req.url.includes('/auth/') || req.url.includes('/refreshtoken')) {
        return next(req);
    }
    return next(req).pipe(
        tap({
            next: (event) => {
                console.log('[INTERCEPT SUCCESS]', req.url);
                auditLogService.log(action, 'Success');
            },
            error: (err) => {
                console.log('[INTERCEPT ERROR]', req.url);
                auditLogService.log(action, `Error: ${err.message}`);
            }
    })
    )
}
