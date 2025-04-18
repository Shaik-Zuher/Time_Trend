import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchService } from '../services/watch.service';
import { WishlistService } from '../services/wishlist.service'; // Import WishlistService
import { Router } from '@angular/router';

@Component({
  selector: 'app-watches',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './watches.component.html',
  styleUrls: ['./watches.component.css'],
})
export class WatchesComponent implements OnInit {
  watches: any[] = [];
  filteredWatches: any[] = [];
  cart: any[] = [];
  apiBaseUrl: string = 'http://localhost:5194';
  userCartKey: string = '';
  wishlistItems: number[] = [];  // Add wishlistItems to store watch IDs in the wishlist

  // Filter state
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedPriceRange: number = 20000;

  constructor(
    private watchService: WatchService,
    private wishlistService: WishlistService, // Inject WishlistService
    private router: Router
  ) {}

  ngOnInit() {
    this.watchService.getWatches().subscribe(
      (data) => {
        this.watches = data.length > 0 ? this.mapApiData(data) : this.getDefaultWatches();
        this.applyFilters(); // Run filters after data is loaded
      },
      (error) => {
        this.watches = this.getDefaultWatches();
        this.applyFilters();
      }
    );

    this.initializeUserCart();
    this.loadWishlist();  // Load wishlist when the component is initialized
  }

  // Check if we are in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Wishlist functions
  loadWishlist() {
    const user = this.getLoggedInUser();
    if (!user) {
      return;
    }

    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items.map(item => item.watchId);  // Map the fetched wishlist to watch IDs
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          alert('Failed to load wishlist. Please try again.');
        }
      }
    });
  }

  isInWishlist(watchId: number): boolean {
    return this.wishlistItems.includes(watchId);  // Check if the watch ID is in the wishlist
  }

  toggleWishlist(watch: any) {
    const user = this.getLoggedInUser();
    if (!user) {
      alert('⚠️ Please log in to manage your wishlist.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isInWishlist(watch.id)) {
      this.wishlistService.removeFromWishlist(watch.id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(id => id !== watch.id);  // Remove from the wishlist
        },
        error: (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            alert('Failed to remove from wishlist. Please try again.');
          }
        }
      });
    } else {
      this.wishlistService.addToWishlist(watch.id).subscribe({
        next: () => {
          this.wishlistItems.push(watch.id);  // Add to the wishlist
        },
        error: (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            alert('Failed to add to wishlist. Please try again.');
          }
        }
      });
    }
  }

  viewWishlist() {
    const user = this.getLoggedInUser();
    if (!user) {
      alert('⚠️ Please log in to view your wishlist.');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/wishlist']);
  }

  private initializeUserCart() {
    if (!this.isBrowser()) {
      return;
    }

    const user = this.getLoggedInUser();
    if (!user) {
      this.cart = [];
      return;
    }

    this.userCartKey = `cart_${user}`;
    this.loadCart();
  }

  private loadCart() {
    if (!this.isBrowser()) {
      this.cart = [];
      return;
    }

    const savedCart = localStorage.getItem(this.userCartKey);
    this.cart = savedCart ? JSON.parse(savedCart) : [];
  }

  addToCart(watch: any) {
    if (!this.isBrowser()) {
      return;
    }

    const user = this.getLoggedInUser();
    if (!user) {
      alert('⚠️ Please log in to add items to your cart.');
      return;
    }

    this.cart.push(watch);
    localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
  }

  viewCart() {
    this.router.navigate(['/orders']);
  }

  Logout() {
    this.router.navigate(['/login']);
  }

  private getLoggedInUser(): string | null {
    return this.isBrowser() ? localStorage.getItem('loggedInUser') : null;
  }

  private mapApiData(apiData: any[]): any[] {
    return apiData.map(item => ({
      id: item.id,  // Preserve the ID from the API data
      brand: item.brand,
      model: item.model,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl ? `${this.apiBaseUrl}${item.imageUrl}` : 'assets/default-watch.jpg',
      category: item.category ? item.category : ''  // Ensure category exists
    }));
  }

  private getDefaultWatches() {
    return [
      { brand: 'Rolex', model: 'Submariner', price: 12000, description: 'Luxury diving watch', category: 'Luxury Series', imageUrl: 'assets/watches/1.jpg' },
      { brand: 'Casio', model: 'G-Shock', price: 150, description: 'Durable sports watch', category: 'Sports Edition', imageUrl: 'assets/watches/2.jpg' },
      { brand: 'Omega', model: 'Speedmaster', price: 5000, description: 'Classic moonwatch', category: 'Classic Designs', imageUrl: 'assets/watches/3.jpg' }
    ];
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase();
  
    this.filteredWatches = this.watches.filter(watch => {
      const matchesCategory = this.selectedCategory
        ? watch.category.trim().toLowerCase() === this.selectedCategory.trim().toLowerCase()
        : true;
  
      const matchesSearch =
        watch.brand.toLowerCase().includes(query) ||
        watch.model.toLowerCase().includes(query) ||
        watch.description.toLowerCase().includes(query);
      const matchesPrice = watch.price <= this.selectedPriceRange;
      const matchesBrand = this.selectedBrand ? watch.brand === this.selectedBrand : true;
      return matchesCategory && matchesSearch && matchesPrice && matchesBrand;
    });
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedPriceRange = 20000;
    this.searchQuery = '';
    this.applyFilters();
  }
}
