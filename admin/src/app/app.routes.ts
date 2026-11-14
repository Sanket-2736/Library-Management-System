import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from '@core/guards';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'books',
        loadChildren: () => import('./features/books/books.routes').then(m => m.BOOKS_ROUTES),
      },
      {
        path: 'genres',
        loadChildren: () => import('./features/genres/genres.routes').then(m => m.GENRES_ROUTES),
      },
      {
        path: 'loans',
        loadChildren: () => import('./features/loans/loans.routes').then(m => m.LOANS_ROUTES),
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.routes').then(
            m => m.SUBSCRIPTIONS_ROUTES
          ),
      },
      {
        path: 'subscription-plans',
        loadChildren: () =>
          import('./features/subscription-plans/subscription-plans.routes').then(
            m => m.SUBSCRIPTION_PLANS_ROUTES
          ),
      },
      {
        path: 'payments',
        loadChildren: () => import('./features/payments/payments.routes').then(m => m.PAYMENTS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
