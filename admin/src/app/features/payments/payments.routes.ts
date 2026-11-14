import { Routes } from '@angular/router';
import { PaymentsListComponent } from './list/payments-list.component';

export const PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    component: PaymentsListComponent,
  },
];
