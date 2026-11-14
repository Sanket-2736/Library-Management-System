import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="'flex items-center justify-center', sizeClass">
      <div [ngClass]="'spinner', spinnerSizeClass"></div>
    </div>
  `,
  styles: [
    `
      .spinner {
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 3px solid #3b82f6;
        animation: spin 0.8s linear infinite;
      }

      .spinner-sm {
        width: 20px;
        height: 20px;
      }

      .spinner-md {
        width: 40px;
        height: 40px;
      }

      .spinner-lg {
        width: 60px;
        height: 60px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullScreen: boolean = false;

  get sizeClass(): string {
    if (this.fullScreen) {
      return 'fixed inset-0 bg-white bg-opacity-75 z-50';
    }
    return 'w-full h-20';
  }

  get spinnerSizeClass(): string {
    return `spinner-${this.size}`;
  }
}
