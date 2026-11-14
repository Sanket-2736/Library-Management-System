import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">📚 Create Account</h1>
          <p class="text-gray-600 mt-2">Sign up for Library Admin</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Full Name -->
          <div class="mb-4">
            <label class="form-label">Full Name</label>
            <input
              type="text"
              formControlName="fullName"
              placeholder="Enter your full name"
              class="form-input"
            />
            <div *ngIf="fullName?.errors && (fullName?.touched || submitted)" class="form-error">
              <span *ngIf="fullName?.errors['required']">Full name is required</span>
            </div>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-input"
            />
            <div *ngIf="email?.errors && (email?.touched || submitted)" class="form-error">
              <span *ngIf="email?.errors['required']">Email is required</span>
              <span *ngIf="email?.errors['email']">Please enter a valid email</span>
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="form-label">Password</label>
            <input
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-input"
            />
            <div *ngIf="password?.errors && (password?.touched || submitted)" class="form-error">
              <span *ngIf="password?.errors['required']">Password is required</span>
              <span *ngIf="password?.errors['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <!-- Phone (Optional) -->
          <div class="mb-6">
            <label class="form-label">Phone (Optional)</label>
            <input
              type="tel"
              formControlName="phone"
              placeholder="Enter your phone number"
              class="form-input"
            />
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="alert alert-error mb-4">
            <lucide-angular name="alert-circle" class="w-5 h-5"></lucide-angular>
            <span>{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading"
            class="btn btn-primary w-full mb-4"
          >
            <span *ngIf="!loading">
              <lucide-angular name="user-plus" class="inline mr-2 w-4 h-4"></lucide-angular>
              Create Account
            </span>
            <span *ngIf="loading" class="flex items-center justify-center">
              <div class="spinner-sm"></div>
              Creating...
            </span>
          </button>

          <!-- Login Link -->
          <p class="text-center text-gray-600">
            Already have an account?
            <a routerLink="/auth/login" class="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .spinner-sm {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
  ],
})
export class SignupComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
    });
  }

  get fullName() {
    return this.form.get('fullName');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signup(this.form.value).subscribe({
      next: response => {
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.error = error.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
