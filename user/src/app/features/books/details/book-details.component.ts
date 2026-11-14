import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BookService } from '@core/services/book.service';
import { GenreService } from '@core/services/genre.service';
import { BookLoanService } from '@core/services/book-loan.service';
import { Book, Genre, CheckoutRequest } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div *ngIf="!loading && book" class="min-h-screen bg-gray-50">
      <!-- Back Button -->
      <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            (click)="goBack()"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <lucide-angular name="arrow-left" class="w-5 h-5"></lucide-angular>
            Back to Catalog
          </button>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Alert Messages -->
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-green-800 font-medium">{{ successMessage }}</p>
          </div>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <lucide-angular name="alert-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></lucide-angular>
          <div>
            <p class="text-red-800 font-medium">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Book Cover -->
          <div class="md:col-span-1">
            <div class="sticky top-24">
              <!-- Cover Image -->
              <div class="bg-gray-200 rounded-lg overflow-hidden mb-6 shadow-lg">
                <img
                  *ngIf="book.coverImageUrl"
                  [src]="book.coverImageUrl"
                  [alt]="book.title"
                  class="w-full h-auto object-cover"
                />
                <div
                  *ngIf="!book.coverImageUrl"
                  class="w-full aspect-[2/3] flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50"
                >
                  <lucide-angular name="book" class="w-24 h-24 text-blue-300"></lucide-angular>
                </div>
              </div>

              <!-- Availability Status -->
              <div class="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <div class="mb-4">
                  <p class="text-sm text-gray-600 mb-2">Availability</p>
                  <div
                    *ngIf="book.availableCopies > 0"
                    class="flex items-center gap-2 text-green-600 font-semibold text-lg"
                  >
                    <lucide-angular name="check-circle" class="w-6 h-6"></lucide-angular>
                    {{ book.availableCopies }} / {{ book.totalCopies }} Available
                  </div>
                  <div
                    *ngIf="book.availableCopies === 0"
                    class="flex items-center gap-2 text-red-600 font-semibold text-lg"
                  >
                    <lucide-angular name="x-circle" class="w-6 h-6"></lucide-angular>
                    Out of Stock
                  </div>
                </div>

                <!-- Borrow Button -->
                <button
                  (click)="borrowBook()"
                  [disabled]="book.availableCopies === 0 || borrowing"
                  class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
                >
                  <span *ngIf="!borrowing">
                    <lucide-angular name="book-open" class="w-5 h-5"></lucide-angular>
                    Borrow Book
                  </span>
                  <span *ngIf="borrowing" class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Borrowing...
                  </span>
                </button>

                <p class="text-xs text-gray-500 mt-3 text-center">
                  Borrow for 14 days (renewable up to 2 times)
                </p>
              </div>

              <!-- Quick Info -->
              <div class="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                <div>
                  <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">ISBN</p>
                  <p class="font-mono text-sm break-all">{{ book.isbn }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Language</p>
                  <p class="text-sm">{{ book.language || 'Not specified' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Pages</p>
                  <p class="text-sm">{{ book.pages || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Book Details -->
          <div class="md:col-span-2">
            <!-- Title & Author -->
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
              <p class="text-xl text-gray-600 mb-4">by {{ book.author }}</p>

              <!-- Genre Badge -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  *ngFor="let genre of getGenres()"
                  (click)="goToGenre(genre.id)"
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                >
                  <lucide-angular name="tag" class="w-3 h-3 inline mr-1"></lucide-angular>
                  {{ genre.name }}
                </button>
              </div>
            </div>

            <!-- Publication Info -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-6 bg-white rounded-lg border border-gray-200">
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Publisher</p>
                <p class="text-gray-900 font-medium">{{ book.publisher || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Published</p>
                <p class="text-gray-900 font-medium">
                  {{ book.publishedAt ? (book.publishedAt | date: 'MMM yyyy') : 'Not specified' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Total Copies</p>
                <p class="text-gray-900 font-medium">{{ book.totalCopies }}</p>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Book</h2>
              <div class="prose prose-sm max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {{ book.description || 'No description available for this book.' }}
                </p>
              </div>
            </div>

            <!-- Book Stats -->
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm font-medium mb-1">Availability</p>
                    <p class="text-3xl font-bold text-blue-600">
                      {{ ((book.availableCopies / book.totalCopies) * 100) | number: '0.0' }}%
                    </p>
                  </div>
                  <lucide-angular name="book-check" class="w-12 h-12 text-blue-300"></lucide-angular>
                </div>
              </div>
              <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm font-medium mb-1">Total Copies</p>
                    <p class="text-3xl font-bold text-purple-600">{{ book.totalCopies }}</p>
                  </div>
                  <lucide-angular name="stack" class="w-12 h-12 text-purple-300"></lucide-angular>
                </div>
              </div>
            </div>

            <!-- Book Details Table -->
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table class="w-full">
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">ISBN</td>
                    <td class="px-6 py-4 text-gray-900 font-mono">{{ book.isbn }}</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">Author</td>
                    <td class="px-6 py-4 text-gray-900">{{ book.author }}</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">Publisher</td>
                    <td class="px-6 py-4 text-gray-900">{{ book.publisher || 'Not specified' }}</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">Language</td>
                    <td class="px-6 py-4 text-gray-900">{{ book.language || 'Not specified' }}</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">Pages</td>
                    <td class="px-6 py-4 text-gray-900">{{ book.pages || 'N/A' }}</td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="px-6 py-4 text-gray-600 font-medium">Publication Date</td>
                    <td class="px-6 py-4 text-gray-900">
                      {{ book.publishedAt ? (book.publishedAt | date: 'MMM dd, yyyy') : 'Not specified' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-gray-600 font-medium">Active</td>
                    <td class="px-6 py-4">
                      <span
                        [class.bg-green-100]="book.active"
                        [class.text-green-800]="book.active"
                        [class.bg-gray-100]="!book.active"
                        [class.text-gray-800]="!book.active"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ book.active ? 'Yes' : 'No' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Related Actions -->
            <div class="mt-8 flex flex-wrap gap-4">
              <button
                (click)="goBack()"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
              >
                <lucide-angular name="arrow-left" class="w-5 h-5"></lucide-angular>
                Back to Catalog
              </button>
              <button
                (click)="shareBook()"
                class="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium flex items-center gap-2"
              >
                <lucide-angular name="share-2" class="w-5 h-5"></lucide-angular>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Not Found -->
    <div *ngIf="!loading && !book" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <lucide-angular name="book-x" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
        <p class="text-gray-600 mb-6">The book you're looking for doesn't exist.</p>
        <button
          (click)="goBack()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Catalog
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  genres: Genre[] = [];

  loading = true;
  borrowing = false;

  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private genreService: GenreService,
    private bookLoanService: BookLoanService
  ) {}

  ngOnInit() {
    this.loadGenres();
    this.loadBookDetails();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGenres() {
    this.genreService
      .getAllGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: genres => {
          this.genres = genres;
        },
        error: error => {
          console.error('Failed to load genres:', error);
        },
      });
  }

  loadBookDetails() {
    this.loading = true;
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const bookId = Number(params['id']);
        if (bookId) {
          this.bookService
            .getBookById(bookId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: book => {
                this.book = book;
                this.loading = false;
              },
              error: error => {
                console.error('Failed to load book:', error);
                this.loading = false;
              },
            });
        }
      });
  }

  getGenres(): Genre[] {
    if (!this.book) return [];
    return this.genres.filter(g => g.id === this.book!.genreId);
  }

  borrowBook() {
    if (!this.book || this.borrowing) return;

    this.borrowing = true;
    this.errorMessage = '';
    this.successMessage = '';

    const checkoutRequest: CheckoutRequest = {
      bookId: this.book.id,
      checkoutDays: 14,
      notes: 'Borrowed from catalog',
    };

    this.bookLoanService
      .checkoutBook(checkoutRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: loan => {
          this.successMessage = `Book "${this.book!.title}" borrowed successfully! Due date: ${new Date(loan.dueDate).toLocaleDateString()}`;
          this.borrowing = false;

          // Reload book to update availability
          setTimeout(() => {
            this.loadBookDetails();
          }, 1500);
        },
        error: error => {
          const errorMsg = error?.error?.message || error?.message || 'Failed to borrow book';
          this.errorMessage = errorMsg;
          this.borrowing = false;
        },
      });
  }

  goToGenre(genreId: number) {
    this.router.navigate(['/genres', genreId]);
  }

  goBack() {
    this.router.navigate(['/books']);
  }

  shareBook() {
    if (!this.book) return;

    const shareText = `Check out "${this.book.title}" by ${this.book.author} in our library!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: this.book.title,
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log('Share error:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      this.successMessage = 'Book link copied to clipboard!';
      setTimeout(() => (this.successMessage = ''), 3000);
    }
  }
}
