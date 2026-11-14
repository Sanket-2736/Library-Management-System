# Quick Start Guide - LibraryHub User Application

## Installation & Development

### Step 1: Install Dependencies
```bash
cd user
npm install
```

### Step 2: Start Development Server
```bash
npm start
```
Application will be available at: **http://localhost:4200**

### Step 3: Ensure Backend is Running
```bash
# In another terminal, from the main project directory
cd library-management-system
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Data interfaces
│   │   ├── services/         # API services
│   │   ├── guards/           # Route guards
│   │   └── interceptors/     # HTTP interceptors
│   ├── shared/
│   │   └── components/       # Reusable components
│   ├── features/             # Feature modules (by page)
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── books/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   ├── book-loans/
│   │   ├── profile/
│   │   └── genres/
│   ├── layout/               # Layout components
│   ├── app.routes.ts         # Route definitions
│   ├── app.config.ts         # App configuration
│   ├── app.component.ts      # Root component
│   └── environments/         # Environment configs
└── styles.css                # Global Tailwind CSS
```

---

## Current Implementation Status

### ✅ Completed
- [x] Project scaffolding & folder structure
- [x] Core services (Auth, Book, BookLoan, Subscription, Payment)
- [x] Authentication guards & HTTP interceptors
- [x] Models & TypeScript interfaces
- [x] Shared UI components (Loading, Confirmation, Notification)
- [x] Layout (Navbar, Footer)
- [x] Auth pages (Login, Signup, Forgot Password)
- [x] Routing configuration
- [x] Tailwind CSS setup

### 🔄 In Progress / TODO
- [ ] Dashboard component (active subscriptions, active loans overview)
- [ ] Books browse & detail pages with checkout
- [ ] Subscription plans display & Razorpay checkout integration
- [ ] Payment history page
- [ ] Book loans management (current, returned, overdue)
- [ ] User profile management (view, edit, change password)
- [ ] Genres browsing
- [ ] Error handling & notifications
- [ ] Form validation & user feedback
- [ ] Responsive design polish
- [ ] Unit & integration tests

---

## Key Services Available

### AuthService
```typescript
login(request: LoginRequest): Observable<AuthResponse>
signup(request: SignupRequest): Observable<AuthResponse>
forgotPassword(request: ForgotPasswordRequest): Observable<any>
resetPassword(request: ResetPasswordRequest): Observable<any>
getCurrentUserProfile(): Observable<UserProfile>
logout(): void
isAuthenticated(): boolean
getToken(): string | null
```

### BookService
```typescript
getAllBooks(): Observable<Book[]>
getBookById(id: number): Observable<Book>
searchBooks(request: BookSearchRequest): Observable<BookSearchResponse>
getAllGenres(): Observable<Genre[]>
getTopLevelGenres(): Observable<Genre[]>
```

### BookLoanService
```typescript
checkoutBook(request: CheckoutRequest): Observable<BookLoan>
checkinBook(request: CheckinRequest): Observable<BookLoan>
renewBook(request: RenewalRequest): Observable<BookLoan>
getMyBookLoans(status?: string, page: number, size: number): Observable<any>
```

### SubscriptionService
```typescript
getAllPlans(): Observable<SubscriptionPlan[]>
getPlanById(id: number): Observable<SubscriptionPlan>
subscribe(request: CreateSubscriptionRequest): Observable<Subscription>
getUserActiveSubscription(): Observable<Subscription>
cancelSubscription(subscriptionId: number, reason?: string): Observable<Subscription>
activateSubscription(subscriptionId: number): Observable<Subscription>
```

### PaymentService
```typescript
verifyPayment(request: PaymentVerifyRequest): Observable<Payment>
getPayments(page: number, size: number): Observable<any>
getPaymentById(id: number): Observable<Payment>
```

---

## Available UI Components

### LoadingSpinnerComponent
```html
<app-loading-spinner [fullScreen]="true" message="Loading..."></app-loading-spinner>
```

