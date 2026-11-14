import { Routes } from '@angular/router';
import { BooksListComponent } from './list/books-list.component';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    component: BooksListComponent,
  },
];
