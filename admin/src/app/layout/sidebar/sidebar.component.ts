import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 bg-gray-900 text-white shadow-lg h-screen overflow-y-auto">
      <div class="p-6">
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <lucide-angular name="book-open" class="w-6 h-6"></lucide-angular>
          Library
        </h1>
        <p class="text-gray-400 text-sm mt-1">Admin Dashboard</p>
      </div>

      <nav class="mt-8">
        <div *ngFor="let item of menuItems" class="mb-2">
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-blue-600"
            [routerLinkActiveOptions]="{ exact: false }"
            class="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <lucide-angular [name]="item.icon" class="w-5 h-5"></lucide-angular>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </nav>

      <div class="mt-auto p-6 border-t border-gray-700">
        <p class="text-xs text-gray-500">© 2024 Library System</p>
      </div>
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: 'layout-grid',
      route: '/dashboard',
    },
    {
      label: 'Users',
      icon: 'users',
      route: '/users',
    },
    {
      label: 'Books',
      icon: 'book',
      route: '/books',
    },
    {
      label: 'Genres',
      icon: 'tag',
      route: '/genres',
    },
    {
      label: 'Book Loans',
      icon: 'arrows-right-left',
      route: '/loans',
    },
    {
      label: 'Subscriptions',
      icon: 'credit-card',
      route: '/subscriptions',
    },
    {
      label: 'Plans',
      icon: 'package',
      route: '/subscription-plans',
    },
    {
      label: 'Payments',
      icon: 'wallet',
      route: '/payments',
    },
  ];
}
