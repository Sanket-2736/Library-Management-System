import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-8"><h1 class="text-3xl font-bold">Payment History</h1></div>`,
  styles: [],
})
export class PaymentHistoryComponent {}
