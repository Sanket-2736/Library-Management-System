import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookLoanService } from '../../core/services/book-loan.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { BookService } from '../../core/services/book.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { UserProfile, Subscription, BookLoan } from '../../core/models/index';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

      <div *ngIf="!loading" class="p-6 max-w-7xl mx-auto">
        <!-- Welcome Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900">
            Welcome back, <span class="text-blue-600">{{ user?.firstName }}!</span>
          </h1>
          <p class="text-gray-600 mt-2">{{ getGreeting() }}</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="font-semibold">Failed to load dashboard</p>
            <p class="text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Active Subscription Card -->
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-600 text-sm font-medium">Active Subscription</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ subscription?.planName || 'None' }}</h3>
                <p class="text-gray-600 text-xs mt-2" *ngIf="subscription?.endDate">
                  Expires: {{ subscription.endDate | date: 'MMM dd, yyyy' }}
                </p>
              </div>
              <div class="text-3xl">{{ subscription ? '📖' : '❌' }}</div>
            </div>
            <div class="mt-4">
              <a *ngIf="!subscription" routerLink="/subscriptions" class="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Browse Plans →
              </a>
              <span *ngIf="subscription" class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {{ subscription.status }}
              </span>
            </div>
          </div>

          <!-- Borrowed Books Card -->
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-600 text-sm font-medium">Borrowed Books</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ activeLoans.length }}</h3>
                <p class="text-gray-600 text-xs mt-2" *ngIf="subscription">
                  Max: {{ subscription.maxBooksAllowed }}
                </p>
              </div>
              <div class="text-3xl">📚</div>
            </div>
            <div class="mt-4">
              <a routerLink="/book-loans" class="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View Details →
              </a>
            </div>
          </div>

          <!-- Overdue Books Card -->
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4" [ngClass]="overdueLoans.length > 0 ? 'border-red-600' : 'border-gray-300'">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-600 text-sm font-medium">Overdue Books</p>
                <h3 class="text-2xl font-bold" [ngClass]="overdueLoans.length > 0 ? 'text-red-600' : 'text-gray-900'" >{{ overdueLoans.length }}</h3>
                <p class="text-gray-600 text-xs mt-2" *ngIf="overdueLoans.length > 0">
                  Action required!
                </p>
              </div>
              <div class="text-3xl">{{ overdueLoans.length > 0 ? '⚠️' : '✅' }}</div>
            </div>
            <div class="mt-4">
              <a *ngIf="overdueLoans.length > 0" routerLink="/book-loans" class="text-red-600 hover:text-red-700 text-sm font-semibold">
                Return Now →
              </a>
              <span *ngIf="overdueLoans.length === 0" class="text-green-600 text-sm font-semibold">All good!</span>
            </div>
          </div>

          <!-- Upcoming Due Dates Card -->
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-600 text-sm font-medium">Due Soon</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ dueSoonCount }}</h3>
                <p class="text-gray-600 text-xs mt-2">Within 7 days</p>
              </div>
              <div class="text-3xl">⏰</div>
            </div>
            <div class="mt-4">
              <a *ngIf="dueSoonCount > 0" routerLink="/book-loans" class="text-yellow-600 hover:text-yellow-700 text-sm font-semibold">
                See Details →
              </a>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recently Borrowed Books Section -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-900">Currently Borrowed</h2>
              <a routerLink="/book-loans" class="text-blue-600 hover:text-blue-700 text-sm">View All →</a>
            </div>

            <div *ngIf="activeLoans.length === 0" class="text-center py-8 text-gray-500">
              <p>No books borrowed yet.</p>
              <a routerLink="/books" class="text-blue-600 hover:text-blue-700 text-sm mt-2 block">
                Browse available books →
              </a>
            </div>

            <div *ngIf="activeLoans.length > 0" class="space-y-4">
              <div *ngFor="let loan of activeLoans.slice(0, 5)" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ loan.bookTitle }}</p>
                  <p class="text-sm text-gray-600">{{ loan.bookAuthor }}</p>
                  <div class="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Borrowed: {{ loan.checkoutDate | date: 'MMM dd' }}</span>
                    <span>Due: {{ loan.dueDate | date: 'MMM dd' }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span *ngIf="!loan.isOverdue" class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {{ getDaysRemaining(loan.dueDate) }} days
                  </span>
                  <span *ngIf="loan.isOverdue" class="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    Overdue
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Info & Quick Actions -->
          <div class="space-y-6">
            <!-- Account Info Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Account Info</h3>
              <div class="space-y-3 text-sm">
                <div>
                  <p class="text-gray-600">Name</p>
                  <p class="font-semibold text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Email</p>
                  <p class="font-semibold text-gray-900">{{ user?.email }}</p>
                </div>
                <div *ngIf="user?.phoneNumber">
                  <p class="text-gray-600">Phone</p>
                  <p class="font-semibold text-gray-900">{{ user.phoneNumber }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Member Since</p>
                  <p class="font-semibold text-gray-900">{{ user?.createdAt | date: 'MMM yyyy' }}</p>
                </div>
              </div>
              <a routerLink="/profile" class="mt-4 block text-center text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Edit Profile →
              </a>
            </div>

            <!-- Quick Actions Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-2">
                <a routerLink="/books" class="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-sm font-semibold transition">
                  🔍 Browse Books
                </a>
                <a routerLink="/subscriptions" class="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center text-sm font-semibold transition">
                  📦 View Plans
                </a>
                <a routerLink="/book-loans" class="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center text-sm font-semibold transition">
                  📚 My Loans
                </a>
                <button (click)="logout()" class="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-center text-sm font-semibold transition">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Overdue Books Alert Section -->
        <div *ngIf="overdueLoans.length > 0" class="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="text-3xl">⚠️</div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-red-900">Overdue Books</h3>
              <p class="text-red-800 mt-2">You have {{ overdueLoans.length }} overdue book(s). Please return them as soon as possible.</p>
              <div class="space-y-2 mt-3">
                <div *ngFor="let loan of overdueLoans" class="text-sm text-red-800">
                  • <strong>{{ loan.bookTitle }}</strong> ({{ loan.overdueDays }} days overdue)
                </div>
              </div>
              <a routerLink="/book-loans" class="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
                Return Books Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: UserProfile | null = null;
  subscription: Subscription | null = null;
  activeLoans: BookLoan[] = [];
  overdueLoans: BookLoan[] = [];
  dueSoonCount = 0;

  loading = true;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private bookLoanService: BookLoanService,
    private subscriptionService: SubscriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = null;

    forkJoin({
      user: this.authService.getCurrentUserProfile(),
      subscription: this.subscriptionService.getUserActiveSubscription().pipe(
        catchError(() => of(null)),
      ),
      loans: this.bookLoanService.getMyBookLoans().pipe(
        catchError(() => of({ content: [] })),
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user = data.user;
          this.subscription = data.subscription;

          // Process loans
          const loans = data.loans.content || data.loans || [];
          this.activeLoans = loans.filter((loan: any) => loan.status === 'CHECKED_OUT');
          this.overdueLoans = loans.filter((loan: any) => loan.isOverdue);

          // Count due soon (within 7 days)
          const today = new Date();
          const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          this.dueSoonCount = this.activeLoans.filter((loan) => {
            const dueDate = new Date(loan.dueDate);
            return dueDate <= sevenDaysFromNow && dueDate > today && !loan.isOverdue;
          }).length;

          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load dashboard:', error);
          this.errorMessage = 'Failed to load dashboard. Please refresh the page.';
          this.loading = false;
        },
      });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 18) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  }

  getDaysRemaining(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
