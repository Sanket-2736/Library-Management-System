import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-8"><h1 class="text-3xl font-bold">Book Detail</h1></div>`,
  styles: [],
})
export class BookDetailComponent {}
