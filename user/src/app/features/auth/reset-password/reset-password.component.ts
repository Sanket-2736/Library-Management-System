import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🔐</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p class="text-gray-600 mt-2">Create a strong password for your account</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Form -->
        <form [formGroup]="resetForm" (ngSubmit)="onReset()" class="space-y-4">
          <!-- New Password -->
          <div>
            <label class="form-label">New Password</label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter new password"
                class="form-input pr-10"
                [class.border-red-500]="isFieldInvalid('password')"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility('password')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <svg *ngIf="!showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
                <svg *ngIf="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                  <path d="M15.171 13.576l1.414 1.414a1 1 0 00.707-.293l.707-.707a1 1 0 000-1.414l-2.828-2.829"></path>
                </svg>
              </button>
            </div>
            <p *ngIf="isFieldInvalid('password')" class="form-error">
              <span *ngIf="resetForm.get('password')?.hasError('required')">Password is required</span>
              <span *ngIf="resetForm.get('password')?.hasError('minlength')">Min 8 characters</span>
            </p>
            <!-- Password strength -->
            <div class="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                [ngClass]="getPasswordStrengthColor()"
                [style.width.%]="getPasswordStrength()"
                class="h-full transition-all duration-300"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ getPasswordStrengthText() }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="form-label">Confirm Password</label>
            <div class="relative">
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Confirm password"
                class="form-input pr-10"
                [class.border-red-500]="isFieldInvalid('confirmPassword')"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility('confirm')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <svg *ngIf="!showConfirmPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
                <svg *ngIf="showConfirmPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                  <path d="M15.171 13.576l1.414 1.414a1 1 0 00.707-.293l.707-.707a1 1 0 000-1.414l-2.828-2.829"></path>
                </svg>
              </button>
            </div>
            <p *ngIf="isFieldInvalid('confirmPassword')" class="form-error">
              <span *ngIf="resetForm.get('confirmPassword')?.hasError('required')">Please confirm password</span>
              <span *ngIf="resetForm.hasError('passwordMismatch')">Passwords do not match</span>
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="resetForm.invalid || isLoading"
            class="btn btn-primary w-full mt-6 font-semibold"
          >
            <span *ngIf="!isLoading">Reset Password</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Resetting...
            </span>
          </button>
        </form>

        <!-- Back to Login -->
        <div class="text-center mt-6 border-t pt-4">
          <p class="text-gray-600 text-sm">
            <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-700 font-semibold">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  private destroy$ = new Subject<void>();
  private resetToken: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.paramMap.get('token') || '';
    if (!this.resetToken) {
      this.errorMessage = 'Invalid reset link. Please request a new password reset.';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getPasswordStrength(): number {
    const password = this.resetForm.get('password')?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;

    return strength;
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-yellow-500';
    if (strength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onReset(): void {
    if (this.resetForm.invalid || !this.resetToken) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const request = {
      token: this.resetToken,
      password: this.resetForm.get('password')?.value,
    };

    this.authService
      .resetPassword(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Password reset successfully! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          this.errorMessage =
            error.message || 'Failed to reset password. Please try again.';
          this.isLoading = false;
        },
      });
  }
}
