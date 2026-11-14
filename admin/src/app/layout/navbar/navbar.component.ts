import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@services/auth.service';
import { UserDTO } from '@models/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div class="px-6 py-4 flex items-center justify-between">
        <!-- Left: Brand -->
        <div class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <lucide-angular name="book-open" class="w-6 h-6 text-blue-600"></lucide-angular>
          Library Admin
        </div>

        <!-- Right: User Menu -->
        <div class="flex items-center gap-6">
          <!-- Notifications -->
          <button 
            (click)="toggleNotifications()"
            class="relative text-gray-600 hover:text-gray-900 transition-colors"
            title="Notifications"
          >
            <lucide-angular name="bell" class="w-6 h-6"></lucide-angular>
            <span
              *ngIf="notificationCount > 0"
              class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"
            ></span>
          </button>

          <!-- User Profile Dropdown -->
          <div class="relative" @click="$event.stopPropagation()">
            <button
              (click)="toggleDropdown()"
              class="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              title="User Menu"
            >
              <div class="text-right hidden sm:block">
                <div class="text-sm font-medium text-gray-900">{{ currentUser?.fullName || 'Admin' }}</div>
                <div class="text-xs text-gray-500">{{ getUserRoleLabel() }}</div>
              </div>
              <div
                class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm"
              >
                {{ (currentUser?.fullName || 'A')?.charAt(0) | uppercase }}
              </div>
              <lucide-angular
                [name]="showDropdown ? 'chevron-up' : 'chevron-down'"
                class="w-4 h-4 text-gray-600"
              ></lucide-angular>
            </button>

            <!-- Dropdown Menu -->
            <div
              *ngIf="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900">{{ currentUser?.email }}</p>
              </div>
              <a
                href="#"
                class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <lucide-angular name="user" class="w-4 h-4"></lucide-angular>
                <span>Profile</span>
              </a>
              <a
                href="#"
                class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <lucide-angular name="settings" class="w-4 h-4"></lucide-angular>
                <span>Settings</span>
              </a>
              <div class="border-t border-gray-200 my-1"></div>
              <button
                (click)="logout()"
                class="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <lucide-angular name="log-out" class="w-4 h-4"></lucide-angular>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Notifications Panel -->
    <div
      *ngIf="showNotificationsPanel"
      class="bg-blue-50 border-b border-blue-200 px-6 py-4 flex items-start justify-between max-h-32 overflow-y-auto"
    >
      <div class="flex items-start gap-3 flex-1">
        <lucide-angular name="info" class="w-5 h-5 text-blue-600 mt-1 flex-shrink-0"></lucide-angular>
        <div>
          <p class="text-sm font-semibold text-blue-900">Notifications</p>
          <ul class="text-sm text-blue-800 mt-2 space-y-1">
            <li *ngIf="notificationCount > 0">
              You have {{ notificationCount }} new notifications
            </li>
            <li *ngIf="notificationCount === 0" class="text-blue-700">
              No new notifications
            </li>
          </ul>
        </div>
      </div>
      <button
        (click)="closeNotifications()"
        class="text-blue-600 hover:text-blue-800 flex-shrink-0"
      >
        <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
      </button>
    </div>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserDTO | null = null;
  showDropdown = false;
  showNotificationsPanel = false;
  notificationCount = 0;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showDropdown = false;
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.showNotificationsPanel = false;
  }

  toggleNotifications() {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    this.showDropdown = false;
  }

  closeNotifications() {
    this.showNotificationsPanel = false;
  }

  loadNotifications() {
    // In production, this would load from a real notifications service
    this.notificationCount = Math.floor(Math.random() * 5);
  }

  getUserRoleLabel(): string {
    if (this.currentUser?.role === 'ROLE_ADMIN') {
      return 'Administrator';
    }
    return this.currentUser?.role || 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.showDropdown = false;
  }
}
