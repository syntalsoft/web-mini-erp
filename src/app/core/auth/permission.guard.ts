import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  const requiredPermissions = route.data?.['permissions'] as string[] | undefined;

  if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
    return router.createUrlTree(['/forbidden']);
  }

  if (requiredPermissions) {
    const hasAll = requiredPermissions.every(p => authService.hasPermission(p));
    if (!hasAll) {
      return router.createUrlTree(['/forbidden']);
    }
  }

  return true;
};
