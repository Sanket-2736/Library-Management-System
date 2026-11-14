import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BookService } from '@core/services/book.service';
import { GenreService } from '@core/services/genre.service';
import { Book, BookSearchRequest, Genre, PageResponse } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-books-list',
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

    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">Books Catalog</h1>
              <p class="text-blue-100">Explore our collection of {{ totalBooks }} books</p>
            </div>
            <lucide-angular name="book-open" class="w-16 h-16 opacity-50"></lucide-angular>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search & Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <form [formGroup]="searchForm" class="space-y-4">
            <!-- Search Fields Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Title Search -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="search" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Search by Title
                </label>
                <input
                  type="text"
                  formControlName="searchTerm"
                  placeholder="Enter book title..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <!-- Genre Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="filter" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Filter by Genre
                </label>
                <select
                  formControlName="genreId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">All Genres</option>
                  <option *ngFor="let genre of genres" [value]="genre.id">
                    {{ genre.name }}
                  </option>
                </select>
              </div>

              <!-- Availability Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="check-circle" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Availability
                </label>
                <select
                  formControlName="availableOnly"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option [value]="">All Books</option>
                  <option [value]="true">Available Only</option>
                  <option [value]="false">All</option>
                </select>
              </div>

              <!-- Sort -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <lucide-angular name="arrow-up-down" class="w-4 h-4 inline mr-1"></lucide-angular>
                  Sort By
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

            <!-- Clear Filters Button -->
            <div class="flex justify-end">
              <button
                type="button"
                (click)="clearFilters()"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <lucide-angular name="rotate-ccw" class="w-4 h-4"></lucide-angular>
                Clear Filters
              </button>
            </div>
          </form>

          <!-- Results Info -->
          <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>Found {{ totalBooks }} books matching your criteria</p>
            <div class="flex items-center gap-4">
              <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
            </div>
          </div>
        </div>

        <!-- Books Grid -->
        <div *ngIf="!loading && books.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <!-- Book Card Skeleton while loading -->
          <div *ngIf="loadingMore" class="col-span-full">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div *ngFor="let i of [1, 2, 3, 4]" class="animate-pulse">
                <div class="bg-gray-300 h-56 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-300 rounded mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>

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
                  {{ book.availableCopies }} Available
                </div>
                <div
                  *ngIf="book.availableCopies === 0"
                  class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <lucide-angular name="x-circle" class="w-3 h-3"></lucide-angular>
                  Unavailable
                </div>
              </div>
            </div>

            <!-- Book Info -->
            <div class="p-4 flex-1 flex flex-col">
              <!-- Title -->
              <h3 class="font-bold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
                {{ book.title }}
              </h3>

              <!-- Author -->
              <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>

              <!-- Genre & ISBN -->
              <div class="text-xs text-gray-500 mb-3 space-y-1">
                <p *ngIf="book.genreId" class="flex items-center gap-1">
                  <lucide-angular name="tag" class="w-3 h-3"></lucide-angular>
                  {{ getGenreName(book.genreId) }}
                </p>
                <p class="flex items-center gap-1">
                  <lucide-angular name="barcode" class="w-3 h-3"></lucide-angular>
                  {{ book.isbn }}
                </p>
              </div>

              <!-- Description -->
              <p class="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                {{ book.description || 'No description available' }}
              </p>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <span class="text-xs text-gray-500">
                  {{ book.totalCopies }} total copies
                </span>
                <button
                  (click)="viewBook(book.id); $event.stopPropagation()"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                >
                  View Details
                  <lucide-angular name="arrow-right" class="w-3 h-3"></lucide-angular>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && books.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Books Found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            (click)="clearFilters()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reset Filters
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
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <lucide-angular name="chevron-left" class="w-4 h-4"></lucide-angular>
            Previous
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class.bg-blue-600]="page === currentPage"
              [class.text-white]="page === currentPage"
              [class.text-gray-700]="page !== currentPage"
              [class.border-gray-300]="page !== currentPage"
              [class.border-blue-600]="page === currentPage"
              class="px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              {{ page + 1 }}
            </button>
          </div>

          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Next
            <lucide-angular name="chevron-right" class="w-4 h-4"></lucide-angular>
          </button>
        </div>

        <!-- Results Summary -->
        <div *ngIf="!loading && books.length > 0" class="mt-12 p-6 bg-blue-50 rounded-lg">
          <div class="grid grid-cols-3 gap-6 text-center">
            <div>
              <p class="text-3xl font-bold text-blue-600">{{ totalBooks }}</p>
              <p class="text-sm text-gray-600 mt-1">Total Books</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-green-600">{{ availableCount }}</p>
              <p class="text-sm text-gray-600 mt-1">Available</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-purple-600">{{ genres.length }}</p>
              <p class="text-sm text-gray-600 mt-1">Genres</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class BooksListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  genres: Genre[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalBooks = 0;
  totalPages = 0;

  // State
  loading = true;
  loadingMore = false;
  booksLoaded = false;
  availableCount = 0;

  // Form
  searchForm: FormGroup;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.createSearchForm();
  }

  ngOnInit() {
    this.loadGenres();
    this.loadBooks();
    this.setupSearchListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createSearchForm(): FormGroup {
    return this.fb.group({
      searchTerm: [''],
      genreId: [''],
      availableOnly: [''],
      sortDirection: ['DESC'],
    });
  }

  private setupSearchListener() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.searchSubject.next();
      });
  }

  loadGenres() {
    this.genreService
      .getAllGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: genres => {
          this.genres = genres.sort((a, b) => a.displayOrder - b.displayOrder);
        },
        error: error => {
          console.error('Failed to load genres:', error);
        },
      });
  }

  loadBooks() {
    this.loading = true;
    this.loadingMore = true;

    const formValue = this.searchForm.value;
    const request: BookSearchRequest = {
      searchTerm: formValue.searchTerm || undefined,
      genreId: formValue.genreId ? Number(formValue.genreId) : undefined,
      availableOnly: formValue.availableOnly === true ? true : formValue.availableOnly === false ? false : undefined,
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
          this.loadingMore = false;

          // Calculate available count
          this.availableCount = this.books.filter(b => b.availableCopies > 0).length;
        },
        error: error => {
          console.error('Failed to load books:', error);
          this.loading = false;
          this.loadingMore = false;
        },
      });
  }

  getGenreName(genreId: number): string {
    return this.genres.find(g => g.id === genreId)?.name || 'Unknown';
  }

  viewBook(bookId: number) {
    this.router.navigate(['/books', bookId]);
  }

  clearFilters() {
    this.searchForm.reset({
      searchTerm: '',
      genreId: '',
      availableOnly: '',
      sortDirection: 'DESC',
    });
    this.currentPage = 0;
    this.loadBooks();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
      window.scrollTo(0, 0);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadBooks();
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
}
