import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '@services/user.service';
import { BookLoanService } from '@services/book-loan.service';
import { SubscriptionService } from '@services/subscription.service';
import { UserDTO, BookLoan, SubscriptionDTO } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Users Management</h1>
          <p class="text-gray-600 mt-1">Total: {{ totalUsers }} registered users</p>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success mb-6">
        <lucide-angular name="check-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ successMessage }}</span>
        <button (click)="successMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-error mb-6">
        <lucide-angular name="alert-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ errorMessage }}</span>
        <button (click)="errorMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <!-- Search -->
      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Name Search -->
          <div>
            <label class="form-label">Search by Name</label>
            <input
              type="text"
              placeholder="Enter user name..."
              class="form-input"
              (keyup)="onSearchChange($event)"
            />
          </div>

          <!-- Email Search -->
          <div>
            <label class="form-label">Search by Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              class="form-input"
              (keyup)="onEmailSearch($event)"
            />
          </div>

          <!-- Search Button -->
          <div class="flex items-end">
            <button (click)="search()" class="btn btn-primary w-full">
              <lucide-angular name="search" class="w-4 h-4 inline mr-2"></lucide-angular>
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subscription</th>
                <th>Active Loans</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>
                  <button (click)="viewUser(user)" class="text-blue-600 hover:underline font-medium">
                    {{ user.fullName }}
                  </button>
                </td>
                <td class="text-sm">{{ user.email }}</td>
                <td class="text-sm">{{ user.phone || '-' }}</td>
                <td>
                  <span
                    *ngIf="userSubscriptions[user.id]"
                    [ngClass]="
                      userSubscriptions[user.id].status === 'ACTIVE'
                        ? 'badge badge-success'
                        : 'badge badge-warning'
                    "
                  >
                    {{ userSubscriptions[user.id].status || 'None' }}
                  </span>
                  <span *ngIf="!userSubscriptions[user.id]" class="badge badge-warning">
                    Inactive
                  </span>
                </td>
                <td class="text-center">
                  <span
                    class="inline-block px-2 py-1 rounded text-sm font-semibold"
                    [ngClass]="
                      (userLoans[user.id] || 0) > 0
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    "
                  >
                    {{ userLoans[user.id] || 0 }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-success">Active</span>
                </td>
                <td class="text-sm">{{ user.createdAt | date: 'MMM dd, yyyy' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="viewUser(user)"
                      title="View Profile"
                      class="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <lucide-angular name="eye" class="w-4 h-4"></lucide-angular>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div *ngIf="users.length === 0" class="text-center py-12">
            <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
            <p class="text-gray-600 font-medium">No users found</p>
            <p class="text-gray-500 text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Modal -->
    <div *ngIf="showProfileModal" class="modal-overlay" (click)="closeProfileModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">User Profile</h2>
          <button (click)="closeProfileModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedUser" class="space-y-6">
          <!-- User Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-600 text-sm font-medium">Full Name</p>
                <p class="text-gray-900">{{ selectedUser.fullName }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Email</p>
                <p class="text-gray-900">{{ selectedUser.email }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Phone</p>
                <p class="text-gray-900">{{ selectedUser.phone || '-' }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Member Since</p>
                <p class="text-gray-900">{{ selectedUser.createdAt | date: 'MMM dd, yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Subscription Information -->
          <div class="bg-gray-50 p-4 rounded-lg" *ngIf="selectedUserSubscription">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-600 text-sm font-medium">Plan</p>
                <p class="text-gray-900">{{ selectedUserSubscription.planName || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Status</p>
                <span
                  [ngClass]="
                    selectedUserSubscription.status === 'ACTIVE'
                      ? 'badge badge-success'
                      : 'badge badge-warning'
                  "
                >
                  {{ selectedUserSubscription.status }}
                </span>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Max Books Allowed</p>
                <p class="text-gray-900 font-bold">{{ selectedUserSubscription.maxBooksAllowed }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm font-medium">Valid Until</p>
                <p class="text-gray-900">{{ selectedUserSubscription.endDate | date: 'MMM dd, yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Borrowing Statistics -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Borrowing Statistics</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-3xl font-bold text-blue-600">{{ userBorrowingStats.activeLoans }}</p>
                <p class="text-gray-600 text-sm">Active Loans</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-red-600">{{ userBorrowingStats.overdueLoans }}</p>
                <p class="text-gray-600 text-sm">Overdue Loans</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-green-600">{{ userBorrowingStats.totalReturned }}</p>
                <p class="text-gray-600 text-sm">Total Returned</p>
              </div>
            </div>
          </div>

          <!-- Recent Loans -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Loans</h3>
            <div *ngIf="userRecentLoans.length > 0" class="space-y-3 max-h-64 overflow-y-auto">
              <div *ngFor="let loan of userRecentLoans" class="bg-white p-3 rounded border border-gray-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ loan.bookTitle }}</p>
                    <p class="text-sm text-gray-600">{{ loan.bookAuthor }}</p>
                  </div>
                  <span
                    [ngClass]="{
                      'badge badge-success': loan.status === 'RETURNED',
                      'badge badge-warning': loan.status === 'CHECKED_OUT',
                      'badge badge-error': loan.status === 'OVERDUE'
                    }"
                  >
                    {{ loan.status }}
                  </span>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span class="font-medium">Checkout:</span> {{ loan.checkoutDate | date: 'MMM dd' }}
                  </div>
                  <div>
                    <span class="font-medium">Due:</span> {{ loan.dueDate | date: 'MMM dd' }}
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="userRecentLoans.length === 0" class="text-center py-6 text-gray-600">
              <p>No recent loans</p>
            </div>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end">
            <button (click)="closeProfileModal()" class="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: UserDTO[] = [];
  totalUsers = 0;
  loading = true;

  // Search states
  searchName = '';
  searchEmail = '';

  // Messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Modal states
  showProfileModal = false;
  selectedUser: UserDTO | null = null;

  // User data
  userSubscriptions: { [key: number]: SubscriptionDTO } = {};
  userLoans: { [key: number]: number } = {};
  selectedUserSubscription: SubscriptionDTO | null = null;
  userBorrowingStats: any = { activeLoans: 0, overdueLoans: 0, totalReturned: 0 };
  userRecentLoans: any[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private emailSearchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private bookLoanService: BookLoanService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.search());

    this.emailSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.search());
  }

  loadUsers() {
    this.loading = true;

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: users => {
          // Filter by search if needed
          if (this.searchName.trim()) {
            users = users.filter(u =>
              u.fullName.toLowerCase().includes(this.searchName.toLowerCase())
            );
          }
          if (this.searchEmail.trim()) {
            users = users.filter(u =>
              u.email.toLowerCase().includes(this.searchEmail.toLowerCase())
            );
          }

          this.users = users;
          this.totalUsers = users.length;
          this.loadUserMetadata();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load users:', error);
          this.errorMessage = 'Failed to load users';
          this.loading = false;
        },
      });
  }

  private loadUserMetadata() {
    // Load subscription info for each user
    this.users.forEach(user => {
      this.subscriptionService
        .getUsersActiveSubscription(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: sub => {
            this.userSubscriptions[user.id] = sub;
          },
          error: () => {
            // User might not have active subscription
          },
        });

      // Load active loan count for each user
      this.bookLoanService
        .searchBookLoans({ userId: user.id, page: 0, size: 1000 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            const activeCount = response.content.filter(
              l => l.status === 'CHECKED_OUT'
            ).length;
            this.userLoans[user.id] = activeCount;
          },
          error: () => {
            this.userLoans[user.id] = 0;
          },
        });
    });
  }

  search() {
    this.loadUsers();
  }

  onSearchChange(event: any) {
    this.searchName = event.target.value;
    this.searchSubject.next(this.searchName);
  }

  onEmailSearch(event: any) {
    this.searchEmail = event.target.value;
    this.emailSearchSubject.next(this.searchEmail);
  }

  viewUser(user: UserDTO) {
    this.selectedUser = user;
    this.showProfileModal = true;
    this.loadUserDetails(user.id);
  }

  private loadUserDetails(userId: number) {
    // Load subscription
    this.subscriptionService
      .getUsersActiveSubscription(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: sub => {
          this.selectedUserSubscription = sub;
        },
      });

    // Load user loans for statistics
    this.bookLoanService
      .searchBookLoans({ userId: userId, page: 0, size: 1000 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          const loans = response.content;
          this.userBorrowingStats = {
            activeLoans: loans.filter(l => l.status === 'CHECKED_OUT').length,
            overdueLoans: loans.filter(l => l.status === 'OVERDUE').length,
            totalReturned: loans.filter(l => l.status === 'RETURNED').length,
          };

          // Get recent loans
          this.userRecentLoans = loans
            .slice(0, 5)
            .map(loan => ({
              ...loan,
              bookTitle: loan.bookTitle || 'N/A',
              bookAuthor: loan.bookAuthor || 'N/A',
            }));
        },
      });
  }

  closeProfileModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showProfileModal = false;
    this.selectedUser = null;
    this.selectedUserSubscription = null;
    this.userRecentLoans = [];
  }
}
