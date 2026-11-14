import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '@core/services/user.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
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
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-2">Edit Profile</h1>
          <p class="text-blue-100">Update your personal information</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <!-- Edit Form -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('firstName')"
                />
                <p *ngIf="isFieldInvalid('firstName')" class="mt-1 text-sm text-red-600">First name is required</p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('lastName')"
                />
                <p *ngIf="isFieldInvalid('lastName')" class="mt-1 text-sm text-red-600">Last name is required</p>
              </div>

              <!-- Email (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [value]="profileForm.get('email')?.value"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  formControlName="phoneNumber"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  formControlName="address"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                [disabled]="!profileForm.valid || submitting"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {{ submitting ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      address: [''],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserData() {
    this.loading = true;
    this.errorMessage = '';

    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
          });
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load user data:', error);
          this.errorMessage = 'Failed to load user data';
          this.loading = false;
        },
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (!this.profileForm.valid) return;

    this.submitting = true;
    this.errorMessage = '';

    const updateData = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
      address: this.profileForm.get('address')?.value,
    };

    this.userService
      .updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to update profile';
          this.errorMessage = errorMsg;
          this.submitting = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
