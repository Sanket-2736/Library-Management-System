import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BookLoanService } from '@services/book-loan.service';
import { BookLoan, BookLoanStatus, BookLoanSearchRequest } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Book Loans Management</h1>
          <p class="text-gray-600 mt-1">Total: {{ totalLoans }} loans</p>
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

      <!-- Filters -->
      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Loan Status Filter -->
          <div>
            <label class="form-label">Loan Status</label>
            <select (change)="onStatusFilter($event)" class="form-select">
              <option [value]="null">All Status</option>
              <option value="CHECKED_OUT">Active</option>
              <option value="RETURNED">Returned</option>
              <option value="OVERDUE">Overdue</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <!-- Overdue Only -->
          <div>
            <label class="form-label">Show Only</label>
            <select (change)="onOverdueFilter($event)" class="form-select">
              <option [value]="false">All Loans</option>
              <option [value]="true">Overdue Only</option>
            </select>
          </div>

          <!-- Search User -->
          <div>
            <label class="form-label">Search User</label>
            <input
              type="text"
              placeholder="User name..."
              class="form-input"
              (keyup)="onUserSearch($event)"
            />
          </div>

          <!-- Search Book -->
          <div>
            <label class="form-label">Search Book</label>
            <input
              type="text"
              placeholder="Book title..."
              class="form-input"
              (keyup)="onBookSearch($event)"
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

      <!-- Loans Table -->
      <div class="card overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Checkout Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Overdue Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of loans">
                <td class="font-medium">{{ loan.userName || 'Unknown' }}</td>
                <td>
                  <button (click)="viewLoan(loan)" class="text-blue-600 hover:underline">
                    {{ loan.bookTitle || 'N/A' }}
                  </button>
                </td>
                <td class="text-sm">{{ loan.checkoutDate | date: 'MMM dd, yyyy' }}</td>
                <td class="text-sm">
                  <span
                    [ngClass]="{
                      'text-green-600': !loan.isOverdue,
                      'text-red-600': loan.isOverdue && loan.status === 'CHECKED_OUT',
                      'text-gray-600': loan.status !== 'CHECKED_OUT'
                    }"
                  >
                    {{ loan.dueDate | date: 'MMM dd, yyyy' }}
                  </span>
                </td>
                <td class="text-sm">{{ loan.returnDate ? (loan.returnDate | date: 'MMM dd, yyyy') : '-' }}</td>
                <td>
                  <span
                    [ngClass]="{
                      'badge badge-success': loan.status === 'RETURNED',
                      'badge badge-warning': loan.status === 'CHECKED_OUT' && !loan.isOverdue,
                      'badge badge-error': loan.isOverdue || loan.status === 'OVERDUE',
                      'badge bg-gray-100 text-gray-700': loan.status === 'LOST'
                    }"
                  >
                    {{ loan.status }}
                  </span>
                </td>
                <td class="text-center">
                  <span
                    *ngIf="loan.overdueDays > 0"
                    class="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold"
                  >
                    {{ loan.overdueDays }} days
                  </span>
                  <span *ngIf="loan.overdueDays <= 0" class="text-gray-600">-</span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="viewLoan(loan)"
                      title="View Details"
                      class="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <lucide-angular name="eye" class="w-4 h-4"></lucide-angular>
                    </button>
                    <button
                      *ngIf="loan.status === 'CHECKED_OUT'"
                      (click)="openCheckinModal(loan)"
                      title="Check In"
                      class="text-green-600 hover:text-green-900 p-1"
                    >
                      <lucide-angular name="check-circle" class="w-4 h-4"></lucide-angular>
                    </button>
                    <button
                      *ngIf="canRenew(loan)"
                      (click)="openRenewModal(loan)"
                      title="Renew"
                      class="text-purple-600 hover:text-purple-900 p-1"
                    >
                      <lucide-angular name="rotate-cw" class="w-4 h-4"></lucide-angular>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div *ngIf="loans.length === 0" class="text-center py-12">
            <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
            <p class="text-gray-600 font-medium">No loans found</p>
            <p class="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Showing {{ currentPage * pageSize + 1 }} to
          {{ Math.min((currentPage + 1) * pageSize, totalLoans) }} of {{ totalLoans }} loans
        </p>
        <div class="flex items-center gap-2">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 0"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50"
          >
            <lucide-angular name="chevron-left" class="w-4 h-4"></lucide-angular>
          </button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </span>
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= totalPages - 1"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50"
          >
            <lucide-angular name="chevron-right" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    </div>

    <!-- Loan Details Modal -->
    <div *ngIf="showDetailsModal" class="modal-overlay" (click)="closeDetailsModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Loan Details</h2>
          <button (click)="closeDetailsModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedLoan" class="space-y-4">
          <!-- User & Book Info -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-600 text-sm font-medium">User</p>
              <p class="text-gray-900 font-semibold">{{ selectedLoan.userName }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-600 text-sm font-medium">Book</p>
              <p class="text-gray-900 font-semibold">{{ selectedLoan.bookTitle }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-600 text-sm font-medium">Author</p>
              <p class="text-gray-900">{{ selectedLoan.bookAuthor || 'N/A' }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-600 text-sm font-medium">ISBN</p>
              <p class="text-gray-900 font-mono">{{ selectedLoan.bookISBN || 'N/A' }}</p>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded border border-blue-200">
              <p class="text-blue-600 text-sm font-medium">Checkout Date</p>
              <p class="text-blue-900 font-semibold">{{ selectedLoan.checkoutDate | date: 'MMM dd, yyyy' }}</p>
            </div>
            <div
              [ngClass]="{
                'bg-green-50 border-green-200': !selectedLoan.isOverdue,
                'bg-red-50 border-red-200': selectedLoan.isOverdue
              }"
              class="p-4 rounded border"
            >
              <p [ngClass]="selectedLoan.isOverdue ? 'text-red-600' : 'text-green-600'" class="text-sm font-medium">
                Due Date
              </p>
              <p
                [ngClass]="selectedLoan.isOverdue ? 'text-red-900' : 'text-green-900'"
                class="font-semibold"
              >
                {{ selectedLoan.dueDate | date: 'MMM dd, yyyy' }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded" *ngIf="selectedLoan.returnDate">
              <p class="text-gray-600 text-sm font-medium">Return Date</p>
              <p class="text-gray-900 font-semibold">{{ selectedLoan.returnDate | date: 'MMM dd, yyyy' }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded" *ngIf="selectedLoan.renewalCount !== undefined">
              <p class="text-gray-600 text-sm font-medium">Renewals</p>
              <p class="text-gray-900 font-semibold">
                {{ selectedLoan.renewalCount }} / {{ selectedLoan.maxRenewals }}
              </p>
            </div>
          </div>

          <!-- Status & Overdue Info -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-600 text-sm font-medium">Status</p>
              <span
                [ngClass]="{
                  'badge badge-success': selectedLoan.status === 'RETURNED',
                  'badge badge-warning': selectedLoan.status === 'CHECKED_OUT' && !selectedLoan.isOverdue,
                  'badge badge-error': selectedLoan.isOverdue || selectedLoan.status === 'OVERDUE'
                }"
              >
                {{ selectedLoan.status }}
              </span>
            </div>
            <div class="bg-gray-50 p-4 rounded" *ngIf="selectedLoan.overdueDays !== undefined">
              <p class="text-gray-600 text-sm font-medium">Overdue Days</p>
              <p [ngClass]="selectedLoan.overdueDays > 0 ? 'text-red-600 font-bold' : 'text-gray-900'">
                {{ selectedLoan.overdueDays > 0 ? selectedLoan.overdueDays + ' days' : 'On time' }}
              </p>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-gray-50 p-4 rounded" *ngIf="selectedLoan.notes">
            <p class="text-gray-600 text-sm font-medium mb-2">Notes</p>
            <p class="text-gray-900">{{ selectedLoan.notes }}</p>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end">
            <button (click)="closeDetailsModal()" class="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Check-In Modal -->
    <div *ngIf="showCheckinModal" class="modal-overlay" (click)="closeCheckinModal($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Check In Book</h2>
          <button (click)="closeCheckinModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <form [formGroup]="checkinForm" (ngSubmit)="submitCheckin()" class="space-y-4">
          <!-- Book Info -->
          <div class="bg-blue-50 p-4 rounded border border-blue-200">
            <p class="text-blue-600 text-sm font-medium">Book</p>
            <p class="text-blue-900 font-semibold">{{ checkingInLoan?.bookTitle }}</p>
          </div>

          <!-- Condition -->
          <div>
            <label class="form-label">Book Condition</label>
            <select formControlName="condition" class="form-select">
              <option value="RETURNED">Good - Returned</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              (click)="closeCheckinModal()"
              class="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="isSubmitting"
              class="btn btn-primary flex-1"
            >
              <span *ngIf="!isSubmitting">Check In</span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Renewal Modal -->
    <div *ngIf="showRenewModal" class="modal-overlay" (click)="closeRenewModal($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Renew Loan</h2>
          <button (click)="closeRenewModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <form [formGroup]="renewForm" (ngSubmit)="submitRenewal()" class="space-y-4">
          <!-- Book Info -->
          <div class="bg-blue-50 p-4 rounded border border-blue-200">
            <p class="text-blue-600 text-sm font-medium">Book</p>
            <p class="text-blue-900 font-semibold">{{ renewingLoan?.bookTitle }}</p>
          </div>

          <!-- Current Due Date -->
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-gray-600 text-sm font-medium">Current Due Date</p>
            <p class="text-gray-900">{{ renewingLoan?.dueDate | date: 'MMM dd, yyyy' }}</p>
          </div>

          <!-- Extension Days -->
          <div>
            <label class="form-label">Extend By (days)</label>
            <input
              type="number"
              formControlName="extensionDays"
              class="form-input"
              min="1"
              max="30"
              placeholder="Enter days to extend"
            />
            <p *ngIf="renewForm.get('extensionDays')?.hasError('required')" class="form-error">
              Extension days required
            </p>
          </div>

          <!-- New Due Date -->
          <div class="bg-blue-50 p-4 rounded" *ngIf="newDueDate">
            <p class="text-blue-600 text-sm font-medium">New Due Date</p>
            <p class="text-blue-900 font-semibold">{{ newDueDate | date: 'MMM dd, yyyy' }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              (click)="closeRenewModal()"
              class="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="renewForm.invalid || isSubmitting"
              class="btn btn-primary flex-1"
            >
              <span *ngIf="!isSubmitting">Renew Loan</span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoansListComponent implements OnInit, OnDestroy {
  loans: BookLoan[] = [];
  totalLoans = 0;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  loading = true;
  isSubmitting = false;

  // Filter states
  selectedStatus: BookLoanStatus | null = null;
  searchUser = '';
  searchBook = '';
  overdueOnly = false;

  // Messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Modal states
  showDetailsModal = false;
  showCheckinModal = false;
  showRenewModal = false;

  selectedLoan: BookLoan | null = null;
  checkingInLoan: BookLoan | null = null;
  renewingLoan: BookLoan | null = null;

  // Forms
  checkinForm: FormGroup;
  renewForm: FormGroup;

  newDueDate: Date | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private bookLoanService: BookLoanService,
    private fb: FormBuilder
  ) {
    this.checkinForm = this.fb.group({
      condition: ['RETURNED'],
    });

    this.renewForm = this.fb.group({
      extensionDays: ['', [Validators.required, Validators.min(1), Validators.max(30)]],
    });
  }

  ngOnInit() {
    this.search();
    this.setupSearchDebounce();
    this.setupRenewalDateUpdate();
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
      .subscribe(() => {
        this.currentPage = 0;
        this.search();
      });
  }

  private setupRenewalDateUpdate() {
    this.renewForm
      .get('extensionDays')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(days => {
        if (this.renewingLoan && days) {
          const dueDate = new Date(this.renewingLoan.dueDate);
          dueDate.setDate(dueDate.getDate() + parseInt(days));
          this.newDueDate = dueDate;
        }
      });
  }

  search() {
    this.loading = true;

    const searchRequest: BookLoanSearchRequest = {
      page: this.currentPage,
      size: this.pageSize,
      overdueOnly: this.overdueOnly || undefined,
      sortBy: 'dueDate',
      sortDirection: 'ASC',
    };

    this.bookLoanService
      .searchBookLoans(searchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          let loans = response.content;

          // Client-side filtering
          if (this.selectedStatus) {
            loans = loans.filter(l => l.status === this.selectedStatus);
          }
          if (this.searchUser.trim()) {
            loans = loans.filter(l =>
              (l.userName || '').toLowerCase().includes(this.searchUser.toLowerCase())
            );
          }
          if (this.searchBook.trim()) {
            loans = loans.filter(l =>
              (l.bookTitle || '').toLowerCase().includes(this.searchBook.toLowerCase())
            );
          }

          this.loans = loans;
          this.currentPage = response.currentPage;
          this.totalLoans = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load loans:', error);
          this.errorMessage = 'Failed to load loans';
          this.loading = false;
        },
      });
  }

  onStatusFilter(event: any) {
    this.selectedStatus = event.target.value ? (event.target.value as BookLoanStatus) : null;
    this.currentPage = 0;
    this.search();
  }

  onOverdueFilter(event: any) {
    this.overdueOnly = event.target.value === 'true';
    this.currentPage = 0;
    this.search();
  }

  onUserSearch(event: any) {
    this.searchUser = event.target.value;
    this.searchSubject.next(this.searchUser);
  }

  onBookSearch(event: any) {
    this.searchBook = event.target.value;
    this.searchSubject.next(this.searchBook);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.search();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.search();
    }
  }

  viewLoan(loan: BookLoan) {
    this.selectedLoan = loan;
    this.showDetailsModal = true;
  }

  closeDetailsModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showDetailsModal = false;
    this.selectedLoan = null;
  }

  openCheckinModal(loan: BookLoan) {
    this.checkingInLoan = loan;
    this.checkinForm.reset({ condition: 'RETURNED' });
    this.showCheckinModal = true;
  }

  closeCheckinModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showCheckinModal = false;
    this.checkingInLoan = null;
  }

  submitCheckin() {
    if (!this.checkingInLoan) return;

    this.isSubmitting = true;

    const checkinRequest = {
      bookLoanId: this.checkingInLoan.id,
      condition: this.checkinForm.get('condition')?.value,
    };

    this.bookLoanService
      .checkinBook(checkinRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Book checked in successfully';
          this.closeCheckinModal();
          this.search();
          this.isSubmitting = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: error => {
          console.error('Failed to check in book:', error);
          this.errorMessage = error.error?.message || 'Failed to check in book';
          this.isSubmitting = false;
        },
      });
  }

  openRenewModal(loan: BookLoan) {
    this.renewingLoan = loan;
    this.renewForm.reset();
    this.newDueDate = null;
    this.showRenewModal = true;
  }

  closeRenewModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showRenewModal = false;
    this.renewingLoan = null;
    this.newDueDate = null;
  }

  submitRenewal() {
    if (!this.renewingLoan || this.renewForm.invalid) return;

    this.isSubmitting = true;

    const renewRequest = {
      bookLoanId: this.renewingLoan.id,
      extensionDays: this.renewForm.get('extensionDays')?.value,
    };

    this.bookLoanService
      .renewCheckout(renewRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Loan renewed successfully';
          this.closeRenewModal();
          this.search();
          this.isSubmitting = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: error => {
          console.error('Failed to renew loan:', error);
          this.errorMessage = error.error?.message || 'Failed to renew loan';
          this.isSubmitting = false;
        },
      });
  }

  canRenew(loan: BookLoan): boolean {
    if (loan.status !== 'CHECKED_OUT') return false;
    if (loan.renewalCount === undefined || loan.maxRenewals === undefined) return false;
    return loan.renewalCount < loan.maxRenewals;
  }

  protected readonly Math = Math;
}
