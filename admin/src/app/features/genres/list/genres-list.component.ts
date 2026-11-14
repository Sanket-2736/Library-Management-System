import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { GenreService } from '@services/genre.service';
import { BookService } from '@services/book.service';
import { Genre, CreateGenreRequest, UpdateGenreRequest, Book } from '@models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="p-6 max-w-7xl mx-auto" *ngIf="!loading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Genres Management</h1>
          <p class="text-gray-600 mt-1">Total: {{ genres.length }} genres</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary flex items-center gap-2">
          <lucide-angular name="plus" class="w-4 h-4"></lucide-angular>
          Add Genre
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

      <!-- Genres Table -->
      <div class="card overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Books</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let genre of genres">
                <td class="font-mono text-sm font-bold">{{ genre.code }}</td>
                <td>
                  <button (click)="viewGenre(genre)" class="text-blue-600 hover:underline font-medium">
                    {{ genre.name }}
                  </button>
                </td>
                <td class="text-sm text-gray-600">
                  {{ genre.description?.substring(0, 50) || '-' }}
                  <span *ngIf="genre.description && genre.description.length > 50">...</span>
                </td>
                <td class="text-center">{{ genre.displayOrder }}</td>
                <td class="text-center">
                  <span class="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                    {{ genre.bookCount || 0 }}
                  </span>
                </td>
                <td>
                  <span [ngClass]="genre.active ? 'badge badge-success' : 'badge badge-warning'">
                    {{ genre.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="editGenre(genre)"
                      title="Edit"
                      class="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <lucide-angular name="edit-2" class="w-4 h-4"></lucide-angular>
                    </button>
                    <button
                      (click)="deleteGenre(genre.id, genre.name)"
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
          <div *ngIf="genres.length === 0" class="text-center py-12">
            <lucide-angular name="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-angular>
            <p class="text-gray-600 font-medium">No genres found</p>
            <p class="text-gray-500 text-sm">Click "Add Genre" to create your first genre</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Genre Modal (Add/Edit) -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal($event)">
      <div class="modal-content max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Genre' : 'Add New Genre' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <form [formGroup]="genreForm" (ngSubmit)="saveGenre()" class="space-y-4">
          <!-- Code -->
          <div>
            <label class="form-label">Code</label>
            <input
              type="text"
              formControlName="code"
              placeholder="e.g. FIC"
              class="form-input uppercase"
              maxlength="10"
              [readonly]="isEditMode"
            />
            <p *ngIf="genreForm.get('code')?.hasError('required')" class="form-error">Code is required</p>
          </div>

          <!-- Name -->
          <div>
            <label class="form-label">Name</label>
            <input
              type="text"
              formControlName="name"
              placeholder="e.g. Fiction"
              class="form-input"
            />
            <p *ngIf="genreForm.get('name')?.hasError('required')" class="form-error">Name is required</p>
          </div>

          <!-- Display Order -->
          <div>
            <label class="form-label">Display Order</label>
            <input
              type="number"
              formControlName="displayOrder"
              placeholder="e.g. 1"
              class="form-input"
              min="0"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="form-label">Description</label>
            <textarea
              formControlName="description"
              placeholder="Enter genre description"
              class="form-input h-20"
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
              [disabled]="genreForm.invalid || isSubmitting"
              class="btn btn-primary flex-1"
            >
              <span *ngIf="!isSubmitting">{{ isEditMode ? 'Update Genre' : 'Add Genre' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Genre Details Modal -->
    <div *ngIf="showViewModal" class="modal-overlay" (click)="closeViewModal($event)">
      <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Genre Details</h2>
          <button (click)="closeViewModal()" class="text-gray-600 hover:text-gray-900">
            <lucide-angular name="x" class="w-6 h-6"></lucide-angular>
          </button>
        </div>

        <div *ngIf="selectedGenre" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">Code</p>
              <p class="text-gray-900 font-mono font-bold">{{ selectedGenre.code }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Status</p>
              <span [ngClass]="selectedGenre.active ? 'badge badge-success' : 'badge badge-warning'">
                {{ selectedGenre.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Name</p>
              <p class="text-gray-900">{{ selectedGenre.name }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Display Order</p>
              <p class="text-gray-900">{{ selectedGenre.displayOrder }}</p>
            </div>
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Books</p>
              <p class="text-gray-900 font-bold text-lg">{{ selectedGenre.bookCount || 0 }}</p>
            </div>
          </div>

          <div *ngIf="selectedGenre.description">
            <p class="text-gray-600 text-sm font-medium">Description</p>
            <p class="text-gray-900 mt-2">{{ selectedGenre.description }}</p>
          </div>

          <!-- Books in Genre -->
          <div *ngIf="selectedGenre.bookCount && selectedGenre.bookCount > 0" class="pt-4 border-t">
            <p class="text-gray-600 text-sm font-medium mb-3">Books in this genre</p>
            <div *ngIf="genreBooks.length > 0">
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div *ngFor="let book of genreBooks" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ book.title }}</p>
                    <p class="text-xs text-gray-600">by {{ book.author }}</p>
                  </div>
                  <span class="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {{ book.availableCopies }}/{{ book.totalCopies }}
                  </span>
                </div>
              </div>
            </div>
            <div *ngIf="genreBooks.length === 0" class="text-sm text-gray-600 italic">
              Loading books...
            </div>
          </div>

          <div class="flex gap-4 pt-6">
            <button (click)="editGenre(selectedGenre)" class="btn btn-primary flex-1">
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
        <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Delete Genre?</h2>
        <p class="text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{{ deleteGenreName }}</strong>? This action cannot be undone.
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
export class GenresListComponent implements OnInit, OnDestroy {
  genres: Genre[] = [];
  genreForm: FormGroup;

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

  // Selected Genre
  selectedGenre: Genre | null = null;
  deleteGenreId: number | null = null;
  deleteGenreName = '';
  genreBooks: Book[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private genreService: GenreService,
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.genreForm = this.createGenreForm();
  }

  ngOnInit() {
    this.loadGenres();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createGenreForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      displayOrder: [0, [Validators.min(0)]],
      description: [''],
    });
  }

  loadGenres() {
    this.loading = true;

    this.genreService
      .getAllGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: genres => {
          this.genres = genres.sort((a, b) => a.displayOrder - b.displayOrder);
          this.loading = false;

          // Load book counts for each genre
          this.genres.forEach(genre => {
            this.genreService
              .getBookCountByGenre(genre.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: count => {
                  genre.bookCount = count;
                },
              });
          });
        },
        error: error => {
          console.error('Failed to load genres:', error);
          this.errorMessage = 'Failed to load genres';
          this.loading = false;
        },
      });
  }

  openAddModal() {
    this.isEditMode = false;
    this.genreForm.reset({ displayOrder: 0 });
    this.showModal = true;
  }

  editGenre(genre: Genre) {
    this.isEditMode = true;
    this.selectedGenre = null;
    this.showViewModal = false;
    this.genreForm.patchValue({
      code: genre.code,
      name: genre.name,
      displayOrder: genre.displayOrder,
      description: genre.description,
    });
    this.genreForm.get('code')?.disable();
    this.showModal = true;
  }

  saveGenre() {
    if (this.genreForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.genreForm.getRawValue();

    if (this.isEditMode && this.selectedGenre) {
      const updateRequest: UpdateGenreRequest = {
        code: formValue.code,
        name: formValue.name,
        displayOrder: formValue.displayOrder,
        description: formValue.description,
      };

      this.genreService
        .updateGenre(this.selectedGenre.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Genre updated successfully';
            this.closeModal();
            this.loadGenres();
            this.isSubmitting = false;
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: error => {
            console.error('Failed to update genre:', error);
            this.errorMessage = 'Failed to update genre. Please try again.';
            this.isSubmitting = false;
          },
        });
    } else {
      const createRequest: CreateGenreRequest = formValue;

      this.genreService
        .createGenre(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Genre added successfully';
            this.closeModal();
            this.loadGenres();
            this.isSubmitting = false;
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: error => {
            console.error('Failed to add genre:', error);
            this.errorMessage = 'Failed to add genre. Please try again.';
            this.isSubmitting = false;
          },
        });
    }
  }

  viewGenre(genre: Genre) {
    this.selectedGenre = genre;
    this.genreBooks = [];
    this.showViewModal = true;

    // Load books for this genre
    const searchRequest = {
      genreId: genre.id,
      page: 0,
      size: 100,
    };

    this.bookService
      .searchBooks(searchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.genreBooks = response.content;
        },
        error: error => {
          console.error('Failed to load genre books:', error);
        },
      });
  }

  deleteGenre(genreId: number, genreName: string) {
    this.deleteGenreId = genreId;
    this.deleteGenreName = genreName;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.deleteGenreId) return;

    this.isDeleting = true;

    this.genreService
      .deleteGenre(this.deleteGenreId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Genre deleted successfully';
          this.closeDeleteConfirm();
          this.loadGenres();
          this.isDeleting = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: error => {
          console.error('Failed to delete genre:', error);
          this.errorMessage = 'Failed to delete genre. Please try again.';
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
    this.deleteGenreId = null;
    this.deleteGenreName = '';
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showModal = false;
    this.selectedGenre = null;
    this.genreForm.reset({ displayOrder: 0 });
    this.genreForm.get('code')?.enable();
  }

  closeViewModal(event?: Event) {
    if (event) event.stopPropagation();
    this.showViewModal = false;
    this.selectedGenre = null;
    this.genreBooks = [];
  }
}
