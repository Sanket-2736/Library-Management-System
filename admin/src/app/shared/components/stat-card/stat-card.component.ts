import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
      <div [ngClass]="'p-3 rounded-lg', bgColorClass">
        <lucide-angular [name]="icon" [ngClass]="iconColorClass + ' w-6 h-6'"></lucide-angular>
      </div>
      <div class="flex-1">
        <p class="text-gray-600 text-sm font-medium">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
        <p *ngIf="subtext" class="text-xs text-gray-500 mt-2">{{ subtext }}</p>
      </div>
      <div *ngIf="trend" [ngClass]="trend > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
        <lucide-angular [name]="trend > 0 ? 'trending-up' : 'trending-down'" class="w-4 h-4 inline mr-1"></lucide-angular>
        {{ trend }}%
      </div>
    </div>
  `,
  styles: [],
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() icon: string = 'info';
  @Input() bgColorClass: string = 'bg-blue-100';
  @Input() iconColorClass: string = 'text-blue-600';
  @Input() subtext?: string;
  @Input() trend?: number;
}
