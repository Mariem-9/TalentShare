
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../services/audit-log.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const auditLogService = inject(AuditLogService);
    const action = `${req.method} ${req.url}`;

    return next(req).pipe(
        tap(event => {
        auditLogService.log(action, 'Success');
        })
    );
};
