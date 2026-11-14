import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/index';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./list/books-list.component').then(m => m.BooksListComponent),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./details/book-details.component').then(
        m => m.BookDetailsComponent
      ),
  },
];
