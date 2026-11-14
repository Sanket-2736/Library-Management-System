import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <lucide-angular name="book-open" class="w-8 h-8 text-blue-600"></lucide-angular>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">📚 Library Admin</h1>
          <p class="text-gray-600 mt-2">Admin Dashboard Login</p>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="form-label">Email Address</label>
            <div class="relative">
              <lucide-angular name="mail" class="absolute left-3 top-3 w-5 h-5 text-gray-400"></lucide-angular>
              <input
                type="email"
                formControlName="email"
                placeholder="admin@example.com"
                class="form-input pl-10"
                [class.ring-2]="isFieldInvalid('email')"
                [class.ring-red-500]="isFieldInvalid('email')"
              />
            </div>
            <div *ngIf="email?.errors && (email?.touched || submitted)" class="form-error">
              <span *ngIf="email?.errors['required']">Email is required</span>
              <span *ngIf="email?.errors['email']">Please enter a valid email</span>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="form-label">Password</label>
            <div class="relative">
              <lucide-angular name="lock" class="absolute left-3 top-3 w-5 h-5 text-gray-400"></lucide-angular>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter your password"
                class="form-input pl-10 pr-10"
                [class.ring-2]="isFieldInvalid('password')"
                [class.ring-red-500]="isFieldInvalid('password')"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <lucide-angular
                  [name]="showPassword ? 'eye-off' : 'eye'"
                  class="w-5 h-5"
                ></lucide-angular>
              </button>
            </div>
            <div *ngIf="password?.errors && (password?.touched || submitted)" class="form-error">
              <span *ngIf="password?.errors['required']">Password is required</span>
              <span *ngIf="password?.errors['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-gray-300" />
              <span class="text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-blue-600 hover:underline font-medium">Forgot password?</a>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="alert alert-error">
            <lucide-angular name="alert-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
            <span>{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading || form.invalid"
            class="btn btn-primary w-full mt-6 relative overflow-hidden group"
          >
            <span *ngIf="!loading" class="flex items-center justify-center gap-2">
              <lucide-angular name="log-in" class="w-4 h-4"></lucide-angular>
              Sign In
            </span>
            <span *ngIf="loading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </span>
          </button>

          <!-- Demo Credentials Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-4">
            <p class="font-semibold mb-1">Demo Credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: response => {
        if (response.user?.role === 'ROLE_ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'You do not have admin privileges. Contact administrator.';
          this.loading = false;
        }
      },
      error: error => {
        this.error =
          error.error?.message ||
          error.message ||
          'Login failed. Please check your credentials and try again.';
        this.loading = false;
        this.form.reset();
      },
    });
  }
}