### ConfirmationModalComponent
```html
<app-confirmation-modal
  [isOpen]="showModal"
  [title]="'Delete Item?'"
  [message]="'Are you sure?'"
  [type]="'danger'"
  [isLoading]="isDeleting"
  (confirm)="onConfirm()"
  (cancel)="onCancel()"
></app-confirmation-modal>
```

### NotificationComponent
```typescript
// Injected into navbar, use globally:
this.notificationService.showSuccess('Operation successful!');
this.notificationService.showError('An error occurred');
this.notificationService.showWarning('Warning message');
this.notificationService.showInfo('Info message');
```

---

## API Integration Pattern

All API calls follow this pattern:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MyService {
  private apiUrl = `${environment.apiUrl}/my-endpoint`;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
```

**JWT Token** is automatically added to all requests via `JwtInterceptor`.

---

## Common Development Tasks

### Add a New Route
Edit `src/app/app.routes.ts`:
```typescript
{
  path: 'new-feature',
  canActivate: [authGuard],
  loadComponent: () => import('./features/new-feature/new-feature.component')
    .then(m => m.NewFeatureComponent),
}
```

### Create a New Service
```bash
ng generate service core/services/my-service
```

### Create a New Component
```bash
ng generate component features/my-feature/my-component
```

### Use Reactive Forms
```typescript
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    // Handle submission
  }
}
```

### Add Error Handling
```typescript
this.myService.getData().subscribe({
  next: (data) => {
    console.log('Success:', data);
  },
  error: (error) => {
    console.error('Error:', error);
    // ErrorInterceptor already logged it
    // Display user-friendly message
    this.showErrorNotification(error.message);
  }
});
```

---

## Testing with Backend APIs

### Login Credentials (Test User)
Create a test user via signup, or use existing backend user:
```
Email: test@example.com
Password: password123
```

### Test Subscription Flow
1. Login
2. Navigate to Subscriptions
3. Select a plan
4. Click "Subscribe"
5. Complete Razorpay payment (use test card: 4111 1111 1111 1111)

### Test Book Checkout
1. Ensure active subscription
2. Navigate to Books
3. Click checkout on any book
4. Confirm checkout
5. View in My Loans

---

## Debugging Tips

### Check Console for Errors
```
Open DevTools (F12) → Console tab
Look for error messages or network failures
```

### Check Network Requests
```
DevTools → Network tab
Verify API requests return 200/201/204
Check request/response payloads
```

### Check JWT Token
```typescript
// In browser console
localStorage.getItem('library_user_token')
```

### Verify Backend Connection
```
Check if backend is running: http://localhost:8080
Test endpoint: http://localhost:8080/api/books
Should return JSON list of books
```

---

## Build & Deployment

### Development Build
```bash
npm start
# or
ng serve
```

### Production Build
```bash
npm run build
# Output: dist/user/
```

### Deploy to Server
```bash
# Copy dist/user/* to your web server
# Configure server to route all requests to index.html for SPA routing
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` and restart server |
| API calls failing | Verify backend running on :8080, check CORS config |
| Styles not applying | Check tailwind.config.js paths, restart dev server |
| Login not working | Verify correct credentials, check backend auth endpoint |
| Razorpay not loading | Check razorpayKeyId in environment.ts |

---

## Next Development Priority

1. **Dashboard** - Show user's current subscription and active loans
2. **Books Browse** - Search and filter books
3. **Subscriptions** - Display plans and integrate Razorpay checkout
4. **Book Loans** - Manage current loans, renewals
5. **Profile** - User profile management
6. **Payments** - Payment history and receipt viewing

---

## Resources

- **Angular Documentation**: https://angular.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **RxJS**: https://rxjs.dev
- **Lucide Icons**: https://lucide.dev
- **Razorpay**: https://razorpay.com/docs/
- **Spring Boot API**: Check backend documentation

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Review network requests in DevTools
3. Verify backend is running and accessible
4. Check this guide's Troubleshooting section
5. Review component implementation details in the main Implementation Guide

Happy coding! 🚀
