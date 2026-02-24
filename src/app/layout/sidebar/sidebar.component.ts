import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;

  navGroups: NavGroup[] = [
    {
      title: 'Principal',
      items: [
        { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
      ],
    },
    {
      title: 'Commercial',
      items: [
        {
          label: 'Catalogue',
          icon: 'inventory_2',
          children: [
            { label: 'Catégories', icon: 'category', route: '/catalogue/categories' },
            { label: 'Produits', icon: 'inventory', route: '/catalogue/produits' },
            { label: 'Services', icon: 'miscellaneous_services', route: '/catalogue/services' },
            { label: 'Packages', icon: 'local_offer', route: '/catalogue/packages' },
          ],
        },
        { label: 'Prospection', icon: 'people_outline', route: '/prospection' },
        { label: 'Ventes', icon: 'point_of_sale', route: '/ventes' },
      ],
    },
    {
      title: 'Logistique',
      items: [
        { label: 'Stock', icon: 'warehouse', route: '/stock' },
        { label: 'Achats', icon: 'shopping_bag', route: '/achats' },
      ],
    },
    {
      title: 'Opérations',
      items: [
        { label: 'Interventions', icon: 'build', route: '/operations' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Utilisateurs', icon: 'admin_panel_settings', route: '/administration' },
      ],
    },
  ];
}
