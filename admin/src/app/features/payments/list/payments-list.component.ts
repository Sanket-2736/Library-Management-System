import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaymentService } from '@services/payment.service';
import { PaymentDTO, PaymentStatus } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Payments Management</h1>
        <p class="text-gray-600 mb-6">Total: {{ filteredPayments.length }} payments</p>
      </div>

      <!-- Messages -->
      <div *ngIf="successMessage" class="alert alert-success mb-6">
        <lucide-angular name="check-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ successMessage }}</span>
        <button (click)="successMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error mb-6">
        <lucide-angular name="alert-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ errorMessage }}</span>
        <button (click)="errorMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <!-- Revenue Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Total Revenue -->
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">₹{{ totalRevenue.toFixed(2) }}</p>
            </div>
            <lucide-angular name="wallet" class="w-10 h-10 text-blue-600 opacity-20"></lucide-angular>
          </div>
        </div>

        <!-- Successful Payments -->
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Successful Payments</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ successCount }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ successPercentage }}%</p>
            </div>
            <lucide-angular name="check-circle" class="w-10 h-10 text-green-600 opacity-20"></lucide-angular>
          </div>
        </div>

        <!-- Pending/Failed Payments -->
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Pending/Failed</p>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ failedPendingCount }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ failedPendingPercentage }}%</p>
            </div>
            <lucide-angular name="alert-circle" class="w-10 h-10 text-red-600 opacity-20"></lucide-angular>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label class="form-label">Search by Payment ID</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              placeholder="Payment ID or Order ID"
              class="form-input"
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="form-label">Filter by Status</label>
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterPayments()"
              class="form-input"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="flex items-end">
            <button (click)="clearFilters()" class="btn btn-secondary w-full">
              <lucide-angular name="rotate-ccw" class="w-4 h-4"></lucide-angular>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Subscription ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Razorpay Order ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of paginatedPayments">
                <td class="font-mono">{{ payment.id }}</td>
                <td class="font-mono">{{ payment.subscriptionId }}</td>
                <td class="font-bold">₹{{ payment.amount.toFixed(2) }}</td>
                <td>
                  <span [ngClass]="getStatusBadgeClass(payment.status)">
                    {{ payment.status }}
                  </span>
                </td>
                <td>{{ payment.paymentDate | date: 'MMM dd, yyyy (hh:mm a)' }}</td>
                <td>
                  <span class="text-xs text-gray-600 font-mono">
                    {{ payment.razorpayOrderId ? payment.razorpayOrderId.substring(0, 12) + '...' : 'N/A' }}
                  </span>
                </td>
                <td>
                  <button (click)="viewDetails(payment)" title="View Details" class="text-blue-600 hover:text-blue-900">
                    <lucide-angular name="eye" class="w-4 h-4"></lucide-angular>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredPayments.length === 0" class="text-center py-12">
          <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
          <p class="text-gray-600 font-medium">No payments found</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredPayments.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Page {{ currentPage + 1 }} of {{ totalPages }} ({{ filteredPayments.length }} total)
          </div>
          <div class="flex gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 0"
              class="btn btn-sm btn-secondary"
            >
              <lucide-angular name="chevron-left" class="w-4 h-4"></lucide-angular>
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages - 1"
              class="btn btn-sm btn-secondary"
            >
              <lucide-angular name="chevron-right" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div *ngIf="showDetailsModal" class="modal-overlay" (click)="closeDetailsModal($event)">
      <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button (click)="closeDetailsModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedPayment" class="space-y-4">
          <!-- Payment ID -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Payment ID</label>
            <p class="text-lg text-gray-900 font-mono">{{ selectedPayment.id }}</p>
          </div>

          <!-- Amount & Status -->
          <div class="grid grid-cols-2 gap-4 border-b pb-3">
            <div>
              <label class="text-sm font-medium text-gray-600">Amount</label>
              <p class="text-lg text-gray-900 font-bold">₹{{ selectedPayment.amount.toFixed(2) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Status</label>
              <span [ngClass]="getStatusBadgeClass(selectedPayment.status)" class="text-lg">
                {{ selectedPayment.status }}
              </span>
            </div>
          </div>

          <!-- Subscription ID -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Subscription ID</label>
            <p class="text-lg text-gray-900 font-mono">{{ selectedPayment.subscriptionId }}</p>
          </div>

          <!-- Payment Date -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Payment Date</label>
            <p class="text-lg text-gray-900">{{ selectedPayment.paymentDate | date: 'MMM dd, yyyy (hh:mm a)' }}</p>
          </div>

          <!-- Razorpay Information -->
          <div class="bg-blue-50 p-4 rounded border border-blue-200">
            <p class="font-semibold text-blue-900 mb-3">Razorpay Information</p>
            <div class="space-y-2">
              <div>
                <label class="text-xs font-medium text-blue-700">Order ID</label>
                <p class="text-sm text-blue-900 font-mono break-all">
                  {{ selectedPayment.razorpayOrderId || 'N/A' }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-blue-700">Payment ID</label>
                <p class="text-sm text-blue-900 font-mono break-all">
                  {{ selectedPayment.razorpayPaymentId || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Created/Updated Timestamps -->
          <div class="grid grid-cols-2 gap-4 pt-3">
            <div>
              <label class="text-xs font-medium text-gray-600">Created</label>
              <p class="text-sm text-gray-900">
                {{ selectedPayment.createdAt | date: 'MMM dd, yyyy' }}
              </p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-600">Updated</label>
              <p class="text-sm text-gray-900">
                {{ selectedPayment.updatedAt | date: 'MMM dd, yyyy' }}
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <div class="pt-4">
            <button (click)="closeDetailsModal()" class="btn btn-secondary w-full">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class PaymentsListComponent implements OnInit, OnDestroy {
  payments: PaymentDTO[] = [];
  filteredPayments: PaymentDTO[] = [];
  paginatedPayments: PaymentDTO[] = [];

  loading = true;
  showDetailsModal = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus: PaymentStatus | '' = '';
  currentPage = 0;
  pageSize = 10;

  selectedPayment: Payment | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private paymentService: PaymentService) {
    this.setupSearch();
  }

  ngOnInit() {
    this.loadPayments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.filterPayments();
      });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  loadPayments() {
    this.loading = true;

    this.paymentService
      .getAllPayments(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.payments = response.content || response;
          this.filterPayments();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load payments:', error);
          const errorCode = error.status || 'unknown';
          
          switch (errorCode) {
            case 401:
              this.errorMessage = 'Unauthorized. Please login again.';
              break;
            case 403:
              this.errorMessage = 'You do not have permission to view payments.';
              break;
            case 404:
              this.errorMessage = 'Payments not found.';
              break;
            case 500:
              this.errorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.errorMessage = 'Failed to load payments. Please try again.';
          }
          
          this.loading = false;
        },
      });
  }

  filterPayments() {
    this.currentPage = 0;
    
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch =
        !this.searchTerm ||
        (payment.id && payment.id.toString().includes(this.searchTerm)) ||
        (payment.razorpayOrderId && payment.razorpayOrderId.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (payment.razorpayPaymentId && payment.razorpayPaymentId.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = !this.selectedStatus || payment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPayments = this.filteredPayments.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.pageSize);
  }

  get totalRevenue(): number {
    return this.payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  get successCount(): number {
    return this.payments.filter(p => p.status === 'SUCCESS').length;
  }

  get failedPendingCount(): number {
    return this.payments.filter(p => p.status === 'FAILED' || p.status === 'PENDING').length;
  }

  get successPercentage(): number {
    if (this.payments.length === 0) return 0;
    return Math.round((this.successCount / this.payments.length) * 100);
  }

  get failedPendingPercentage(): number {
    if (this.payments.length === 0) return 0;
    return Math.round((this.failedPendingCount / this.payments.length) * 100);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filterPayments();
  }

  viewDetails(payment: Payment) {
    this.selectedPayment = payment;
    this.showDetailsModal = true;
  }

  closeDetailsModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showDetailsModal = false;
    this.selectedPayment = null;
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      SUCCESS: 'badge badge-success',
      FAILED: 'badge badge-error',
      PENDING: 'badge badge-warning',
    };
    return classMap[status] || 'badge badge-info';
  }
}
