import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      switch (error.status) {
        case 0:
          message = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          break;
        case 400:
          message = error.error?.message || 'Données invalides.';
          break;
        case 401:
          // Handled by auth interceptor
          return throwError(() => error);
        case 403:
          message = 'Accès non autorisé. Permissions insuffisantes.';
          break;
        case 404:
          message = 'Ressource introuvable.';
          break;
        case 409:
          message = error.error?.message || 'Conflit de données.';
          break;
        case 422:
          message = error.error?.message || 'Erreur de validation.';
          break;
        case 500:
          message = 'Erreur interne du serveur. Veuillez réessayer.';
          break;
        default:
          message = `Erreur inattendue (${error.status}).`;
      }

      notification.error(message);
      return throwError(() => error);
    })
  );
};
