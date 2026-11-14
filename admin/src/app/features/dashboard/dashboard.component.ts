import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '@shared/components/chart-card/chart-card.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { DashboardService } from '@core/services/dashboard.service';
import { DashboardStats } from '@models/index';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StatCardComponent,
    ChartCardComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome back! Here's your library overview.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <app-stat-card
          label="Total Books"
          [value]="stats.totalBooks"
          icon="book-open"
          bgColorClass="bg-blue-100"
          iconColorClass="text-blue-600"
          [subtext]="stats.availableBooks + ' available'"
        ></app-stat-card>

        <app-stat-card
          label="Registered Users"
          [value]="stats.totalUsers"
          icon="users"
          bgColorClass="bg-green-100"
          iconColorClass="text-green-600"
        ></app-stat-card>

        <app-stat-card
          label="Active Loans"
          [value]="stats.activeLoans"
          icon="arrows-right-left"
          bgColorClass="bg-purple-100"
          iconColorClass="text-purple-600"
          [subtext]="stats.overdueLoans + ' overdue'"
        ></app-stat-card>

        <app-stat-card
          label="Active Subscriptions"
          [value]="stats.activeSubscriptions"
          icon="credit-card"
          bgColorClass="bg-orange-100"
          iconColorClass="text-orange-600"
        ></app-stat-card>
      </div>

      <!-- Additional Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <app-stat-card
          label="Total Revenue"
          [value]="'$' + (stats.totalRevenue | number: '1.2-2')"
          icon="wallet"
          bgColorClass="bg-emerald-100"
          iconColorClass="text-emerald-600"
        ></app-stat-card>

        <app-stat-card
          label="Overdue Books"
          [value]="stats.overdueLoans"
          icon="alert-circle"
          bgColorClass="bg-red-100"
          iconColorClass="text-red-600"
          [trend]="-5"
        ></app-stat-card>

        <app-stat-card
          label="Genres"
          [value]="stats.totalGenres"
          icon="tag"
          bgColorClass="bg-indigo-100"
          iconColorClass="text-indigo-600"
        ></app-stat-card>
      </div>

      <!-- Charts Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Monthly Borrowing Chart -->
          <app-chart-card
            title="Monthly Book Borrowing"
            chartType="line"
            [chartData]="monthlyBorrowingChart"
            [chartOptions]="lineChartOptions"
          ></app-chart-card>

          <!-- Payment Statistics -->
          <app-chart-card
            title="Monthly Revenue"
            chartType="bar"
            [chartData]="paymentStatsChart"
            [chartOptions]="barChartOptions"
          ></app-chart-card>
        </div>

        <!-- Subscription Statistics -->
        <app-chart-card
          title="Subscription Distribution"
          chartType="doughnut"
          [chartData]="subscriptionStatsChart"
          [chartOptions]="doughnutChartOptions"
        ></app-chart-card>
      </div>

      <!-- Recent Activity Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button
              class="w-full btn btn-primary flex items-center justify-between"
              (click)="navigateTo('/books')"
            >
              <span class="flex items-center gap-2">
                <lucide-angular name="plus" class="w-4 h-4"></lucide-angular>
                Add New Book
              </span>
              <lucide-angular name="arrow-right" class="w-4 h-4"></lucide-angular>
            </button>
            <button
              class="w-full btn btn-secondary flex items-center justify-between"
              (click)="navigateTo('/users')"
            >
              <span class="flex items-center gap-2">
                <lucide-angular name="user-plus" class="w-4 h-4"></lucide-angular>
                View Users
              </span>
              <lucide-angular name="arrow-right" class="w-4 h-4"></lucide-angular>
            </button>
            <button
              class="w-full btn btn-secondary flex items-center justify-between"
              (click)="navigateTo('/loans')"
            >
              <span class="flex items-center gap-2">
                <lucide-angular name="list-check" class="w-4 h-4"></lucide-angular>
                Manage Loans
              </span>
              <lucide-angular name="arrow-right" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="card p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">API Connection</span>
              <span class="badge badge-success">Connected</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Database</span>
              <span class="badge badge-success">Healthy</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Last Sync</span>
              <span class="text-sm text-gray-600">{{ lastSyncTime | date: 'short' }}</span>
            </div>
            <button class="w-full btn btn-secondary mt-4" (click)="refreshData()">
              <lucide-angular name="refresh-cw" class="inline mr-2 w-4 h-4"></lucide-angular>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    overdueLoans: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalGenres: 0,
  };

  loading = true;
  lastSyncTime = new Date();

  // Chart configurations
  monthlyBorrowingChart: ChartData = { labels: [], datasets: [] };
  paymentStatsChart: ChartData = { labels: [], datasets: [] };
  subscriptionStatsChart: ChartData = { labels: [], datasets: [] };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Load dashboard statistics
    this.dashboardService.getDashboardStats().subscribe({
      next: stats => {
        this.stats = stats;
        this.lastSyncTime = new Date();
        this.loading = false;
      },
      error: error => {
        console.error('Failed to load dashboard stats:', error);
        this.loading = false;
      },
    });

    // Load monthly borrowing stats
    this.dashboardService.getMonthlyBorrowingStats().subscribe({
      next: data => {
        this.monthlyBorrowingChart = {
          labels: data.map(d => d.month),
          datasets: [
            {
              label: 'Books Borrowed',
              data: data.map(d => d.borrowed),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Books Returned',
              data: data.map(d => d.returned),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        };
      },
    });

    // Load payment stats
    this.dashboardService.getPaymentStats().subscribe({
      next: data => {
        this.paymentStatsChart = {
          labels: data.map(d => d.month),
          datasets: [
            {
              label: 'Revenue ($)',
              data: data.map(d => d.amount),
              backgroundColor: '#f59e0b',
              borderColor: '#d97706',
              borderWidth: 1,
            },
          ],
        };
      },
    });

    // Load subscription stats
    this.dashboardService.getSubscriptionStats().subscribe({
      next: data => {
        this.subscriptionStatsChart = {
          labels: data.map(d => d.planName),
          datasets: [
            {
              label: 'Subscriptions',
              data: data.map(d => d.count),
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
              ],
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        };
      },
    });
  }

  refreshData() {
    this.loadDashboardData();
  }

  navigateTo(path: string) {
    // Navigation would be handled by router in actual implementation
    console.log('Navigate to:', path);
  }
}
