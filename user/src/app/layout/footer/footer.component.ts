import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- About -->
          <div>
            <h3 class="text-white font-bold mb-4">About LibraryHub</h3>
            <p class="text-sm">Your digital library management companion. Borrow, manage, and explore books online.</p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/books" class="hover:text-white transition-colors">Browse Books</a></li>
              <li><a routerLink="/subscriptions" class="hover:text-white transition-colors">Subscriptions</a></li>
              <li><a routerLink="/book-loans" class="hover:text-white transition-colors">My Loans</a></li>
              <li><a routerLink="/profile" class="hover:text-white transition-colors">Profile</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-white font-bold mb-4">Support</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Report Issue</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-white font-bold mb-4">Legal</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <hr class="border-gray-700 mb-8" />

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm">&copy; 2024 LibraryHub. All rights reserved.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-white transition-colors">Facebook</a>
            <a href="#" class="hover:text-white transition-colors">Twitter</a>
            <a href="#" class="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" class="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {}
