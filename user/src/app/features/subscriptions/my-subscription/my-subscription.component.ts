import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SubscriptionService } from '@core/services/subscription.service';
import { Subscription } from '@core/models/subscription.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-subscription',
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
      <div class="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">My Subscription</h1>
              <p class="text-green-100">Manage your current subscription</p>
            </div>
            <lucide-angular name="credit-card" class="w-16 h-16 opacity-50"></lucide-angular>
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

        <!-- Active Subscription Card -->
        <div *ngIf="!loading && subscription" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">{{ subscription.planName }}</h2>
              <p class="text-gray-600 mt-1">Current Subscription</p>
            </div>
            <span [ngClass]="getStatusBadge(subscription.status)" class="px-4 py-2 rounded-lg text-white font-semibold">
              {{ subscription.status }}
            </span>
          </div>

          <!-- Subscription Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Start Date -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">Start Date</p>
              <p class="text-2xl font-bold text-gray-900">{{ subscription.startDate | date: 'MMM dd, yyyy' }}</p>
            </div>

            <!-- End Date -->
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-2">Expiry Date</p>
              <p class="text-2xl font-bold text-gray-900">{{ subscription.endDate | date: 'MMM dd, yyyy' }}</p>
            </div>

            <!-- Days Remaining -->
            <div [ngClass]="getDaysRemainingColor(daysRemaining)" class="p-4 rounded-lg">
              <p class="text-sm font-semibold uppercase tracking-wider mb-2">Days Remaining</p>
              <p class="text-2xl font-bold">{{ daysRemaining }}</p>
            </div>

            <!-- Price -->
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-green-600 font-semibold uppercase tracking-wider mb-2">Subscription Price</p>
              <p class="text-2xl font-bold text-gray-900">₹{{ subscription.price / 100 | number: '1.2-2' }}</p>
            </div>
          </div>

          <!-- Plan Features -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Plan Features</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
                <div>
                  <p class="font-semibold text-gray-900">{{ subscription.maxBooksAllowed }} Books</p>
                  <p class="text-sm text-gray-600">Maximum books allowed</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <lucide-angular name="check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
                <div>
                  <p class="font-semibold text-gray-900">{{ subscription.durationDays }} Days</p>
                  <p class="text-sm text-gray-600">Subscription duration</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              *ngIf="subscription.status === 'ACTIVE'"
              (click)="showCancelDialog = true"
              class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cancel Subscription
            </button>
            <button
              (click)="goToPlans()"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View Other Plans
            </button>
          </div>
        </div>

        <!-- No Subscription State -->
        <div *ngIf="!loading && !subscription" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p class="text-gray-600 mb-6">You don't have an active subscription yet.</p>
          <button (click)="goToPlans()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Browse Plans
          </button>
        </div>

        <!-- Subscription History -->
        <div *ngIf="!loading && subscriptionHistory.length > 0" class="mt-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Subscription History</h3>

          <!-- History Table (Desktop) -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8 hidden lg:block">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Plan</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">End Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let item of subscriptionHistory" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ item.planName }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ item.startDate | date: 'MMM dd, yyyy' }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ item.endDate | date: 'MMM dd, yyyy' }}</td>
                    <td class="px-6 py-4">
                      <span [ngClass]="getStatusBadge(item.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-900">{{ item.durationDays }} days</td>
                    <td class="px-6 py-4 font-medium text-gray-900">₹{{ item.price / 100 | number: '1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- History Cards (Mobile) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
            <div *ngFor="let item of subscriptionHistory" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h4 class="text-lg font-bold text-gray-900 mb-4">{{ item.planName }}</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Start:</span>
                  <span class="font-medium">{{ item.startDate | date: 'MMM dd, yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">End:</span>
                  <span class="font-medium">{{ item.endDate | date: 'MMM dd, yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Duration:</span>
                  <span class="font-medium">{{ item.durationDays }} days</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Price:</span>
                  <span class="font-medium">₹{{ item.price / 100 | number: '1.2-2' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span [ngClass]="getStatusBadge(item.status)" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ item.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cancel Confirmation Dialog -->
      <div *ngIf="showCancelDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md shadow-lg">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Cancel Subscription?</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to cancel your subscription? You will lose access to your subscription benefits immediately.
          </p>
          <div class="flex gap-3">
            <button
              (click)="showCancelDialog = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
            >
              Keep Subscription
            </button>
            <button
              (click)="confirmCancel()"
              [disabled]="cancelling"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition font-medium"
            >
              {{ cancelling ? 'Cancelling...' : 'Cancel Subscription' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MySubscriptionComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  subscriptionHistory: any[] = [];
  loading = true;
  cancelling = false;
  showCancelDialog = false;
  successMessage = '';
  errorMessage = '';
  daysRemaining = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscription() {
    this.loading = true;
    this.errorMessage = '';

    this.subscriptionService
      .getUserActiveSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subscription => {
          this.subscription = subscription;
          this.calculateDaysRemaining();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load subscription:', error);
          // No active subscription is okay
          this.subscription = null;
          this.loading = false;
        },
      });
  }

  calculateDaysRemaining() {
    if (!this.subscription) return;
    const today = new Date();
    const endDate = new Date(this.subscription.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      ACTIVE: 'bg-green-600',
      EXPIRED: 'bg-red-600',
      CANCELLED: 'bg-gray-600',
    };
    return badges[status] || 'bg-blue-600';
  }

  getDaysRemainingColor(days: number): string {
    if (days <= 0) return 'bg-red-50';
    if (days <= 7) return 'bg-yellow-50';
    return 'bg-green-50';
  }

  confirmCancel() {
    if (!this.subscription) return;

    this.cancelling = true;
    this.errorMessage = '';

    this.subscriptionService
      .cancelSubscription(this.subscription.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Subscription cancelled successfully!';
          this.showCancelDialog = false;
          this.cancelling = false;
          setTimeout(() => {
            this.loadSubscription();
            this.successMessage = '';
          }, 2000);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to cancel subscription';
          this.errorMessage = errorMsg;
          this.cancelling = false;
        },
      });
  }

  goToPlans() {
    this.router.navigate(['/subscriptions']);
  }
}
