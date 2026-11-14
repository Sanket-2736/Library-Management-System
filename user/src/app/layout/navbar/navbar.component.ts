import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/auth.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/dashboard" class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">📚</span>
              </div>
              <span class="font-bold text-lg text-gray-900 hidden sm:inline">LibraryHub</span>
            </a>
          </div>

          <!-- Navigation Links (when authenticated) -->
          <div *ngIf="isAuthenticated$ | async" class="hidden md:flex items-center gap-8">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-blue-600 border-b-2 border-blue-600"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-gray-700 hover:text-blue-600 pb-1 transition-colors text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              routerLink="/books"
              routerLinkActive="text-blue-600 border-b-2 border-blue-600"
              class="text-gray-700 hover:text-blue-600 pb-1 transition-colors text-sm font-medium"
            >
              Browse Books
            </a>
            <a
              routerLink="/subscriptions"
              routerLinkActive="text-blue-600 border-b-2 border-blue-600"
              class="text-gray-700 hover:text-blue-600 pb-1 transition-colors text-sm font-medium"
            >
              Subscriptions
            </a>
            <a
              routerLink="/book-loans"
              routerLinkActive="text-blue-600 border-b-2 border-blue-600"
              class="text-gray-700 hover:text-blue-600 pb-1 transition-colors text-sm font-medium"
            >
              My Loans
            </a>
          </div>

          <!-- Search Bar (when authenticated) -->
          <div *ngIf="isAuthenticated$ | async" class="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-8">
            <input
              type="text"
              placeholder="Search books..."
              class="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
            </svg>
          </div>

          <!-- User Menu / Auth Buttons -->
          <div class="flex items-center gap-4">
            <div *ngIf="isAuthenticated$ | async" class="flex items-center gap-4">
              <!-- User Profile Dropdown -->
              <div class="relative" [class.open]="showUserMenu">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div
                    class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  >
                    {{ getInitials(currentUser?.firstName || '') }}
                  </div>
                  <span class="text-gray-700 text-sm hidden sm:inline font-medium">{{ currentUser?.firstName }}</span>
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  *ngIf="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <a
                    routerLink="/profile"
                    (click)="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    👤 View Profile
                  </a>
                  <a
                    routerLink="/profile/edit"
                    (click)="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    ✏️ Edit Profile
                  </a>
                  <a
                    routerLink="/profile/change-password"
                    (click)="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    🔐 Change Password
                  </a>
                  <a
                    routerLink="/payments"
                    (click)="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    💳 Payments
                  </a>
                  <hr class="my-2" />
                  <button
                    (click)="logout()"
                    class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- Auth Buttons (when not authenticated) -->
            <div *ngIf="!(isAuthenticated$ | async)" class="flex items-center gap-2">
              <a routerLink="/auth/login" class="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium">
                Login
              </a>
              <a routerLink="/auth/signup" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">
                Sign Up
              </a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button
              *ngIf="isAuthenticated$ | async"
              (click)="showMobileMenu = !showMobileMenu"
              class="md:hidden text-gray-600 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="showMobileMenu && (isAuthenticated$ | async)" class="md:hidden py-4 space-y-2 border-t">
          <a
            routerLink="/dashboard"
            (click)="showMobileMenu = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
          >
            Dashboard
          </a>
          <a
            routerLink="/books"
            (click)="showMobileMenu = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
          >
            Browse Books
          </a>
          <a
            routerLink="/subscriptions"
            (click)="showMobileMenu = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
          >
            Subscriptions
          </a>
          <a
            routerLink="/book-loans"
            (click)="showMobileMenu = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
          >
            My Loans
          </a>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser: UserProfile | null = null;
  showUserMenu = false;
  showMobileMenu = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Close menus on route change
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showUserMenu = false;
      this.showMobileMenu = false;
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('[role="button"]')) {
        this.showUserMenu = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2) || 'U';
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.showUserMenu = false;
    }
  }
}
