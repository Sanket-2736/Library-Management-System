import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📚</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">LibraryHub</h1>
          <p class="text-gray-600 mt-2">Welcome back</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-input"
              [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <p *ngIf="loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched"
              class="form-error">
              Email is required
            </p>
            <p *ngIf="loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched"
              class="form-error">
              Please enter a valid email
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="form-label">Password</label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter your password"
                class="form-input pr-10"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
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
            <p *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched"
              class="form-error">
              Password is required
            </p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              formControlName="rememberMe"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
            />
            <label for="rememberMe" class="ml-2 text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="btn btn-primary w-full mt-6 font-semibold"
          >
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </span>
          </button>
        </form>

        <!-- Links -->
        <div class="space-y-3 mt-6 text-center">
          <div>
            <a routerLink="/auth/forgot-password" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Forgot your password?
            </a>
          </div>
          <div class="border-t pt-3">
            <p class="text-gray-600 text-sm">
              Don't have an account?
              <a routerLink="/auth/signup" class="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up here
              </a>
            </p>
          </div>
        </div>

        <!-- Demo credentials (Development only) -->
        <div *ngIf="isDevelopment" class="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-xs text-blue-700 font-medium mb-2">Demo Credentials:</p>
          <p class="text-xs text-blue-600">Email: test@example.com</p>
          <p class="text-xs text-blue-600">Password: password123</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  isDevelopment = true; // Set to false in production

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const request = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authService
      .login(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage =
            error.message || 'Login failed. Please check your email and password.';
          this.isLoading = false;
        },
      });
  }
}
