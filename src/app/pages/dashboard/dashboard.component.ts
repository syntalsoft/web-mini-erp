import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  user: User | null;

  kpis = [
    { label: 'Prospects', value: '—', icon: 'people', color: '#1976D2' },
    { label: 'Devis en cours', value: '—', icon: 'description', color: '#FF9800' },
    { label: 'Commandes', value: '—', icon: 'shopping_cart', color: '#4CAF50' },
    { label: 'Chiffre d\'affaires', value: '—', icon: 'trending_up', color: '#F44336' },
  ];

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }
}
