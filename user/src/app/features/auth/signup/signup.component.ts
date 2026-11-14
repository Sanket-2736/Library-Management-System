import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-12">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📚</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">LibraryHub</h1>
          <p class="text-gray-600 mt-2">Create your account</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Signup Form -->
        <form [formGroup]="signupForm" (ngSubmit)="onSignup()" class="space-y-4">
          <!-- First Name & Last Name (Side by side) -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="form-label text-sm">First Name</label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="First name"
                class="form-input"
                [class.border-red-500]="isFieldInvalid('firstName')"
              />
              <p *ngIf="isFieldInvalid('firstName') && signupForm.get('firstName')?.hasError('required')"
                class="form-error text-xs mt-1">
                First name required
              </p>
            </div>
            <div>
              <label class="form-label text-sm">Last Name</label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Last name"
                class="form-input"
                [class.border-red-500]="isFieldInvalid('lastName')"
              />
              <p *ngIf="isFieldInvalid('lastName') && signupForm.get('lastName')?.hasError('required')"
                class="form-error text-xs mt-1">
                Last name required
              </p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            <p *ngIf="isFieldInvalid('email')" class="form-error">
              <span *ngIf="signupForm.get('email')?.hasError('required')">Email is required</span>
              <span *ngIf="signupForm.get('email')?.hasError('email')">Please enter a valid email</span>
            </p>
          </div>

          <!-- Phone Number (Optional) -->
          <div>
            <label class="form-label">Phone Number <span class="text-gray-500 text-sm">(Optional)</span></label>
            <input
              type="tel"
              formControlName="phoneNumber"
              placeholder="+1 (555) 000-0000"
              class="form-input"
            />
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
              <span *ngIf="signupForm.get('password')?.hasError('required')">Password is required</span>
              <span *ngIf="signupForm.get('password')?.hasError('minlength')">Min 8 characters</span>
            </p>
            <!-- Password strength indicator -->
            <div class="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                [ngClass]="getPasswordStrengthColor()"
                [style.width.%]="getPasswordStrength()"
                class="h-full transition-all duration-300"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ getPasswordStrengthText() }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="form-label">Confirm Password</label>
            <div class="relative">
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
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
              <span *ngIf="signupForm.get('confirmPassword')?.hasError('required')">Please confirm password</span>
              <span *ngIf="signupForm.hasError('passwordMismatch')">Passwords do not match</span>
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="signupForm.invalid || isLoading"
            class="btn btn-primary w-full mt-6 font-semibold"
          >
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="text-center mt-6 border-t pt-4">
          <p class="text-gray-600 text-sm">
            Already have an account?
            <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-700 font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SignupComponent implements OnDestroy {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
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
    const password = this.signupForm.get('password')?.value;
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
    if (strength <= 25) return 'Weak password';
    if (strength <= 50) return 'Fair password';
    if (strength <= 75) return 'Good password';
    return 'Strong password';
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSignup(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const request = {
      firstName: this.signupForm.get('firstName')?.value,
      lastName: this.signupForm.get('lastName')?.value,
      email: this.signupForm.get('email')?.value,
      phoneNumber: this.signupForm.get('phoneNumber')?.value || undefined,
      password: this.signupForm.get('password')?.value,
    };

    this.authService
      .signup(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Signup failed:', error);
          this.errorMessage =
            error.message || 'Signup failed. Please try again.';
          this.isLoading = false;
        },
      });
  }
}
