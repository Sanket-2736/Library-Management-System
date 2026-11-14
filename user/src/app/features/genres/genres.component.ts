import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-8"><h1 class="text-3xl font-bold">Genres</h1></div>`,
  styles: [],
})
export class GenresComponent {}
