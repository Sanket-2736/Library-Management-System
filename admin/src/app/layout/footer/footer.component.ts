import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-gray-400 text-center py-6 border-t border-gray-800">
      <p>&copy; 2024 Library Management System. All rights reserved.</p>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {}
