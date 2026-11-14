import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '@core/services/user.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
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
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-2">Change Password</h1>
          <p class="text-red-100">Update your account security</p>
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

        <!-- Password Change Form -->
        <div class="bg-white rounded-lg shadow-md p-8 max-w-md">
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div class="relative">
                <input
                  [type]="showCurrentPassword ? 'text' : 'password'"
                  formControlName="currentPassword"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('currentPassword')"
                />
                <button
                  type="button"
                  (click)="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-2.5 text-gray-400"
                >
                  <lucide-angular [name]="showCurrentPassword ? 'eye-off' : 'eye'" class="w-5 h-5"></lucide-angular>
                </button>
              </div>
              <p *ngIf="isFieldInvalid('currentPassword')" class="mt-1 text-sm text-red-600">Current password is required</p>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div class="relative">
                <input
                  [type]="showNewPassword ? 'text' : 'password'"
                  formControlName="newPassword"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('newPassword')"
                />
                <button
                  type="button"
                  (click)="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-2.5 text-gray-400"
                >
                  <lucide-angular [name]="showNewPassword ? 'eye-off' : 'eye'" class="w-5 h-5"></lucide-angular>
                </button>
              </div>
              <p *ngIf="isFieldInvalid('newPassword')" class="mt-1 text-sm text-red-600">
                {{ passwordForm.get('newPassword')?.errors?.['required'] ? 'New password is required' : 'Password must be at least 6 characters' }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div class="relative">
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('confirmPassword')"
                />
                <button
                  type="button"
                  (click)="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-2.5 text-gray-400"
                >
                  <lucide-angular [name]="showConfirmPassword ? 'eye-off' : 'eye'" class="w-5 h-5"></lucide-angular>
                </button>
              </div>
              <p *ngIf="isFieldInvalid('confirmPassword')" class="mt-1 text-sm text-red-600">
                {{ passwordForm.get('confirmPassword')?.errors?.['required'] ? 'Confirm password is required' : 'Passwords do not match' }}
              </p>
            </div>

            <!-- Submit Button -->
            <div class="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                [disabled]="!passwordForm.valid || submitting"
                class="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {{ submitting ? 'Updating...' : 'Change Password' }}
              </button>
              <button
                type="button"
                (click)="goBack()"
                class="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          <!-- Password Requirements -->
          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-900 mb-2">Password Requirements:</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li class="flex items-center gap-2">
                <lucide-angular name="check" class="w-4 h-4 text-green-600"></lucide-angular>
                At least 6 characters
              </li>
              <li class="flex items-center gap-2">
                <lucide-angular name="check" class="w-4 h-4 text-green-600"></lucide-angular>
                Passwords must match
              </li>
              <li class="flex items-center gap-2">
                <lucide-angular name="check" class="w-4 h-4 text-green-600"></lucide-angular>
                Current password required
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ChangePasswordComponent implements OnDestroy {
  passwordForm!: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (!this.passwordForm.valid) return;

    this.submitting = true;
    this.errorMessage = '';

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.userService
      .changePassword(currentPassword, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully!';
          this.submitting = false;
          this.passwordForm.reset();
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: error => {
          const errorMsg = error?.error?.message || 'Failed to change password';
          this.errorMessage = errorMsg;
          this.submitting = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
