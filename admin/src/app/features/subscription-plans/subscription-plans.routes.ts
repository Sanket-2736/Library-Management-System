import { Routes } from '@angular/router';
import { SubscriptionPlansListComponent } from './list/subscription-plans-list.component';

export const SUBSCRIPTION_PLANS_ROUTES: Routes = [
  {
    path: '',
    component: SubscriptionPlansListComponent,
  },
];
