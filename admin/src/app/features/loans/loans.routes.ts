import { Routes } from '@angular/router';
import { LoansListComponent } from './list/loans-list.component';

export const LOANS_ROUTES: Routes = [
  {
    path: '',
    component: LoansListComponent,
  },
];
