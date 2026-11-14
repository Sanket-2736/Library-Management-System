import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '@core/services/user.service';
import { SubscriptionService } from '@core/services/subscription.service';
import { BookLoanService } from '@core/services/book-loan.service';
import { PaymentService } from '@core/services/payment.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">My Profile</h1>
              <p class="text-blue-100">Manage your account information</p>
            </div>
            <lucide-angular name="user-circle" class="w-16 h-16 opacity-50"></lucide-angular>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Messages -->
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-green-800 font-medium">{{ successMessage }}</p>
          </div>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="alert-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-red-800 font-medium">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            (click)="activeTab = 'profile'"
            [class.border-b-2]="activeTab === 'profile'"
            [class.border-blue-600]="activeTab === 'profile'"
            class="px-4 py-3 font-medium text-gray-700 hover:text-gray-900 transition whitespace-nowrap"
          >
            <lucide-angular name="user" class="w-4 h-4 inline mr-2"></lucide-angular>
            Profile
          </button>
          <button
            (click)="activeTab = 'subscription'"
            [class.border-b-2]="activeTab === 'subscription'"
            [class.border-blue-600]="activeTab === 'subscription'"
            class="px-4 py-3 font-medium text-gray-700 hover:text-gray-900 transition whitespace-nowrap"
          >
            <lucide-angular name="credit-card" class="w-4 h-4 inline mr-2"></lucide-angular>
            Subscription
          </button>
          <button
            (click)="activeTab = 'borrowing'"
            [class.border-b-2]="activeTab === 'borrowing'"
            [class.border-blue-600]="activeTab === 'borrowing'"
            class="px-4 py-3 font-medium text-gray-700 hover:text-gray-900 transition whitespace-nowrap"
          >
            <lucide-angular name="book" class="w-4 h-4 inline mr-2"></lucide-angular>
            Borrowing
          </button>
          <button
            (click)="activeTab = 'payments'"
            [class.border-b-2]="activeTab === 'payments'"
            [class.border-blue-600]="activeTab === 'payments'"
            class="px-4 py-3 font-medium text-gray-700 hover:text-gray-900 transition whitespace-nowrap"
          >
            <lucide-angular name="wallet" class="w-4 h-4 inline mr-2"></lucide-angular>
            Payments
          </button>
        </div>

        <!-- Profile Tab -->
        <div *ngIf="activeTab === 'profile'" class="space-y-6">
          <!-- User Info Card -->
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  [value]="user?.firstName + ' ' + user?.lastName"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [value]="user?.email"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  [value]="user?.phoneNumber || 'Not provided'"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  [value]="user?.address || 'Not provided'"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              <!-- Member Since -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <input
                  type="text"
                  [value]="user?.createdAt | date: 'MMM dd, yyyy'"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              <!-- Account Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <input
                  type="text"
                  [value]="user?.isActive ? 'Active' : 'Inactive'"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <!-- Edit Profile Button -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <button
                (click)="goToEditProfile()"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Security</h2>
            <button
              (click)="goToChangePassword()"
              class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>

        <!-- Subscription Tab -->
        <div *ngIf="activeTab === 'subscription'" class="space-y-6">
          <div *ngIf="currentSubscription" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Current Subscription</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-blue-600 font-semibold mb-2">Plan Name</p>
                <p class="text-xl font-bold text-gray-900">{{ currentSubscription.planName }}</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-sm text-green-600 font-semibold mb-2">Status</p>
                <span class="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                  {{ currentSubscription.status }}
                </span>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <p class="text-sm text-purple-600 font-semibold mb-2">Expiry Date</p>
                <p class="text-xl font-bold text-gray-900">{{ currentSubscription.endDate | date: 'MMM dd, yyyy' }}</p>
              </div>
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-sm text-yellow-600 font-semibold mb-2">Price</p>
                <p class="text-xl font-bold text-gray-900">₹{{ currentSubscription.price / 100 | number: '1.2-2' }}</p>
              </div>
            </div>

            <button (click)="goToMySubscription()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              View Full Subscription Details
            </button>
          </div>

          <div *ngIf="!currentSubscription" class="text-center py-12">
            <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
            <p class="text-gray-600 mb-6">Browse available plans and subscribe to enjoy benefits.</p>
            <button
              (click)="goToSubscriptionPlans()"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Plans
            </button>
          </div>
        </div>

        <!-- Borrowing Tab -->
        <div *ngIf="activeTab === 'borrowing'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Borrowing Statistics</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-blue-50 p-6 rounded-lg text-center">
                <lucide-angular name="book-open" class="w-8 h-8 text-blue-600 mx-auto mb-2"></lucide-angular>
                <p class="text-3xl font-bold text-blue-600">{{ activeLoans }}</p>
                <p class="text-gray-600">Active Loans</p>
              </div>
              <div class="bg-red-50 p-6 rounded-lg text-center">
                <lucide-angular name="alert-circle" class="w-8 h-8 text-red-600 mx-auto mb-2"></lucide-angular>
                <p class="text-3xl font-bold text-red-600">{{ overdueLoans }}</p>
                <p class="text-gray-600">Overdue Loans</p>
              </div>
              <div class="bg-green-50 p-6 rounded-lg text-center">
                <lucide-angular name="check-circle" class="w-8 h-8 text-green-600 mx-auto mb-2"></lucide-angular>
                <p class="text-3xl font-bold text-green-600">{{ returnedLoans }}</p>
                <p class="text-gray-600">Returned Loans</p>
              </div>
            </div>

            <button
              (click)="goToMyLoans()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View All Loans
            </button>
          </div>
        </div>

        <!-- Payments Tab -->
        <div *ngIf="activeTab === 'payments'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>

            <div *ngIf="paymentHistory.length > 0" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-900">Amount</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let payment of paymentHistory" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-gray-900">{{ payment.createdAt | date: 'MMM dd, yyyy' }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ payment.paymentType }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900">₹{{ payment.amount / 100 | number: '1.2-2' }}</td>
                    <td class="px-6 py-4">
                      <span
                        [ngClass]="{
                          'bg-green-100 text-green-800': payment.paymentStatus === 'COMPLETED',
                          'bg-yellow-100 text-yellow-800': payment.paymentStatus === 'INITIATED',
                          'bg-red-100 text-red-800': payment.paymentStatus === 'FAILED'
                        }"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ payment.paymentStatus }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="paymentHistory.length === 0" class="text-center py-12">
              <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
              <p class="text-gray-600">No payment history found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any = null;
  currentSubscription: any = null;
  paymentHistory: any[] = [];
  activeTab: 'profile' | 'subscription' | 'borrowing' | 'payments' = 'profile';
  loading = true;
  errorMessage = '';
  successMessage = '';
  activeLoans = 0;
  overdueLoans = 0;
  returnedLoans = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private bookLoanService: BookLoanService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfileData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfileData() {
    this.loading = true;
    this.errorMessage = '';

    // Load user profile
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          this.user = user;
          this.loadSubscription();
          this.loadBorrowingStats();
          this.loadPaymentHistory();
        },
        error: error => {
          console.error('Failed to load user profile:', error);
          this.errorMessage = 'Failed to load profile';
          this.loading = false;
        },
      });
  }

  loadSubscription() {
    this.subscriptionService
      .getUserActiveSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subscription => {
          this.currentSubscription = subscription;
        },
        error: error => {
          console.log('No active subscription found');
        },
      });
  }

  loadBorrowingStats() {
    this.bookLoanService
      .getMyBookLoans(undefined, 0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          const loans = response.content || response;
          this.activeLoans = loans.filter((l: any) => l.status === 'CHECKED_OUT').length;
          this.overdueLoans = loans.filter((l: any) => l.isOverdue).length;
          this.returnedLoans = loans.filter((l: any) => l.status === 'RETURNED').length;
        },
        error: error => {
          console.error('Failed to load borrowing stats:', error);
        },
      });
  }

  loadPaymentHistory() {
    this.paymentService
      .getAllPayments(0, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.paymentHistory = response.content || response;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load payment history:', error);
          this.loading = false;
        },
      });
  }

  goToEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  goToChangePassword() {
    this.router.navigate(['/profile/change-password']);
  }

  goToMyLoans() {
    this.router.navigate(['/book-loans']);
  }

  goToMySubscription() {
    this.router.navigate(['/subscriptions/my-subscription']);
  }

  goToSubscriptionPlans() {
    this.router.navigate(['/subscriptions']);
  }
}
