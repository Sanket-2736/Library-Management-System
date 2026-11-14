import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import {
  DashboardStats,
  BookLoan,
  BookLoanStatus,
  Subscription,
  PageResponse,
} from '@models/index';
import { BookService } from './book.service';
import { GenreService } from './genre.service';
import { UserService } from './user.service';
import { BookLoanService } from './book-loan.service';
import { SubscriptionService } from './subscription.service';
import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private bookService: BookService,
    private genreService: GenreService,
    private userService: UserService,
    private bookLoanService: BookLoanService,
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      totalBooks: this.bookService.getTotalActiveBooks().pipe(
        catchError(() => of(0))
      ),
      availableBooks: this.bookService.getTotalAvailableBooks().pipe(
        map((data: any) => data.totalAvailableBooks || 0),
        catchError(() => of(0))
      ),
      totalUsers: this.userService.getAllUsers().pipe(
        map(users => users?.length || 0),
        catchError(() => of(0))
      ),
      totalGenres: this.genreService.getTotalActiveGenres().pipe(
        catchError(() => of(0))
      ),
      allLoans: this.bookLoanService.searchBookLoans({
        page: 0,
        size: 1000,
      }).pipe(
        map((response: PageResponse<BookLoan>) => response.content || []),
        catchError(() => of([]))
      ),
      subscriptions: this.subscriptionService.getAllSubscriptions().pipe(
        catchError(() => of([]))
      ),
      payments: this.paymentService.getAllPayments(0, 1000).pipe(
        map((response: any) => response.content || []),
        catchError(() => of([]))
      ),
    }).pipe(
      map(data => {
        const loans = (data.allLoans || []) as BookLoan[];
        const activeLoans = loans.filter(
          l => l.status === 'CHECKED_OUT' || l.status === BookLoanStatus.CHECKED_OUT
        ).length;
        const overdueLoans = loans.filter(
          l => l.status === 'OVERDUE' || l.status === BookLoanStatus.OVERDUE
        ).length;

        const subscriptions = (data.subscriptions || []) as any[];
        const activeSubscriptions = subscriptions.filter(
          s => s.status === 'ACTIVE'
        ).length;

        const payments = data.payments || [];
        const totalRevenue = (payments as any[]).reduce((sum, p) => sum + (p.amount || 0), 0);

        return {
          totalBooks: data.totalBooks as number,
          availableBooks: data.availableBooks as number,
          totalUsers: data.totalUsers as number,
          activeLoans,
          overdueLoans,
          activeSubscriptions,
          totalRevenue,
          totalGenres: data.totalGenres as number,
        };
      })
    );
  }

  getMonthlyBorrowingStats(): Observable<any[]> {
    // Generate mock data - in production, you'd fetch from backend
    return new Observable(observer => {
      const monthlyData = [
        { month: 'Jan', borrowed: 45, returned: 38 },
        { month: 'Feb', borrowed: 52, returned: 48 },
        { month: 'Mar', borrowed: 48, returned: 45 },
        { month: 'Apr', borrowed: 61, returned: 55 },
        { month: 'May', borrowed: 55, returned: 52 },
        { month: 'Jun', borrowed: 67, returned: 60 },
      ];
      observer.next(monthlyData);
      observer.complete();
    });
  }

  getSubscriptionStats(): Observable<any[]> {
    return this.subscriptionService.getAllSubscriptions().pipe(
      map((subscriptions: any[]) => {
        const grouped: { [key: string]: number } = {};
        
        subscriptions.forEach(sub => {
          const planName = sub.planName || 'Unknown';
          grouped[planName] = (grouped[planName] || 0) + 1;
        });

        const total = Object.values(grouped).reduce((a, b) => a + b, 0);
        
        return Object.entries(grouped).map(([planName, count]) => ({
          planName,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }));
      })
    );
  }

  getPaymentStats(): Observable<any[]> {
    return this.paymentService.getAllPayments(0, 1000).pipe(
      map((response: any) => {
        const payments = response.content || [];
        const grouped: { [key: string]: { amount: number; count: number } } = {};

        payments.forEach((payment: any) => {
          const date = new Date(payment.paymentDate || payment.createdAt);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
          
          if (!grouped[monthKey]) {
            grouped[monthKey] = { amount: 0, count: 0 };
          }
          
          grouped[monthKey].amount += payment.amount || 0;
          grouped[monthKey].count += 1;
        });

        return Object.entries(grouped)
          .sort((a, b) => new Date(a[0]) > new Date(b[0]) ? 1 : -1)
          .slice(-6)
          .map(([month, data]) => ({
            month,
            amount: data.amount,
            transactions: data.count,
          }));
      })
    );
  }
}
