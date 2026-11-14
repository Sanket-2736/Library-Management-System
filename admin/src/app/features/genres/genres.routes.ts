import { Routes } from '@angular/router';
import { GenresListComponent } from './list/genres-list.component';

export const GENRES_ROUTES: Routes = [
  {
    path: '',
    component: GenresListComponent,
  },
];
