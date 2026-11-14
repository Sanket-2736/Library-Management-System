import { Routes } from '@angular/router';
import { SubscriptionsListComponent } from './list/subscriptions-list.component';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    component: SubscriptionsListComponent,
  },
];
