import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🔑</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p class="text-gray-600 mt-2">Enter your email to receive a reset link</p>
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="Enter your registered email"
              class="form-input"
              [class.border-red-500]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched"
            />
            <p *ngIf="forgotForm.get('email')?.hasError('required') && forgotForm.get('email')?.touched"
              class="form-error">
              Email is required
            </p>
            <p *ngIf="forgotForm.get('email')?.hasError('email') && forgotForm.get('email')?.touched"
              class="form-error">
              Please enter a valid email
            </p>
          </div>

          <button
            type="submit"
            [disabled]="forgotForm.invalid || isLoading"
            class="btn btn-primary w-full mt-6 font-semibold"
          >
            <span *ngIf="!isLoading">Send Reset Link</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </span>
          </button>
        </form>

        <!-- Back to Login -->
        <div class="text-center mt-6 border-t pt-4">
          <p class="text-gray-600 text-sm">
            Remember your password?
            <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-700 font-semibold">
              Back to login
            </a>
          </p>
        </div>

        <!-- Info Box -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Check your email (including spam folder) for the password reset link. The link will expire in 24 hours.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ForgotPasswordComponent implements OnDestroy {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const request = this.forgotForm.value;

    this.authService
      .forgotPassword(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage =
            'Password reset link sent! Check your email to continue.';
          this.forgotForm.reset();
          setTimeout(() => this.router.navigate(['/auth/login']), 4000);
        },
        error: (error) => {
          console.error('Forgot password failed:', error);
          this.errorMessage =
            error.message || 'Failed to send reset link. Please try again.';
          this.isLoading = false;
        },
      });
  }
}
