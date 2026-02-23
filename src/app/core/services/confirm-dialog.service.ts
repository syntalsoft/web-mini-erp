import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean> {
    // For now, use browser's confirm dialog
    // In future, can replace with custom Material dialog
    const confirmed = window.confirm(data.message);
    return new Observable(observer => {
      observer.next(confirmed);
      observer.complete();
    });
  }

  confirmDelete(entityName: string, entityValue: string): Observable<boolean> {
    return this.confirm({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer ${entityName} "${entityValue}" ?\n\nCette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDangerous: true
    });
  }
}
