import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BookService } from '@core/services/book.service';
import { GenreService } from '@core/services/genre.service';
import { Book, BookSearchRequest, Genre, PageResponse } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-books-by-genre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading && !booksLoaded" [fullScreen]="true"></app-loading-spinner>

    <div class="min-h-screen bg-gray-50" *ngIf="genre">
      <!-- Back to Genres -->
      <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            (click)="goBack()"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <lucide-angular name="arrow-left" class="w-5 h-5"></lucide-angular>
            Back to Genres
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <div
        [style.backgroundColor]="getGenreColor(genre.id)"
        class="text-white py-12"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">{{ genre.name }}</h1>
              <p class="text-opacity-90 text-white">
                {{ genre.description || 'Explore books in this genre' }}
              </p>
              <p class="text-opacity-75 text-white mt-2">
                <lucide-angular name="book" class="w-4 h-4 inline mr-1"></lucide-angular>
                {{ totalBooks }} books available
              </p>
            </div>
            <lucide-angular
              [name]="getGenreIcon(genre.code)"
              class="w-16 h-16 opacity-50"
            ></lucide-angular>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search & Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <form [formGroup]="filterForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Search -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="search" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Search in Genre
                </label>
                <input
                  type="text"
                  formControlName="searchTerm"
                  placeholder="Search title or author..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <!-- Availability -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="check-circle" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Availability
                </label>
                <select
                  formControlName="availableOnly"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">All Books</option>
                  <option [value]="true">Available Only</option>
                </select>
              </div>

              <!-- Sort -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="arrow-up-down" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Sort
                </label>
                <select
                  formControlName="sortDirection"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="DESC">Newest First</option>
                  <option value="ASC">Oldest First</option>
                </select>
              </div>
            </div>

            <!-- Clear Button -->
            <div class="flex justify-end">
              <button
                type="button"
                (click)="clearFilters()"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <lucide-angular name="rotate-ccw" class="w-4 h-4"></lucide-angular>
                Clear
              </button>
            </div>
          </form>
        </div>

        <!-- Books Grid -->
        <div *ngIf="!loading && books.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <!-- Book Cards -->
          <div
            *ngFor="let book of books"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
            (click)="viewBook(book.id)"
          >
            <!-- Book Cover -->
            <div class="relative h-56 bg-gray-200 overflow-hidden">
              <img
                *ngIf="book.coverImageUrl"
                [src]="book.coverImageUrl"
                [alt]="book.title"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div *ngIf="!book.coverImageUrl" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                <lucide-angular name="book" class="w-16 h-16 text-blue-300"></lucide-angular>
              </div>

              <!-- Availability Badge -->
              <div class="absolute top-3 right-3">
                <div
                  *ngIf="book.availableCopies > 0"
                  class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <lucide-angular name="check-circle" class="w-3 h-3"></lucide-angular>
                  Available
                </div>
                <div
                  *ngIf="book.availableCopies === 0"
                  class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                  Unavailable
                </div>
              </div>
            </div>

            <!-- Book Info -->
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="font-bold text-gray-900 mb-1 line-clamp-2">{{ book.title }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ book.author }}</p>

              <p class="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                {{ book.description || 'No description' }}
              </p>

              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <span class="text-xs text-gray-500">{{ book.availableCopies }}/{{ book.totalCopies }} available</span>
                <button
                  (click)="viewBook(book.id); $event.stopPropagation()"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View
                  <lucide-angular name="arrow-right" class="w-3 h-3 inline ml-1"></lucide-angular>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && books.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Books Found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            (click)="clearFilters()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>

        <!-- Pagination -->
        <div
          *ngIf="!loading && books.length > 0 && totalPages > 1"
          class="flex items-center justify-center gap-2 mt-8"
        >
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 0"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <lucide-angular name="chevron-left" class="w-4 h-4"></lucide-angular>
          </button>

          <div class="flex items-center gap-1">
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class.bg-blue-600]="page === currentPage"
              [class.text-white]="page === currentPage"
              class="px-3 py-2 border border-gray-300 rounded-lg"
            >
              {{ page + 1 }}
            </button>
          </div>

          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <lucide-angular name="chevron-right" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class BooksByGenreComponent implements OnInit, OnDestroy {
  genre: Genre | null = null;
  books: Book[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalBooks = 0;
  totalPages = 0;

  // State
  loading = true;
  booksLoaded = false;

  // Form
  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private genreService: GenreService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const genreId = Number(params['id']);
        if (genreId) {
          this.loadGenre(genreId);
          this.loadBooks(genreId);
        }
      });

    this.setupFilterListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      searchTerm: [''],
      availableOnly: [''],
      sortDirection: ['DESC'],
    });
  }

  private setupFilterListener() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        if (this.genre) {
          this.loadBooks(this.genre.id);
        }
      });
  }

  loadGenre(genreId: number) {
    this.genreService
      .getGenreById(genreId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: genre => {
          this.genre = genre;
        },
        error: error => {
          console.error('Failed to load genre:', error);
        },
      });
  }

  loadBooks(genreId: number) {
    this.loading = true;

    const formValue = this.filterForm.value;
    const request: BookSearchRequest = {
      searchTerm: formValue.searchTerm || undefined,
      genreId,
      availableOnly: formValue.availableOnly === true ? true : undefined,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDirection: formValue.sortDirection || 'DESC',
    };

    this.bookService
      .searchBooks(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.books = response.content;
          this.totalBooks = response.totalElements;
          this.totalPages = response.totalPages;
          this.booksLoaded = true;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load books:', error);
          this.loading = false;
        },
      });
  }

  viewBook(bookId: number) {
    this.router.navigate(['/books', bookId]);
  }

  clearFilters() {
    this.filterForm.reset({
      searchTerm: '',
      availableOnly: '',
      sortDirection: 'DESC',
    });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      if (this.genre) {
        this.loadBooks(this.genre.id);
      }
      window.scrollTo(0, 0);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      if (this.genre) {
        this.loadBooks(this.genre.id);
      }
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    if (this.genre) {
      this.loadBooks(this.genre.id);
    }
    window.scrollTo(0, 0);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(0, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getGenreColor(genreId: number): string {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#ec4899',
      '#06b6d4',
      '#6366f1',
    ];
    return colors[genreId % colors.length];
  }

  getGenreIcon(code: string): string {
    const iconMap: { [key: string]: string } = {
      fiction: 'book-open',
      'non-fiction': 'file-text',
      mystery: 'search',
      romance: 'heart',
      scifi: 'rocket',
      fantasy: 'wand',
      biography: 'user',
      history: 'clock',
      science: 'microscope',
      technology: 'cpu',
      education: 'graduation-cap',
      children: 'baby',
      poetry: 'feather',
      drama: 'theater',
    };
    return iconMap[code.toLowerCase()] || 'library';
  }

  goBack() {
    this.router.navigate(['/genres']);
  }
}
