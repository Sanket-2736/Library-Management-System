import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ReservationService } from '@core/services/reservation.service';
import { Reservation, ReservationStatus } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-reservations',
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
      <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">My Reservations</h1>
              <p class="text-purple-100">Reserve books and check your queue position</p>
            </div>
            <lucide-angular name="bookmark" class="w-16 h-16 opacity-50"></lucide-angular>
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

        <!-- Status Overview Card -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-8 mb-8 border border-purple-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p class="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Reservations</p>
              <p class="text-4xl font-bold text-purple-800">{{ totalReservations }}</p>
            </div>
            <div>
              <p class="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Pending</p>
              <p class="text-3xl font-bold text-blue-800">{{ pendingCount }}</p>
            </div>
            <div>
              <p class="text-green-600 text-sm font-semibold uppercase tracking-wider mb-2">Available</p>
              <p class="text-3xl font-bold text-green-800">{{ availableCount }}</p>
            </div>
            <div>
              <p class="text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-2">Fulfilled</p>
              <p class="text-3xl font-bold text-indigo-800">{{ fulfilledCount }}</p>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <lucide-angular name="filter" class="w-4 h-4 inline mr-1"></lucide-angular>
                Filter by Status
              </label>
              <select
                [(ngModel)]="selectedStatus"
                (change)="onFilterChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">All Reservations</option>
                <option value="PENDING">Pending</option>
                <option value="AVAILABLE">Available</option>
                <option value="FULFILLED">Fulfilled</option>
                <option value="CANCELLED">Cancelled</option>
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

        <!-- Reservations Table (Desktop) -->
        <div *ngIf="!loading && reservations.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden mb-8 hidden lg:block">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Book Title</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Queue Position</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reserved</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Available Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let reservation of reservations" class="hover:bg-gray-50 transition">
                  <!-- Book Title -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <lucide-angular name="book" class="w-5 h-5 text-gray-400"></lucide-angular>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ reservation.bookTitle || 'Unknown Book' }}</p>
                        <p class="text-xs text-gray-500">Book ID: {{ reservation.bookId }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Queue Position -->
                  <td class="px-6 py-4 text-sm">
                    <span *ngIf="reservation.queuePosition" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Position #{{ reservation.queuePosition }}
                    </span>
                    <span *ngIf="!reservation.queuePosition" class="text-gray-500 text-xs italic">N/A</span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-sm">
                    <span [ngClass]="getStatusBadge(reservation.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ reservation.status }}
                    </span>
                  </td>

                  <!-- Reserved Date -->
                  <td class="px-6 py-4 text-sm text-gray-900">{{ reservation.reservedAt | date: 'MMM dd, yyyy' }}</td>

                  <!-- Available Date -->
                  <td class="px-6 py-4 text-sm">
                    <span *ngIf="reservation.availableAt" class="text-gray-900">
                      {{ reservation.availableAt | date: 'MMM dd, yyyy' }}
                    </span>
                    <span *ngIf="!reservation.availableAt && reservation.status === 'PENDING'" class="text-gray-500 text-xs italic">
                      Pending
                    </span>
                    <span *ngIf="!reservation.availableAt && reservation.status !== 'PENDING'" class="text-gray-500 text-xs italic">
                      N/A
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        *ngIf="canCancel(reservation)"
                        (click)="cancelReservation(reservation)"
                        [disabled]="cancelingId === reservation.id"
                        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition text-xs font-medium"
                      >
                        <span *ngIf="cancelingId !== reservation.id">Cancel</span>
                        <span *ngIf="cancelingId === reservation.id" class="flex items-center gap-1">
                          <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </span>
                      </button>
                      <button
                        (click)="viewDetails(reservation)"
                        class="px-3 py-1 text-purple-600 hover:text-purple-800 font-medium text-xs"
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

        <!-- Reservations Cards (Mobile) -->
        <div *ngIf="!loading && reservations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:hidden">
          <div *ngFor="let reservation of reservations" class="bg-white rounded-lg shadow-md p-6 border-l-4" [ngClass]="getStatusBorderColor(reservation.status)">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-semibold text-gray-900">{{ reservation.bookTitle || 'Unknown Book' }}</p>
                <p class="text-xs text-gray-500">Book ID: {{ reservation.bookId }}</p>
              </div>
              <span [ngClass]="getStatusBadge(reservation.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ reservation.status }}
              </span>
            </div>

            <!-- Queue Position Badge -->
            <div *ngIf="reservation.queuePosition" class="mb-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Queue Position #{{ reservation.queuePosition }}
              </span>
            </div>

            <!-- Dates Info -->
            <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Reserved:</span>
                <span class="font-medium">{{ reservation.reservedAt | date: 'MMM dd, yyyy' }}</span>
              </div>
              <div *ngIf="reservation.availableAt" class="flex justify-between">
                <span class="text-gray-600 text-sm">Available:</span>
                <span class="font-medium text-green-600">{{ reservation.availableAt | date: 'MMM dd, yyyy' }}</span>
              </div>
              <div *ngIf="reservation.fulfilledAt" class="flex justify-between">
                <span class="text-gray-600 text-sm">Fulfilled:</span>
                <span class="font-medium text-green-600">{{ reservation.fulfilledAt | date: 'MMM dd, yyyy' }}</span>
              </div>
              <div *ngIf="reservation.cancelledAt" class="flex justify-between">
                <span class="text-gray-600 text-sm">Cancelled:</span>
                <span class="font-medium text-red-600">{{ reservation.cancelledAt | date: 'MMM dd, yyyy' }}</span>
              </div>
            </div>

            <!-- Status Info Message -->
            <div *ngIf="reservation.status === 'PENDING'" class="mb-4 p-3 bg-blue-50 rounded">
              <p class="text-xs text-blue-700">
                Your reservation is in queue. Position: <strong>#{{ reservation.queuePosition }}</strong>
              </p>
            </div>
            <div *ngIf="reservation.status === 'AVAILABLE'" class="mb-4 p-3 bg-green-50 rounded">
              <p class="text-xs text-green-700">
                The book is now available! Please collect it from the library.
              </p>
            </div>
            <div *ngIf="reservation.status === 'FULFILLED'" class="mb-4 p-3 bg-gray-50 rounded">
              <p class="text-xs text-gray-700">This reservation has been fulfilled.</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                *ngIf="canCancel(reservation)"
                (click)="cancelReservation(reservation)"
                [disabled]="cancelingId === reservation.id"
                class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition text-sm font-medium"
              >
                <span *ngIf="cancelingId !== reservation.id">Cancel</span>
                <span *ngIf="cancelingId === reservation.id" class="flex items-center justify-center gap-1">
                  <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              </button>
              <button
                (click)="viewDetails(reservation)"
                class="flex-1 px-3 py-2 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition text-sm font-medium"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && reservations.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Reservations</h3>
          <p class="text-gray-600 mb-6">
            {{ selectedStatus ? 'No reservations match your filter.' : 'You have no reservations yet.' }}
          </p>
          <button
            (click)="goToCatalog()"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Browse Books
          </button>
        </div>

        <!-- Cancel Confirmation Dialog -->
        <div *ngIf="showCancelDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Cancel Reservation?</h3>
            <p class="text-gray-600 mb-6">
              Are you sure you want to cancel the reservation for <strong>{{ selectedReservation?.bookTitle }}</strong>?
            </p>
            <div class="flex gap-3">
              <button
                (click)="cancelDialog()"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
              >
                Keep
              </button>
              <button
                (click)="confirmCancel()"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyReservationsComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];

  // Filter & State
  selectedStatus: string = '';
  loading = true;
  cancelingId: number | null = null;
  showCancelDialog = false;
  selectedReservation: Reservation | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Stats
  totalReservations = 0;
  pendingCount = 0;
  availableCount = 0;
  fulfilledCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReservations() {
    this.loading = true;
    this.errorMessage = '';

    const status = this.selectedStatus ? (this.selectedStatus as ReservationStatus) : undefined;

    this.reservationService
      .getMyReservations(status, 0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          // Handle both array and PageResponse format
          this.reservations = Array.isArray(response) ? response : response.content || response;
          this.calculateStats();
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load reservations:', error);
          this.errorMessage = 'Failed to load reservations. Please try again.';
          this.loading = false;
        },
      });
  }

  calculateStats() {
    this.totalReservations = this.reservations.length;
    this.pendingCount = this.reservations.filter(r => r.status === 'PENDING').length;
    this.availableCount = this.reservations.filter(r => r.status === 'AVAILABLE').length;
    this.fulfilledCount = this.reservations.filter(r => r.status === 'FULFILLED').length;
  }

  onFilterChange() {
    this.loadReservations();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.loadReservations();
  }

  canCancel(reservation: Reservation): boolean {
    return reservation.status === 'PENDING' || reservation.status === 'AVAILABLE';
  }

  getStatusBadge(status: ReservationStatus): string {
    const badges: Record<ReservationStatus, string> = {
      [ReservationStatus.PENDING]: 'bg-blue-100 text-blue-800',
      [ReservationStatus.AVAILABLE]: 'bg-green-100 text-green-800',
      [ReservationStatus.FULFILLED]: 'bg-purple-100 text-purple-800',
      [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [ReservationStatus.EXPIRED]: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusBorderColor(status: ReservationStatus): string {
    const colors: Record<ReservationStatus, string> = {
      [ReservationStatus.PENDING]: 'border-blue-500',
      [ReservationStatus.AVAILABLE]: 'border-green-500',
      [ReservationStatus.FULFILLED]: 'border-purple-500',
      [ReservationStatus.CANCELLED]: 'border-red-500',
      [ReservationStatus.EXPIRED]: 'border-gray-500',
    };
    return colors[status] || 'border-gray-300';
  }

  cancelReservation(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.showCancelDialog = true;
  }

  cancelDialog() {
    this.showCancelDialog = false;
    this.selectedReservation = null;
  }

  confirmCancel() {
    if (!this.selectedReservation) return;

    this.cancelingId = this.selectedReservation.id;
    this.showCancelDialog = false;

    this.reservationService
      .cancelReservation(this.selectedReservation.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Reservation cancelled successfully!';
          this.cancelingId = null;
          setTimeout(() => {
            this.loadReservations();
            this.successMessage = '';
          }, 1500);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to cancel reservation';
          this.errorMessage = errorMsg;
          this.cancelingId = null;
        },
      });
  }

  viewDetails(reservation: Reservation) {
    console.log('View reservation details:', reservation);
    // Could navigate to a detail page if needed
  }

  goToCatalog() {
    this.router.navigate(['/books']);
  }
}
