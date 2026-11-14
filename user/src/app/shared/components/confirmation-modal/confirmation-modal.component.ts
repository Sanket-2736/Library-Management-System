import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="onCancel()">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex justify-center mb-4">
          <div [ngClass]="iconClass">
            <svg
              *ngIf="type === 'danger'"
              class="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
              ></path>
            </svg>
            <svg
              *ngIf="type === 'warning'"
              class="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
              ></path>
            </svg>
            <svg
              *ngIf="type === 'success'"
              class="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 text-center mb-2">{{ title }}</h2>
        <p class="text-gray-600 text-center mb-6">{{ message }}</p>

        <div class="flex gap-4">
          <button
            (click)="onCancel()"
            class="btn btn-secondary flex-1"
          >
            {{ cancelText }}
          </button>
          <button
            (click)="onConfirm()"
            [ngClass]="confirmButtonClass"
            class="btn flex-1"
            [disabled]="isLoading"
          >
            <span *ngIf="!isLoading">{{ confirmText }}</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() type: 'danger' | 'warning' | 'success' = 'danger';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isLoading) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get iconClass(): string {
    const baseClass = 'text-4xl';
    const typeClass: { [key: string]: string } = {
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-600',
    };
    return `${baseClass} ${typeClass[this.type]}`;
  }

  get confirmButtonClass(): string {
    const typeClass: { [key: string]: string } = {
      danger: 'btn-danger',
      warning: 'btn-warning',
      success: 'btn-success',
    };
    return typeClass[this.type];
  }
}
