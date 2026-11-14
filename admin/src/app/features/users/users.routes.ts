import { Routes } from '@angular/router';
import { UsersListComponent } from './list/users-list.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
];
