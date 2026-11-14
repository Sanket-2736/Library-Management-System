import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SubscriptionService } from '@core/services/subscription.service';
import { PaymentService } from '@core/services/payment.service';
import { SubscriptionPlan } from '@core/models/subscription.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var Razorpay: any;

@Component({
  selector: 'app-subscription-plans',
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
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">Subscription Plans</h1>
              <p class="text-indigo-100">Choose the perfect plan for your reading needs</p>
            </div>
            <lucide-angular name="package" class="w-16 h-16 opacity-50"></lucide-angular>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Messages -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="alert-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-red-800 font-medium">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Plans Grid -->
        <div *ngIf="!loading && plans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let plan of plans"
            [class.ring-2]="plan.isFeatured"
            [class.ring-indigo-500]="plan.isFeatured"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <!-- Plan Header -->
            <div class="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 pt-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ plan.planCode }}</p>
                </div>
                <span
                  *ngIf="plan.badgeText"
                  class="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full"
                >
                  {{ plan.badgeText }}
                </span>
              </div>

              <!-- Price -->
              <div class="mb-6">
                <span class="text-5xl font-bold text-gray-900">₹{{ plan.price / 100 | number: '1.2-2' }}</span>
                <span class="text-gray-600 ml-2">/{{ plan.durationDays }} days</span>
              </div>

              <!-- Duration Badge -->
              <div class="mb-4">
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {{ plan.durationDays }} Days
                </span>
              </div>
            </div>

            <!-- Plan Body -->
            <div class="px-6 py-8">
              <!-- Description -->
              <p class="text-gray-600 mb-6">{{ plan.description || 'No description available' }}</p>

              <!-- Features -->
              <div class="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <div class="flex items-start gap-3">
                  <lucide-angular name="check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
                  <div>
                    <p class="font-semibold text-gray-900">{{ plan.maxBooksAllowed }} Books</p>
                    <p class="text-sm text-gray-600">Maximum books allowed</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <lucide-angular name="check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
                  <div>
                    <p class="font-semibold text-gray-900">{{ plan.maxDaysPerBook }} Days Per Book</p>
                    <p class="text-sm text-gray-600">Lending period per book</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <lucide-angular name="check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
                  <div>
                    <p class="font-semibold text-gray-900">{{ plan.currencyCode }}</p>
                    <p class="text-sm text-gray-600">Currency</p>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="mb-6">
                <span
                  [ngClass]="{
                    'bg-green-100 text-green-800': plan.isActive,
                    'bg-gray-100 text-gray-800': !plan.isActive
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ plan.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <!-- Subscribe Button -->
            <div class="px-6 pb-6">
              <button
                *ngIf="plan.isActive"
                (click)="subscribeToPlan(plan)"
                [disabled]="subscribingPlanId === plan.id"
                class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-semibold"
              >
                <span *ngIf="subscribingPlanId !== plan.id">Subscribe Now</span>
                <span *ngIf="subscribingPlanId === plan.id" class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              </button>
              <button *ngIf="!plan.isActive" disabled class="w-full px-4 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold">
                Inactive Plan
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && plans.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Plans Available</h3>
          <p class="text-gray-600">No subscription plans are currently available.</p>
        </div>

        <!-- View My Subscription Link -->
        <div class="text-center mt-12 pt-8 border-t border-gray-200">
          <p class="text-gray-600 mb-4">Already have a subscription?</p>
          <button
            (click)="goToMySubscription()"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            View My Subscription
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SubscriptionPlansComponent implements OnInit, OnDestroy {
  plans: SubscriptionPlan[] = [];
  loading = true;
  errorMessage = '';
  subscribingPlanId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlans() {
    this.loading = true;
    this.errorMessage = '';

    this.subscriptionService
      .getAllPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: plans => {
          this.plans = plans.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load plans:', error);
          this.errorMessage = 'Failed to load subscription plans. Please try again.';
          this.loading = false;
        },
      });
  }

  subscribeToPlan(plan: SubscriptionPlan) {
    if (this.subscribingPlanId) return;

    this.subscribingPlanId = plan.id;
    this.errorMessage = '';

    // Initiate payment through backend
    this.subscriptionService
      .subscribe({ planId: plan.id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          console.log('Payment initiated:', response);
          // Open Razorpay checkout
          this.openRazorpayCheckout(response, plan);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to initiate payment';
          this.errorMessage = errorMsg;
          this.subscribingPlanId = null;
          console.error('Payment initiation error:', error);
        },
      });
  }

  private openRazorpayCheckout(paymentResponse: any, plan: SubscriptionPlan) {
    const options = {
      key: paymentResponse.razorpayKeyId, // Razorpay key from backend response
      order_id: paymentResponse.orderId,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency || 'INR',
      name: 'Library Management System',
      description: `Subscription: ${plan.name} - ${plan.durationDays} Days`,
      handler: (response: any) => {
        this.verifyAndCompletePayment(response, plan);
      },
      prefill: {
        name: '', // User name if available
        email: '', // User email if available
      },
      theme: {
        color: '#4F46E5',
      },
      modal: {
        ondismiss: () => {
          this.subscribingPlanId = null;
          console.log('Checkout dismissed');
        },
      },
    };

    try {
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      this.errorMessage = 'Failed to open payment checkout. Please try again.';
      this.subscribingPlanId = null;
      console.error('Razorpay error:', error);
    }
  }

  private verifyAndCompletePayment(razorpayResponse: any, plan: SubscriptionPlan) {
    // Send verification to backend
    this.paymentService
      .verifyPayment({
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          console.log('Payment verified:', response);
          this.subscribingPlanId = null;
          // Navigate to subscription page or show success
          this.router.navigate(['/subscriptions/my-subscription']);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Payment verification failed';
          this.errorMessage = errorMsg;
          this.subscribingPlanId = null;
          console.error('Payment verification error:', error);
        },
      });
  }

  goToMySubscription() {
    this.router.navigate(['/subscriptions/my-subscription']);
  }
}
