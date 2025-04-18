import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  cart: any[] = [];
  userCartKey: string = '';
  apiBaseUrl: string = 'http://localhost:5194';  // use https if your backend uses it

  constructor(
    public router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.loadWishlist();
    this.initializeUserCart();
  }

  loadWishlist() {
    console.log('Wishlist Items with image URLs:', this.wishlistItems);
    this.wishlistService.getWishlist().subscribe(
      items => {
        this.wishlistItems = items.map(item => ({
          ...item,
          watch: {
            ...item.watch,
            imageUrl: item.watch.imageUrl
              ? `${this.apiBaseUrl}${item.watch.imageUrl}`
              : 'assets/default-watch.jpg'
          }
        }));
      },
      error => {
        console.error('Error loading wishlist:', error);
      }
    );
  }
  
  removeFromWishlist(watchId: number) {
    this.wishlistService.removeFromWishlist(watchId).subscribe(() => {
      this.wishlistItems = this.wishlistItems.filter(item => item.watchId !== watchId);
    }, error => {
      console.error('Error removing from wishlist:', error);
    });
  }

  addToCart(watch: any) {
    const user = this.getLoggedInUser();
    
    if (!user) {
      alert('⚠️ Please log in to add items to your cart.');
      return;
    }

    this.cart.push(watch);
    localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
    alert('Item added to cart successfully!');
  }

  private initializeUserCart() {
    const user = this.getLoggedInUser();
    if (!user) {
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
      this.cart = [];
    }
  }

  Logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  private getLoggedInUser(): string | null {
    return typeof window !== 'undefined' && localStorage
      ? localStorage.getItem('loggedInUser')
      : null;
  }
}
