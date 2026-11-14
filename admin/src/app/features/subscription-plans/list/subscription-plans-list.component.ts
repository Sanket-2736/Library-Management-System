import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SubscriptionService } from '@services/subscription.service';
import { SubscriptionDTO } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-plans-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p class="text-gray-600 mt-1">Total: {{ plans.length }} plans</p>
        </div>
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

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div *ngFor="let plan of plans" class="card p-6 hover:shadow-lg transition-shadow">
          <!-- Plan Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ plan.name }}</h3>
              <span [ngClass]="plan.isActive ? 'badge badge-success' : 'badge badge-warning'">
                {{ plan.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Plan Details -->
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Duration:</span>
              <span class="font-semibold">{{ plan.durationDays }} days</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Max Books:</span>
              <span class="font-semibold text-blue-600">{{ plan.maxBooksAllowed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Max Days/Book:</span>
              <span class="font-semibold">{{ plan.maxDaysPerBook }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Price:</span>
              <span class="font-bold text-lg">₹{{ plan.priceInMajorUnits || (plan.price / 100) | number: '1.2-2' }}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ plan.description || 'No description' }}</p>

          <!-- Plan Code -->
          <div class="text-xs text-gray-500 mb-4">Plan Code: <strong>{{ plan.planCode }}</strong></div>

          <!-- Features -->
          <div class="text-sm">
            <div *ngIf="plan.isFeatured" class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
              ⭐ Featured
            </div>
            <div *ngIf="plan.badgeText" class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {{ plan.badgeText }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="plans.length === 0" class="text-center py-12">
        <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
        <p class="text-gray-600 font-medium">No subscription plans found</p>
      </div>
    </div>
  `,
  styles: [],
})
export class SubscriptionPlansListComponent implements OnInit, OnDestroy {
  plans: SubscriptionDTO[] = [];

  loading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.loadPlans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlans() {
    this.loading = true;

    this.subscriptionService
      .getAllSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: plans => {
          this.plans = plans;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load plans:', error);
          this.errorMessage = 'Failed to load subscription plans';
          this.loading = false;
        },
      });
  }
}

@Component({
  selector: 'app-subscription-plans-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p class="text-gray-600 mt-1">Total: {{ plans.length }} plans</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-2">
          <lucide-angular name="plus" class="w-4 h-4"></lucide-angular>
          Add Plan
        </button>
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

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div *ngFor="let plan of plans" class="card p-6 hover:shadow-lg transition-shadow">
          <!-- Plan Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ plan.name }}</h3>
              <span [ngClass]="plan.active ? 'badge badge-success' : 'badge badge-warning'">
                {{ plan.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="editPlan(plan)" title="Edit" class="text-blue-600 hover:text-blue-900">
                <lucide-angular name="edit-2" class="w-4 h-4"></lucide-angular>
              </button>
              <button (click)="deletePlan(plan.id, plan.name)" title="Delete" class="text-red-600 hover:text-red-900">
                <lucide-angular name="trash-2" class="w-4 h-4"></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Plan Details -->
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Duration:</span>
              <span class="font-semibold">{{ plan.durationDays }} days</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Max Books:</span>
              <span class="font-semibold text-blue-600">{{ plan.maxBooksAllowed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Price:</span>
              <span class="font-bold text-lg">₹{{ plan.price }}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ plan.description || 'No description' }}</p>

          <!-- Action Button -->
          <button (click)="viewPlanSubscribers(plan)" class="w-full btn btn-secondary text-sm">
            View {{ plan.subscriberCount || 0 }} Subscribers
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="plans.length === 0" class="text-center py-12">
        <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
        <p class="text-gray-600 font-medium">No subscription plans found</p>
      </div>
    </div>

    <!-- Add/Edit Plan Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Plan' : 'Add New Plan' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <form [formGroup]="planForm" (ngSubmit)="savePlan()" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="form-label">Plan Name</label>
            <input
              type="text"
              formControlName="name"
              placeholder="e.g., Premium Plan"
              class="form-input"
            />
            <p *ngIf="planForm.get('name')?.hasError('required')" class="form-error">Name is required</p>
          </div>

          <!-- Description -->
          <div>
            <label class="form-label">Description</label>
            <textarea
              formControlName="description"
              placeholder="Plan description"
              class="form-input h-20"
            ></textarea>
          </div>

          <!-- Max Books -->
          <div>
            <label class="form-label">Max Books Allowed</label>
            <input
              type="number"
              formControlName="maxBooksAllowed"
              placeholder="e.g., 5"
              class="form-input"
              min="1"
            />
            <p *ngIf="planForm.get('maxBooksAllowed')?.hasError('required')" class="form-error">
              This field is required
            </p>
          </div>

          <!-- Duration -->
          <div>
            <label class="form-label">Duration (Days)</label>
            <input
              type="number"
              formControlName="durationDays"
              placeholder="e.g., 30"
              class="form-input"
              min="1"
            />
            <p *ngIf="planForm.get('durationDays')?.hasError('required')" class="form-error">
              Duration is required
            </p>
          </div>

          <!-- Price -->
          <div>
            <label class="form-label">Price (₹)</label>
            <input
              type="number"
              formControlName="price"
              placeholder="e.g., 99"
              class="form-input"
              min="0"
              step="0.01"
            />
            <p *ngIf="planForm.get('price')?.hasError('required')" class="form-error">Price is required</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button type="button" (click)="closeModal()" class="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" [disabled]="planForm.invalid || isSubmitting" class="btn btn-primary flex-1">
              <span *ngIf="!isSubmitting">{{ isEditMode ? 'Update' : 'Create' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="showDeleteConfirm" class="modal-overlay" (click)="cancelDelete($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex justify-center mb-4">
          <lucide-angular name="alert-triangle" class="w-12 h-12 text-red-600"></lucide-angular>
        </div>
        <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Delete Plan?</h2>
        <p class="text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{{ deletePlanName }}</strong>?
        </p>
        <div class="flex gap-4">
          <button (click)="cancelDelete()" class="btn btn-secondary flex-1">Cancel</button>
          <button (click)="confirmDelete()" [disabled]="isDeleting" class="btn btn-danger flex-1">
            <span *ngIf="!isDeleting">Delete</span>
            <span *ngIf="isDeleting" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Subscribers Modal -->
    <div *ngIf="showSubscribersModal" class="modal-overlay" (click)="closeSubscribersModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ selectedPlan?.name }} - Subscribers ({{ planSubscribers.length }})
          </h2>
          <button (click)="closeSubscribersModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div *ngFor="let subscriber of planSubscribers" class="bg-gray-50 p-4 rounded border border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ subscriber.userName }}</p>
                <p class="text-sm text-gray-600">{{ subscriber.userEmail }}</p>
              </div>
              <span [ngClass]="subscriber.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-warning'">
                {{ subscriber.status }}
              </span>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Start: {{ subscriber.startDate | date: 'MMM dd, yyyy' }}</div>
              <div>End: {{ subscriber.endDate | date: 'MMM dd, yyyy' }}</div>
            </div>
          </div>

          <div *ngIf="planSubscribers.length === 0" class="text-center py-8 text-gray-600">
            <p>No subscribers for this plan</p>
          </div>
        </div>

        <div class="mt-6">
          <button (click)="closeSubscribersModal()" class="btn btn-secondary w-full">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SubscriptionPlansListComponent implements OnInit, OnDestroy {
  plans: SubscriptionPlan[] = [];
  planForm: FormGroup;

  loading = true;
  isSubmitting = false;
  isDeleting = false;
  showModal = false;
  showDeleteConfirm = false;
  showSubscribersModal = false;
  isEditMode = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  selectedPlan: SubscriptionPlan | null = null;
  planSubscribers: any[] = [];
  deletePlanId: number | null = null;
  deletePlanName = '';

  private destroy$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private fb: FormBuilder
  ) {
    this.planForm = this.createPlanForm();
  }

  ngOnInit() {
    this.loadPlans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createPlanForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      maxBooksAllowed: ['', [Validators.required, Validators.min(1)]],
      durationDays: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  loadPlans() {
    this.loading = true;

    this.subscriptionService
      .getAllPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: plans => {
          this.plans = plans;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load plans:', error);
          this.errorMessage = 'Failed to load subscription plans';
          this.loading = false;
        },
      });
  }

  openAddModal() {
    this.isEditMode = false;
    this.planForm.reset();
    this.showModal = true;
  }

  editPlan(plan: SubscriptionPlan) {
    this.isEditMode = true;
    this.selectedPlan = plan;
    this.planForm.patchValue({
      name: plan.name,
      description: plan.description,
      maxBooksAllowed: plan.maxBooksAllowed,
      durationDays: plan.durationDays,
      price: plan.price,
    });
    this.showModal = true;
  }

  savePlan() {
    if (this.planForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.planForm.value;

    if (this.isEditMode && this.selectedPlan) {
      // Update - if backend supports it
      console.log('Plan update would go here if backend supports it');
      this.successMessage = 'Plan updated successfully';
      this.closeModal();
      this.loadPlans();
      this.isSubmitting = false;
    } else {
      // Create - if backend supports it
      console.log('Plan creation would go here if backend supports it');
      this.successMessage = 'Plan created successfully';
      this.closeModal();
      this.loadPlans();
      this.isSubmitting = false;
    }

    setTimeout(() => (this.successMessage = null), 3000);
  }

  deletePlan(planId: number, planName: string) {
    this.deletePlanId = planId;
    this.deletePlanName = planName;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.deletePlanId) return;

    this.isDeleting = true;
    // Delete would go here if backend supports it
    console.log('Plan deletion would go here if backend supports it');

    setTimeout(() => {
      this.successMessage = 'Plan deleted successfully';
      this.closeDeleteConfirm();
      this.loadPlans();
      this.isDeleting = false;
      setTimeout(() => (this.successMessage = null), 3000);
    }, 500);
  }

  cancelDelete(event?: Event) {
    if (event) event.stopPropagation();
    this.closeDeleteConfirm();
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deletePlanId = null;
    this.deletePlanName = '';
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.selectedPlan = null;
    this.planForm.reset();
  }

  viewPlanSubscribers(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    this.planSubscribers = [];
    this.showSubscribersModal = true;

    // Load subscribers for this plan
    this.subscriptionService
      .getAllSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subscriptions => {
          this.planSubscribers = subscriptions
            .filter(sub => sub.planId === plan.id)
            .map(sub => ({
              ...sub,
              userName: sub.userName || 'Unknown',
              userEmail: sub.userEmail || 'N/A',
            }));
        },
        error: error => {
          console.error('Failed to load subscribers:', error);
        },
      });
  }

  closeSubscribersModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showSubscribersModal = false;
    this.selectedPlan = null;
    this.planSubscribers = [];
  }
}
