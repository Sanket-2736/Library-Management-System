import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GenreService } from '@core/services/genre.service';
import { Genre } from '@core/models/index';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-loading-spinner *ngIf="loading" [fullScreen]="true"></app-loading-spinner>

    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold mb-2">Browse by Genre</h1>
              <p class="text-purple-100">Explore {{ totalGenres }} different categories</p>
            </div>
            <lucide-angular name="library" class="w-16 h-16 opacity-50"></lucide-angular>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Genre Grid -->
        <div *ngIf="!loading && genres.length > 0">
          <!-- Top Level Genres -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">All Genres</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let genre of genres"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                (click)="selectGenre(genre.id)"
              >
                <!-- Genre Card Header with Color -->
                <div
                  [ngStyle]="{ backgroundColor: getGenreColor(genre.id) }"
                  class="h-20 opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <lucide-angular
                    [name]="getGenreIcon(genre.code)"
                    class="w-10 h-10 text-white opacity-80"
                  ></lucide-angular>
                </div>

                <!-- Genre Info -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ genre.name }}</h3>
                  <p class="text-gray-600 text-sm line-clamp-2 mb-4">
                    {{ genre.description || 'No description available' }}
                  </p>

                  <!-- Book Count -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span class="text-sm text-gray-600 font-medium">
                      <lucide-angular name="book" class="w-4 h-4 inline mr-1"></lucide-angular>
                      {{ genre.bookCount || 0 }} books
                    </span>
                    <button
                      (click)="selectGenre(genre.id); $event.stopPropagation()"
                      class="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition"
                    >
                      Browse
                      <lucide-angular name="arrow-right" class="w-4 h-4"></lucide-angular>
                    </button>
                  </div>
                </div>

                <!-- Subgenres Indicator -->
                <div
                  *ngIf="genre.subGenre && genre.subGenre.length > 0"
                  class="px-6 pb-4"
                >
                  <div class="flex flex-wrap gap-2">
                    <span
                      *ngFor="let sub of genre.subGenre | slice: 0: 3"
                      class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {{ sub.name }}
                    </span>
                    <span
                      *ngIf="genre.subGenre && genre.subGenre.length > 3"
                      class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      +{{ genre.subGenre.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Total Genres</p>
                  <p class="text-3xl font-bold text-blue-600">{{ totalGenres }}</p>
                </div>
                <lucide-angular name="library" class="w-12 h-12 text-blue-300"></lucide-angular>
              </div>
            </div>
            <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Top Genre</p>
                  <p class="text-lg font-bold text-purple-600">
                    {{ getTopGenre()?.name || 'N/A' }}
                  </p>
                </div>
                <lucide-angular name="crown" class="w-12 h-12 text-purple-300"></lucide-angular>
              </div>
            </div>
            <div class="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Total Books</p>
                  <p class="text-3xl font-bold text-green-600">{{ getTotalBooks() }}</p>
                </div>
                <lucide-angular name="book" class="w-12 h-12 text-green-300"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Genre Description -->
          <div class="mt-12 p-8 bg-white rounded-lg border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">About Our Library Genres</h3>
            <p class="text-gray-700 leading-relaxed">
              Our library offers a diverse collection organized into different genres to help you find the books
              that match your interests. Whether you're looking for fiction, non-fiction, mystery, romance, or
              any other genre, you can browse through our extensive catalog to discover your next favorite book.
              Each genre contains books from various authors and publishers, ensuring a wide selection for all
              readers.
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && genres.length === 0" class="text-center py-16">
          <lucide-angular name="inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Genres Available</h3>
          <p class="text-gray-600 mb-6">No genres are available at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class GenresListComponent implements OnInit, OnDestroy {
  genres: Genre[] = [];
  totalGenres = 0;

  loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private genreService: GenreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGenres();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGenres() {
    this.loading = true;

    this.genreService
      .getTopLevelGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: genres => {
          this.genres = genres.sort((a, b) => a.displayOrder - b.displayOrder);
          this.totalGenres = genres.length;
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load genres:', error);
          this.loading = false;
        },
      });
  }

  selectGenre(genreId: number) {
    this.router.navigate(['/genres', genreId]);
  }

  getGenreColor(genreId: number): string {
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#6366f1', // indigo
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

  getTopGenre(): Genre | undefined {
    return this.genres.reduce((max, genre) =>
      (genre.bookCount || 0) > (max.bookCount || 0) ? genre : max
    );
  }

  getTotalBooks(): number {
    return this.genres.reduce((sum, genre) => sum + (genre.bookCount || 0), 0);
  }
}
