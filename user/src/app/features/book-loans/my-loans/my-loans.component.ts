import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BookLoanService } from '@core/services/book-loan.service';
import { BookLoan, BookLoanStatus, PageResponse, RenewalRequest } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-loans',
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
              <h1 class="text-4xl font-bold mb-2">My Book Loans</h1>
              <p class="text-blue-100">Manage your borrowed books</p>
            </div>
            <lucide-angular name="book-open" class="w-16 h-16 opacity-50"></lucide-angular>
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

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <lucide-angular name="filter" class="w-4 h-4 inline mr-1"></lucide-angular>
                Filter by Status
              </label>
              <select
                [(ngModel)]="selectedStatus"
                (change)="onStatusChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">All Loans</option>
                <option value="CHECKED_OUT">Active</option>
                <option value="RETURNED">Returned</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

            <!-- Clear Filter -->
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

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div class="text-center">
              <p class="text-gray-600 text-sm mb-1">Active Loans</p>
              <p class="text-2xl font-bold text-blue-600">{{ activeCount }}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-600 text-sm mb-1">Overdue</p>
              <p class="text-2xl font-bold text-red-600">{{ overdueCount }}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-600 text-sm mb-1">Returned</p>
              <p class="text-2xl font-bold text-green-600">{{ returnedCount }}</p>
            </div>
          </div>
        </div>

        <!-- Loans Table (Desktop) -->
        <div *ngIf="!loading && loans.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden mb-8 hidden lg:block">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Book</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Checkout Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Days</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let loan of loans" class="hover:bg-gray-50 transition">
                  <!-- Book Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <lucide-angular name="book" class="w-5 h-5 text-gray-400"></lucide-angular>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Book #{{ loan.bookId }}</p>
                        <p class="text-xs text-gray-500">ID: {{ loan.id }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Checkout Date -->
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ loan.checkoutDate | date: 'MMM dd, yyyy' }}
                  </td>

                  <!-- Due Date -->
                  <td class="px-6 py-4 text-sm">
                    <span
                      [class.text-red-600]="loan.isOverdue"
                      [class.font-bold]="loan.isOverdue"
                      [class.text-gray-900]="!loan.isOverdue"
                    >
                      {{ loan.dueDate | date: 'MMM dd, yyyy' }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-sm">
                    <span
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': loan.status === 'CHECKED_OUT',
                        'bg-green-100 text-green-800': loan.status === 'RETURNED',
                        'bg-red-100 text-red-800': loan.status === 'OVERDUE' || loan.isOverdue
                      }"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ getLoanStatus(loan) }}
                    </span>
                  </td>

                  <!-- Days -->
                  <td class="px-6 py-4 text-sm font-medium">
                    <span
                      [ngClass]="{
                        'text-red-600': getDaysRemaining(loan) < 0,
                        'text-orange-600': getDaysRemaining(loan) > 0 && getDaysRemaining(loan) <= 3,
                        'text-gray-900': getDaysRemaining(loan) > 3
                      }"
                    >
                      {{ getDaysRemaining(loan) }}
                      {{ getDaysRemaining(loan) < 0 ? 'overdue' : 'remaining' }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        *ngIf="canRenew(loan)"
                        (click)="renewLoan(loan)"
                        [disabled]="renewingId === loan.id"
                        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition text-xs font-medium"
                      >
                        <span *ngIf="renewingId !== loan.id">Renew</span>
                        <span *ngIf="renewingId === loan.id" class="flex items-center gap-1">
                          <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </span>
                      </button>
                      <button
                        (click)="viewDetails(loan)"
                        class="px-3 py-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
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

        <!-- Loans Cards (Mobile) -->
        <div *ngIf="!loading && loans.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:hidden">
          <div *ngFor="let loan of loans" class="bg-white rounded-lg shadow-md p-6 border-l-4" [ngClass]="getLoanBorderColor(loan)">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-semibold text-gray-900">Book #{{ loan.bookId }}</p>
                <p class="text-xs text-gray-500">Loan ID: {{ loan.id }}</p>
              </div>
              <span
                [ngClass]="{
                  'bg-blue-100 text-blue-800': loan.status === 'CHECKED_OUT',
                  'bg-green-100 text-green-800': loan.status === 'RETURNED',
                  'bg-red-100 text-red-800': loan.status === 'OVERDUE' || loan.isOverdue
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ getLoanStatus(loan) }}
              </span>
            </div>

            <!-- Dates -->
            <div class="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Checkout:</span>
                <span class="font-medium">{{ loan.checkoutDate | date: 'MMM dd, yyyy' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Due:</span>
                <span [class.text-red-600]="loan.isOverdue" [class.font-bold]="loan.isOverdue" class="font-medium">
                  {{ loan.dueDate | date: 'MMM dd, yyyy' }}
                </span>
              </div>
              <div *ngIf="loan.returnDate" class="flex justify-between">
                <span class="text-gray-600 text-sm">Returned:</span>
                <span class="font-medium">{{ loan.returnDate | date: 'MMM dd, yyyy' }}</span>
              </div>
            </div>

            <!-- Days Info -->
            <div class="bg-gray-50 p-3 rounded mb-4">
              <p class="text-xs text-gray-600 mb-1">Days</p>
              <p
                [ngClass]="{
                  'text-red-600': getDaysRemaining(loan) < 0,
                  'text-orange-600': getDaysRemaining(loan) > 0 && getDaysRemaining(loan) <= 3,
                  'text-gray-900': getDaysRemaining(loan) > 3
                }"
                class="text-lg font-bold"
              >
                {{ getDaysRemaining(loan) }}
                {{ getDaysRemaining(loan) < 0 ? 'overdue' : 'remaining' }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                *ngIf="canRenew(loan)"
                (click)="renewLoan(loan)"
                [disabled]="renewingId === loan.id"
                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium"
              >
                <span *ngIf="renewingId !== loan.id">Renew</span>
                <span *ngIf="renewingId === loan.id" class="flex items-center justify-center gap-1">
                  <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              </button>
              <button
                (click)="viewDetails(loan)"
                class="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition text-sm font-medium"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && loans.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Loans Found</h3>
          <p class="text-gray-600 mb-6">
            {{ selectedStatus ? 'No loans match your filter.' : 'You have no book loans yet.' }}
          </p>
          <button
            (click)="goToCatalog()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Books
          </button>
        </div>

        <!-- Renewal Confirmation Dialog -->
        <div *ngIf="showRenewalDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Renew Loan?</h3>
            <p class="text-gray-600 mb-4">
              This book will be due in another 14 days. You have {{ selectedLoan?.maxRenewals }} total renewals allowed.
            </p>
            <div class="flex gap-3">
              <button
                (click)="cancelRenewal()"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmRenewal()"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyLoansComponent implements OnInit, OnDestroy {
  loans: BookLoan[] = [];

  // Filter & State
  selectedStatus: string = '';
  loading = true;
  showRenewalDialog = false;
  selectedLoan: BookLoan | null = null;
  renewingId: number | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Stats
  activeCount = 0;
  overdueCount = 0;
  returnedCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private bookLoanService: BookLoanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLoans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLoans() {
    this.loading = true;
    this.errorMessage = '';

    const status = this.selectedStatus ? (this.selectedStatus as BookLoanStatus) : undefined;

    this.bookLoanService
      .getMyBookLoans(status, 0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.loans = response.content;
          this.calculateStats();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load loans:', error);
          this.errorMessage = 'Failed to load loans. Please try again.';
          this.loading = false;
        },
      });
  }

  calculateStats() {
    this.activeCount = this.loans.filter(l => l.status === 'CHECKED_OUT').length;
    this.overdueCount = this.loans.filter(l => l.isOverdue).length;
    this.returnedCount = this.loans.filter(l => l.status === 'RETURNED').length;
  }

  onStatusChange() {
    this.loadLoans();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.loadLoans();
  }

  canRenew(loan: BookLoan): boolean {
    return (
      loan.status === 'CHECKED_OUT' &&
      !loan.isOverdue &&
      loan.renewalCount < loan.maxRenewals
    );
  }

  getLoanStatus(loan: BookLoan): string {
    if (loan.isOverdue) return 'Overdue';
    return loan.status === 'CHECKED_OUT' ? 'Active' : loan.status === 'RETURNED' ? 'Returned' : loan.status;
  }

  getLoanBorderColor(loan: BookLoan): string {
    if (loan.isOverdue) return 'border-red-500';
    if (loan.status === 'CHECKED_OUT') return 'border-blue-500';
    return 'border-gray-300';
  }

  getDaysRemaining(loan: BookLoan): number {
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  renewLoan(loan: BookLoan) {
    this.selectedLoan = loan;
    this.showRenewalDialog = true;
  }

  cancelRenewal() {
    this.showRenewalDialog = false;
    this.selectedLoan = null;
  }

  confirmRenewal() {
    if (!this.selectedLoan) return;

    this.renewingId = this.selectedLoan.id;
    this.showRenewalDialog = false;

    const renewRequest: RenewalRequest = {
      bookLoanId: this.selectedLoan.id,
      extensionDays: 14,
    };

    this.bookLoanService
      .renewCheckout(renewRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Book renewed successfully!';
          this.renewingId = null;
          setTimeout(() => {
            this.loadLoans();
            this.successMessage = '';
          }, 1500);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to renew book';
          this.errorMessage = errorMsg;
          this.renewingId = null;
        },
      });
  }

  viewDetails(loan: BookLoan) {
    // Navigate to loan details page if needed
    console.log('View loan details:', loan);
  }

  goToCatalog() {
    this.router.navigate(['/books']);
  }
}
