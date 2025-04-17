import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchService } from '../services/watch.service';
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
  // Filter state
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedPriceRange: number = 20000;

  constructor(private watchService: WatchService, private router: Router) {}

  ngOnInit() {
    this.watchService.getWatches().subscribe(
      (data) => {
        console.log('Fetched Watches:', data);
        this.watches = data.length > 0 ? this.mapApiData(data) : this.getDefaultWatches();
        this.applyFilters(); // Run filters after data is loaded
      },
      (error) => {
        console.error('Error fetching watches:', error);
        this.watches = this.getDefaultWatches();
        this.applyFilters();
      }
    );

    this.initializeUserCart();
  }

  private initializeUserCart() {
    const user = this.getLoggedInUser();
    if (!user) {
      console.warn('⚠️ No user logged in.');
      this.cart = [];
      return;
    }

    this.userCartKey = `cart_${user}`;
    this.loadCart();
  }

  private loadCart() {
    if (typeof window !== 'undefined' && localStorage) {
      const savedCart = localStorage.getItem(this.userCartKey);
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    } else {
      console.warn('⚠️ localStorage is not available.');
      this.cart = [];
    }
  }

  addToCart(watch: any) {
    const user = this.getLoggedInUser();
    if (!user) {
      alert('⚠️ Please log in to add items to your cart.');
      return;
    }

    this.cart.push(watch);
    localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
    console.log('Cart Updated:', this.cart);
  }

  viewCart() {
    this.router.navigate(['/orders']);
  }

  Logout() {
    this.router.navigate(['/login']);
  }

  private getLoggedInUser(): string | null {
    return typeof window !== 'undefined' && localStorage
      ? localStorage.getItem('loggedInUser')
      : null;
  }

  private mapApiData(apiData: any[]): any[] {
    return apiData.map(item => ({
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
      const matchesPrice =watch.price <= this.selectedPriceRange;
      const matchesBrand = this.selectedBrand? watch.brand === this.selectedBrand: true;
      return matchesCategory && matchesSearch && matchesPrice &&matchesBrand;
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
