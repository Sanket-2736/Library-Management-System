import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FineService } from '@core/services/fine.service';
import { Fine, FineFilter, FineStatus, FineType, PaymentInitiateResponse } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-fines',
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
      <div class="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">My Fines</h1>
              <p class="text-red-100">View and pay outstanding fines</p>
            </div>
            <lucide-angular name="alert-triangle" class="w-16 h-16 opacity-50"></lucide-angular>
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

        <!-- Outstanding Balance Card -->
        <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-8 mb-8 border border-red-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-red-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Outstanding</p>
              <p class="text-4xl font-bold text-red-800">₹{{ totalOutstanding / 100 | number: '1.2-2' }}</p>
            </div>
            <div>
              <p class="text-orange-600 text-sm font-semibold uppercase tracking-wider mb-2">Partially Paid</p>
              <p class="text-3xl font-bold text-orange-800">{{ partiallyPaidCount }}</p>
            </div>
            <div>
              <p class="text-green-600 text-sm font-semibold uppercase tracking-wider mb-2">Paid</p>
              <p class="text-3xl font-bold text-green-800">{{ paidCount }}</p>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <lucide-angular name="filter" class="w-4 h-4 inline mr-1"></lucide-angular>
                Filter by Status
              </label>
              <select
                [(ngModel)]="selectedStatus"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              >
                <option value="">All Fines</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="PAID">Paid</option>
                <option value="WAIVED">Waived</option>
              </select>
            </div>

            <!-- Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <lucide-angular name="filter" class="w-4 h-4 inline mr-1"></lucide-angular>
                Filter by Type
              </label>
              <select
                [(ngModel)]="selectedType"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              >
                <option value="">All Types</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DAMAGE">Damage</option>
                <option value="LOSS">Loss</option>
                <option value="PROCESSING">Processing</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                (click)="clearFilters()"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition w-full justify-center"
              >
                <lucide-angular name="rotate-ccw" class="w-4 h-4"></lucide-angular>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Fines Table (Desktop) -->
        <div *ngIf="!loading && fines.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden mb-8 hidden lg:block">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fine ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Paid</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let fine of fines" class="hover:bg-gray-50 transition">
                  <!-- Fine ID -->
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ fine.id }}</td>

                  <!-- Type -->
                  <td class="px-6 py-4 text-sm">
                    <span [ngClass]="getFineTypeBadge(fine.fineType)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ fine.fineType }}
                    </span>
                  </td>

                  <!-- Amount -->
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">₹{{ fine.amount / 100 | number: '1.2-2' }}</td>

                  <!-- Paid Amount -->
                  <td class="px-6 py-4 text-sm font-medium text-green-600">₹{{ fine.amountPaid / 100 | number: '1.2-2' }}</td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-sm">
                    <span [ngClass]="getFineStatusBadge(fine.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ fine.status }}
                    </span>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4 text-sm text-gray-900">{{ fine.createdAt | date: 'MMM dd, yyyy' }}</td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        *ngIf="canPay(fine)"
                        (click)="payFine(fine)"
                        [disabled]="payingId === fine.id"
                        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition text-xs font-medium"
                      >
                        <span *ngIf="payingId !== fine.id">Pay</span>
                        <span *ngIf="payingId === fine.id" class="flex items-center gap-1">
                          <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </span>
                      </button>
                      <button
                        (click)="viewDetails(fine)"
                        class="px-3 py-1 text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fines Cards (Mobile) -->
        <div *ngIf="!loading && fines.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:hidden">
          <div *ngFor="let fine of fines" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-semibold text-gray-900">Fine #{{ fine.id }}</p>
                <p class="text-xs text-gray-500">{{ fine.createdAt | date: 'MMM dd, yyyy' }}</p>
              </div>
              <span [ngClass]="getFineStatusBadge(fine.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ fine.status }}
              </span>
            </div>

            <!-- Type -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <span [ngClass]="getFineTypeBadge(fine.fineType)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ fine.fineType }}
              </span>
            </div>

            <!-- Amount Info -->
            <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Total Amount:</span>
                <span class="font-bold text-red-600">₹{{ fine.amount / 100 | number: '1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Paid:</span>
                <span class="font-bold text-green-600">₹{{ fine.amountPaid / 100 | number: '1.2-2' }}</span>
              </div>
              <div *ngIf="getOutstandingAmount(fine) > 0" class="flex justify-between">
                <span class="text-gray-600 text-sm">Outstanding:</span>
                <span class="font-bold text-orange-600">₹{{ getOutstandingAmount(fine) / 100 | number: '1.2-2' }}</span>
              </div>
            </div>

            <!-- Progress Bar (if partially paid) -->
            <div *ngIf="fine.status === 'PARTIALLY_PAID'" class="mb-4">
              <div class="flex justify-between mb-2">
                <span class="text-xs text-gray-600">Payment Progress</span>
                <span class="text-xs font-semibold text-gray-700">{{ getPaymentPercentage(fine) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" [style.width.%]="getPaymentPercentage(fine)"></div>
              </div>
            </div>

            <!-- Paid Date (if applicable) -->
            <div *ngIf="fine.paidAt" class="mb-4 pb-4 border-b border-gray-200">
              <p class="text-xs text-gray-600">Paid On:</p>
              <p class="font-medium text-gray-900">{{ fine.paidAt | date: 'MMM dd, yyyy, hh:mm a' }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                *ngIf="canPay(fine)"
                (click)="payFine(fine)"
                [disabled]="payingId === fine.id"
                class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition text-sm font-medium"
              >
                <span *ngIf="payingId !== fine.id">Pay Fine</span>
                <span *ngIf="payingId === fine.id" class="flex items-center justify-center gap-1">
                  <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              </button>
              <button
                (click)="viewDetails(fine)"
                class="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition text-sm font-medium"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && fines.length === 0" class="text-center py-16">
          <lucide-angular name="check-circle" class="w-16 h-16 text-green-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Fines</h3>
          <p class="text-gray-600">
            {{ selectedStatus || selectedType ? 'No fines match your filter.' : 'You have no outstanding fines!' }}
          </p>
        </div>

        <!-- Payment Info Alert -->
        <div *ngIf="!loading && fines.length > 0 && totalOutstanding > 0" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="info" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-blue-800 text-sm">
              <strong>Payment Note:</strong> Click the "Pay" button on any fine to initiate payment through Razorpay. Your transaction will be
              processed securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyFinesComponent implements OnInit, OnDestroy {
  fines: Fine[] = [];

  // Filter & State
  selectedStatus: string = '';
  selectedType: string = '';
  loading = true;
  payingId: number | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Stats
  totalOutstanding = 0;
  partiallyPaidCount = 0;
  paidCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fineService: FineService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFines();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFines() {
    this.loading = true;
    this.errorMessage = '';

    const filter: FineFilter = {
      status: this.selectedStatus ? (this.selectedStatus as FineStatus) : undefined,
      type: this.selectedType ? (this.selectedType as FineType) : undefined,
    };

    this.fineService
      .getMyFines(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: fines => {
          this.fines = fines;
          this.calculateStats();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load fines:', error);
          this.errorMessage = 'Failed to load fines. Please try again.';
          this.loading = false;
        },
      });
  }

  calculateStats() {
    this.totalOutstanding = this.fines.reduce((sum, fine) => {
      if (fine.status === 'PENDING' || fine.status === 'PARTIALLY_PAID') {
        return sum + (fine.amount - fine.amountPaid);
      }
      return sum;
    }, 0);

    this.partiallyPaidCount = this.fines.filter(f => f.status === 'PARTIALLY_PAID').length;
    this.paidCount = this.fines.filter(f => f.status === 'PAID' || f.status === 'WAIVED').length;
  }

  onFilterChange() {
    this.loadFines();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.selectedType = '';
    this.loadFines();
  }

  canPay(fine: Fine): boolean {
    return fine.status === 'PENDING' || fine.status === 'PARTIALLY_PAID';
  }

  getOutstandingAmount(fine: Fine): number {
    return fine.amount - fine.amountPaid;
  }

  getPaymentPercentage(fine: Fine): number {
    if (fine.amount === 0) return 0;
    return Math.round((fine.amountPaid / fine.amount) * 100);
  }

  getFineTypeBadge(type: FineType): string {
    const badges: Record<FineType, string> = {
      [FineType.OVERDUE]: 'bg-red-100 text-red-800',
      [FineType.DAMAGE]: 'bg-orange-100 text-orange-800',
      [FineType.LOSS]: 'bg-purple-100 text-purple-800',
      [FineType.PROCESSING]: 'bg-yellow-100 text-yellow-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  }

  getFineStatusBadge(status: FineStatus): string {
    const badges: Record<FineStatus, string> = {
      [FineStatus.PENDING]: 'bg-red-100 text-red-800',
      [FineStatus.PARTIALLY_PAID]: 'bg-yellow-100 text-yellow-800',
      [FineStatus.PAID]: 'bg-green-100 text-green-800',
      [FineStatus.WAIVED]: 'bg-blue-100 text-blue-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }

  payFine(fine: Fine) {
    if (this.payingId) return; // Prevent multiple simultaneous payments

    this.payingId = fine.id;
    this.errorMessage = '';

    this.fineService
      .payFine(fine.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaymentInitiateResponse) => {
          this.payingId = null;
          // Handle Razorpay payment initiation
          this.successMessage = `Payment initiated. Razorpay Order ID: ${response.orderId}`;
          console.log('Payment response:', response);

          // Store payment data for later verification
          sessionStorage.setItem('lastFinePayment', JSON.stringify({ fineId: fine.id, orderId: response.orderId }));

          // In a real app, you would open Razorpay checkout here
          // For now, just show the order ID
          setTimeout(() => {
            this.successMessage = '';
            // Optionally reload fines to show updated status
            // this.loadFines();
          }, 5000);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to initiate payment';
          this.errorMessage = errorMsg;
          this.payingId = null;
          console.error('Payment error:', error);
        },
      });
  }

  viewDetails(fine: Fine) {
    console.log('View fine details:', fine);
    // Could navigate to a detail page if needed
  }
}
