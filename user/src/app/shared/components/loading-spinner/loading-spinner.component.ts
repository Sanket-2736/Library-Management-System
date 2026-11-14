import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="{
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50':
          fullScreen,
        'flex items-center justify-center': !fullScreen,
      }"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <p *ngIf="message" class="text-gray-600 font-medium">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [],
})
export class LoadingSpinnerComponent {
  @Input() fullScreen = false;
  @Input() message: string | null = null;
}
