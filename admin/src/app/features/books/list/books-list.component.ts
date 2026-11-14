import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BookService } from '@services/book.service';
import { GenreService } from '@services/genre.service';
import { Book, BookSearchRequest, Genre, PageResponse, CreateBookRequest, UpdateBookRequest } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Books Management</h1>
          <p class="text-gray-600 mt-1">Total: {{ totalElements }} books</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-2">
          <lucide-angular name="plus" class="w-4 h-4"></lucide-angular>
          Add Book
        </button>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success mb-6">
        <lucide-angular name="check-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ successMessage }}</span>
        <button (click)="successMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="alert alert-error mb-6">
        <lucide-angular name="alert-circle" class="w-5 h-5 flex-shrink-0"></lucide-angular>
        <span>{{ errorMessage }}</span>
        <button (click)="errorMessage = null" class="ml-auto">
          <lucide-angular name="x" class="w-4 h-4"></lucide-angular>
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="form-label">Search (Title, Author, ISBN)</label>
            <input
              type="text"
              placeholder="Search books..."
              class="form-input"
              (keyup)="onSearchChange($event)"
            />
          </div>

          <!-- Genre Filter -->
          <div>
            <label class="form-label">Genre</label>
            <select (change)="onGenreFilter($event)" class="form-select">
              <option [value]="null">All Genres</option>
              <option *ngFor="let genre of genres" [value]="genre.id">
                {{ genre.name }}
              </option>
            </select>
          </div>

          <!-- Availability Filter -->
          <div>
            <label class="form-label">Availability</label>
            <select (change)="onAvailabilityFilter($event)" class="form-select">
              <option [value]="null">All</option>
              <option [value]="true">Available</option>
              <option [value]="false">Out of Stock</option>
            </select>
          </div>

          <!-- Search Button -->
          <div class="flex items-end">
            <button (click)="search()" class="btn btn-primary w-full">
              <lucide-angular name="search" class="w-4 h-4 inline mr-2"></lucide-angular>
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Books Table -->
      <div class="card overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let book of books">
                <td class="font-mono text-sm">{{ book.isbn }}</td>
                <td>
                  <button (click)="viewBook(book)" class="text-blue-600 hover:underline font-medium">
                    {{ book.title }}
                  </button>
                </td>
                <td>{{ book.author }}</td>
                <td>
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {{ book.genre || 'N/A' }}
                  </span>
                </td>
                <td class="text-center font-semibold">{{ book.totalCopies }}</td>
                <td class="text-center">
                  <span [ngClass]="book.availableCopies > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                    {{ book.availableCopies }}
                  </span>
                </td>
                <td>
                  <span [ngClass]="book.active ? 'badge badge-success' : 'badge badge-warning'">
                    {{ book.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="editBook(book)"
                      title="Edit"
                      class="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <lucide-angular name="edit-2" class="w-4 h-4"></lucide-angular>
                    </button>
                    <button
                      (click)="deleteBook(book.id, book.title)"
                      title="Delete"
                      class="text-red-600 hover:text-red-900 p-1"
                    >
                      <lucide-angular name="trash-2" class="w-4 h-4"></lucide-angular>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div *ngIf="books.length === 0" class="text-center py-12">
            <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
            <p class="text-gray-600 font-medium">No books found</p>
            <p class="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Showing {{ (currentPage) * pageSize + 1 }} to
          {{ Math.min((currentPage + 1) * pageSize, totalElements) }} of {{ totalElements }} books
        </p>
        <div class="flex items-center gap-2">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 0"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50"
          >
            <lucide-angular name="chevron-left" class="w-4 h-4"></lucide-angular>
          </button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </span>
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= totalPages - 1"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50"
          >
            <lucide-angular name="chevron-right" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    </div>

    <!-- Book Modal (Add/Edit) -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Book' : 'Add New Book' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <form [formGroup]="bookForm" (ngSubmit)="saveBook()" class="space-y-4">
          <!-- ISBN -->
          <div>
            <label class="form-label">ISBN</label>
            <input
              type="text"
              formControlName="isbn"
              placeholder="Enter ISBN"
              class="form-input"
              [readonly]="isEditMode"
            />
            <p *ngIf="bookForm.get('isbn')?.hasError('required')" class="form-error">ISBN is required</p>
          </div>

          <!-- Title -->
          <div>
            <label class="form-label">Title</label>
            <input
              type="text"
              formControlName="title"
              placeholder="Enter book title"
              class="form-input"
            />
            <p *ngIf="bookForm.get('title')?.hasError('required')" class="form-error">Title is required</p>
          </div>

          <!-- Author -->
          <div>
            <label class="form-label">Author</label>
            <input
              type="text"
              formControlName="author"
              placeholder="Enter author name"
              class="form-input"
            />
            <p *ngIf="bookForm.get('author')?.hasError('required')" class="form-error">Author is required</p>
          </div>

          <!-- Genre -->
          <div>
            <label class="form-label">Genre</label>
            <select formControlName="genreId" class="form-select">
              <option [value]="null">Select a genre</option>
              <option *ngFor="let genre of genres" [value]="genre.id">
                {{ genre.name }}
              </option>
            </select>
            <p *ngIf="bookForm.get('genreId')?.hasError('required')" class="form-error">Genre is required</p>
          </div>

          <!-- Publication Year -->
          <div>
            <label class="form-label">Publication Year</label>
            <input
              type="number"
              formControlName="publicationYear"
              placeholder="e.g. 2023"
              class="form-input"
            />
          </div>

          <!-- Total Copies -->
          <div>
            <label class="form-label">Total Copies</label>
            <input
              type="number"
              formControlName="totalCopies"
              placeholder="Enter total copies"
              class="form-input"
              min="0"
            />
            <p *ngIf="bookForm.get('totalCopies')?.hasError('required')" class="form-error">
              Total copies is required
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="form-label">Description</label>
            <textarea
              formControlName="description"
              placeholder="Enter book description"
              class="form-input h-24"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              (click)="closeModal()"
              class="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="bookForm.invalid || isSubmitting"
              class="btn btn-primary flex-1"
            >
              <span *ngIf="!isSubmitting">{{ isEditMode ? 'Update Book' : 'Add Book' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Book Details Modal -->
    <div *ngIf="showViewModal" class="modal-overlay" (click)="closeViewModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
          <button (click)="closeViewModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedBook" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">ISBN</p>
              <p class="text-gray-900 font-mono">{{ selectedBook.isbn }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Status</p>
              <span [ngClass]="selectedBook.active ? 'badge badge-success' : 'badge badge-warning'">
                {{ selectedBook.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Title</p>
              <p class="text-gray-900">{{ selectedBook.title }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Author</p>
              <p class="text-gray-900">{{ selectedBook.author }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Genre</p>
              <p class="text-gray-900">{{ selectedBook.genre || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Publication Year</p>
              <p class="text-gray-900">{{ selectedBook.publicationYear || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Copies</p>
              <p class="text-gray-900 font-bold">{{ selectedBook.totalCopies }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Available Copies</p>
              <p [ngClass]="selectedBook.availableCopies > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                {{ selectedBook.availableCopies }}
              </p>
            </div>
          </div>

          <div *ngIf="selectedBook.description">
            <p class="text-gray-600 text-sm font-medium">Description</p>
            <p class="text-gray-900 mt-2">{{ selectedBook.description }}</p>
          </div>

          <div class="flex gap-4 pt-6">
            <button (click)="editBook(selectedBook)" class="btn btn-primary flex-1">
              <lucide-angular name="edit-2" class="w-4 h-4 inline mr-2"></lucide-angular>
              Edit
            </button>
            <button (click)="closeViewModal()" class="btn btn-secondary flex-1">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteConfirm" class="modal-overlay" (click)="cancelDelete($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <lucide-angular name="alert-triangle" class="w-6 h-6 text-red-600"></lucide-angular>
        </div>
        <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Delete Book?</h2>
        <p class="text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{{ deleteBookTitle }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button (click)="cancelDelete()" class="btn btn-secondary flex-1">
            Cancel
          </button>
          <button (click)="confirmDelete()" [disabled]="isDeleting" class="btn btn-danger flex-1">
            <span *ngIf="!isDeleting">Delete</span>
            <span *ngIf="isDeleting" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class BooksListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  genres: Genre[] = [];
  bookForm: FormGroup;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // UI States
  loading = true;
  isSubmitting = false;
  isDeleting = false;
  showModal = false;
  showViewModal = false;
  showDeleteConfirm = false;
  isEditMode = false;

  // Messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Search/Filter
  searchTerm = '';
  selectedGenre: number | null = null;
  availabilityFilter: boolean | null = null;

  // Selected Book
  selectedBook: Book | null = null;
  deleteBookId: number | null = null;
  deleteBookTitle = '';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookForm = this.createBookForm();
  }

  ngOnInit() {
    this.loadGenres();
    this.search();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createBookForm(): FormGroup {
    return this.fb.group({
      isbn: ['', [Validators.required]],
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      genreId: [null, [Validators.required]],
      publicationYear: [''],
      totalCopies: ['', [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  private setupSearchDebounce() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.search();
      });
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
          this.errorMessage = 'Failed to load genres';
        },
      });
  }

  search() {
    this.loading = true;
    const searchRequest: BookSearchRequest = {
      title: this.searchTerm,
      genreId: this.selectedGenre || undefined,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'title',
      sortDirection: 'ASC',
    };

    this.bookService
      .searchBooks(searchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<Book>) => {
          this.books = response.content;
          this.currentPage = response.currentPage;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;

          // Apply availability filter client-side
          if (this.availabilityFilter !== null) {
            this.books = this.books.filter(book =>
              this.availabilityFilter ? book.availableCopies > 0 : book.availableCopies === 0
            );
          }

          this.loading = false;
        },
        error: error => {
          console.error('Failed to search books:', error);
          this.errorMessage = 'Failed to load books. Please try again.';
          this.loading = false;
        },
      });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onGenreFilter(event: any) {
    this.selectedGenre = event.target.value ? parseInt(event.target.value) : null;
    this.currentPage = 0;
    this.search();
  }

  onAvailabilityFilter(event: any) {
    const value = event.target.value;
    this.availabilityFilter = value === '' ? null : value === 'true';
    this.currentPage = 0;
    this.search();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.search();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.search();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.bookForm.reset();
    this.showModal = true;
  }

  editBook(book: Book) {
    this.isEditMode = true;
    this.selectedBook = null;
    this.showViewModal = false;
    this.bookForm.patchValue({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      genreId: book.genreId,
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      description: book.description,
    });
    this.bookForm.get('isbn')?.disable();
    this.showModal = true;
  }

  saveBook() {
    if (this.bookForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.bookForm.getRawValue();

    if (this.isEditMode && this.selectedBook) {
      const updateRequest: UpdateBookRequest = {
        title: formValue.title,
        author: formValue.author,
        genreId: formValue.genreId,
        publicationYear: formValue.publicationYear,
        totalCopies: formValue.totalCopies,
        description: formValue.description,
      };

      this.bookService
        .updateBook(this.selectedBook.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Book updated successfully';
            this.closeModal();
            this.search();
            this.isSubmitting = false;
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: error => {
            console.error('Failed to update book:', error);
            this.errorMessage = 'Failed to update book. Please try again.';
            this.isSubmitting = false;
          },
        });
    } else {
      const createRequest: CreateBookRequest = formValue;

      this.bookService
        .createBook(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Book added successfully';
            this.closeModal();
            this.search();
            this.isSubmitting = false;
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: error => {
            console.error('Failed to add book:', error);
            this.errorMessage = 'Failed to add book. Please try again.';
            this.isSubmitting = false;
          },
        });
    }
  }

  viewBook(book: Book) {
    this.selectedBook = book;
    this.showViewModal = true;
  }

  deleteBook(bookId: number, bookTitle: string) {
    this.deleteBookId = bookId;
    this.deleteBookTitle = bookTitle;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.deleteBookId) return;

    this.isDeleting = true;

    this.bookService
      .deleteBook(this.deleteBookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Book deleted successfully';
          this.closeDeleteConfirm();
          this.search();
          this.isDeleting = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: error => {
          console.error('Failed to delete book:', error);
          this.errorMessage = 'Failed to delete book. Please try again.';
          this.isDeleting = false;
        },
      });
  }

  cancelDelete(event?: Event) {
    if (event) event.stopPropagation();
    this.closeDeleteConfirm();
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deleteBookId = null;
    this.deleteBookTitle = '';
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.selectedBook = null;
    this.bookForm.reset();
    this.bookForm.get('isbn')?.enable();
  }

  closeViewModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showViewModal = false;
    this.selectedBook = null;
  }

  protected readonly Math = Math;
}
