import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="card p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ title }}</h3>
      <div class="h-64">
        <canvas
          baseChart
          [type]="chartType"
          [data]="chartData"
          [options]="chartOptions"
        ></canvas>
      </div>
    </div>
  `,
  styles: [],
})
export class ChartCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() chartType: any = 'line';
  @Input() chartData!: ChartData;
  @Input() chartOptions: ChartConfiguration['options'] = {};

  ngOnInit() {
    if (!this.chartOptions.responsive) {
      this.chartOptions = {
        ...this.chartOptions,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...this.chartOptions.plugins,
          legend: {
            ...this.chartOptions.plugins?.['legend'] as any,
            display: true,
            position: 'top' as const,
          },
        },
      };
    }
  }
}
