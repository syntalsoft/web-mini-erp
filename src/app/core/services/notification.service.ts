import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultDuration = 4000;

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  error(message: string, duration = 6000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  warning(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  info(message: string, duration = this.defaultDuration): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
