import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SubscriptionService } from '@services/subscription.service';
import { SubscriptionDTO } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-subscriptions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Subscriptions Management</h1>
        <p class="text-gray-600 mb-6">Total: {{ filteredSubscriptions.length }} subscriptions</p>
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

      <!-- Filters -->
      <div class="card mb-6 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search by User -->
          <div>
            <label class="form-label">Search by User</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              placeholder="User email or ID"
              class="form-input"
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="form-label">Filter by Status</label>
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterSubscriptions()"
              class="form-input"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
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

      <!-- Subscriptions Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Email</th>
                <th>Plan Name</th>
                <th>Max Books</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sub of paginatedSubscriptions">
                <td>{{ sub.id }}</td>
                <td>{{ sub.userEmail || 'N/A' }}</td>
                <td>{{ sub.planName || 'N/A' }}</td>
                <td class="text-center">{{ sub.maxBooksAllowed || '-' }}</td>
                <td>{{ sub.startDate | date: 'MMM dd, yyyy' }}</td>
                <td>{{ sub.endDate | date: 'MMM dd, yyyy' }}</td>
                <td>
                  <span [ngClass]="getStatusBadgeClass(sub.status)">
                    {{ sub.status }}
                  </span>
                </td>
                <td>
                  <button (click)="viewDetails(sub)" title="View Details" class="text-blue-600 hover:text-blue-900">
                    <lucide-angular name="eye" class="w-4 h-4"></lucide-angular>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredSubscriptions.length === 0" class="text-center py-12">
          <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
          <p class="text-gray-600 font-medium">No subscriptions found</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredSubscriptions.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Page {{ currentPage + 1 }} of {{ totalPages }} ({{ filteredSubscriptions.length }} total)
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
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Subscription Details</h2>
          <button (click)="closeDetailsModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedSubscription" class="space-y-4">
          <!-- ID -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Subscription ID</label>
            <p class="text-lg text-gray-900 font-semibold">{{ selectedSubscription.id }}</p>
          </div>

          <!-- User Info -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">User Email</label>
            <p class="text-lg text-gray-900">{{ selectedSubscription.userEmail || 'N/A' }}</p>
          </div>

          <!-- Plan -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Plan Name</label>
            <p class="text-lg text-gray-900">{{ selectedSubscription.planName || 'N/A' }}</p>
          </div>

          <!-- Max Books -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Max Books Allowed</label>
            <p class="text-lg text-gray-900">{{ selectedSubscription.maxBooksAllowed || '-' }}</p>
          </div>

          <!-- Price -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Price</label>
            <p class="text-lg text-gray-900 font-semibold">
              ₹{{ selectedSubscription.price || 'N/A' }}
            </p>
          </div>

          <!-- Dates -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Start Date</label>
            <p class="text-lg text-gray-900">
              {{ selectedSubscription.startDate | date: 'MMM dd, yyyy (hh:mm a)' }}
            </p>
          </div>

          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">End Date</label>
            <p class="text-lg text-gray-900">
              {{ selectedSubscription.endDate | date: 'MMM dd, yyyy (hh:mm a)' }}
            </p>
          </div>

          <!-- Status -->
          <div class="border-b pb-3">
            <label class="text-sm font-medium text-gray-600">Status</label>
            <span [ngClass]="getStatusBadgeClass(selectedSubscription.status)" class="text-lg">
              {{ selectedSubscription.status }}
            </span>
          </div>

          <!-- Actions -->
          <div class="pt-4 flex gap-3">
            <button (click)="closeDetailsModal()" class="btn btn-secondary flex-1">Close</button>
            <button
              *ngIf="selectedSubscription.status === 'ACTIVE'"
              (click)="cancelSubscription(selectedSubscription)"
              [disabled]="isCancelling"
              class="btn btn-danger flex-1"
            >
              <span *ngIf="!isCancelling">Cancel</span>
              <span *ngIf="isCancelling" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SubscriptionsListComponent implements OnInit, OnDestroy {
  subscriptions: SubscriptionDTO[] = [];
  filteredSubscriptions: SubscriptionDTO[] = [];
  paginatedSubscriptions: SubscriptionDTO[] = [];

  loading = true;
  isCancelling = false;
  showDetailsModal = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus: SubscriptionStatus | '' = '';
  currentPage = 0;
  pageSize = 10;

  selectedSubscription: Subscription | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private subscriptionService: SubscriptionService) {
    this.setupSearch();
  }

  ngOnInit() {
    this.loadSubscriptions();
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
        this.filterSubscriptions();
      });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  loadSubscriptions() {
    this.loading = true;

    this.subscriptionService
      .getAllSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subscriptions => {
          this.subscriptions = subscriptions;
          this.filterSubscriptions();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load subscriptions:', error);
          const errorCode = error.status || 'unknown';
          
          switch (errorCode) {
            case 401:
              this.errorMessage = 'Unauthorized. Please login again.';
              break;
            case 403:
              this.errorMessage = 'You do not have permission to view subscriptions.';
              break;
            case 404:
              this.errorMessage = 'Subscriptions not found.';
              break;
            case 500:
              this.errorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.errorMessage = 'Failed to load subscriptions. Please try again.';
          }
          
          this.loading = false;
        },
      });
  }

  filterSubscriptions() {
    this.currentPage = 0;
    
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const matchesSearch =
        !this.searchTerm ||
        (sub.userEmail && sub.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (sub.userId && sub.userId.toString().includes(this.searchTerm)) ||
        (sub.id && sub.id.toString().includes(this.searchTerm));

      const matchesStatus = !this.selectedStatus || sub.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSubscriptions = this.filteredSubscriptions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSubscriptions.length / this.pageSize);
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
    this.filterSubscriptions();
  }

  viewDetails(subscription: Subscription) {
    this.selectedSubscription = subscription;
    this.showDetailsModal = true;
  }

  closeDetailsModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showDetailsModal = false;
    this.selectedSubscription = null;
  }

  cancelSubscription(subscription: Subscription) {
    if (!confirm(`Are you sure you want to cancel this subscription?`)) return;

    this.isCancelling = true;

    this.subscriptionService
      .cancelSubscription(subscription.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Subscription cancelled successfully';
          this.closeDetailsModal();
          this.loadSubscriptions();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: error => {
          console.error('Failed to cancel subscription:', error);
          const errorCode = error.status || 'unknown';
          
          switch (errorCode) {
            case 400:
              this.errorMessage = 'Invalid subscription. Cannot cancel.';
              break;
            case 401:
              this.errorMessage = 'Unauthorized. Please login again.';
              break;
            case 403:
              this.errorMessage = 'You do not have permission to cancel subscriptions.';
              break;
            case 404:
              this.errorMessage = 'Subscription not found.';
              break;
            case 500:
              this.errorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.errorMessage = 'Failed to cancel subscription. Please try again.';
          }
          
          setTimeout(() => (this.errorMessage = null), 5000);
          this.isCancelling = false;
        },
      });
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      ACTIVE: 'badge badge-success',
      EXPIRED: 'badge badge-error',
      CANCELLED: 'badge badge-warning',
    };
    return classMap[status] || 'badge badge-info';
  }
}
