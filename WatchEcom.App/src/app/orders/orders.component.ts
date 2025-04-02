import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, CurrencyPipe, NgIf],
})
export class OrdersComponent implements OnInit {
  orders: any[] = []; // User's cart items (Orders)
  totalAmount: number = 0;
  userCartKey: string = ''; // Stores the unique key for the current user's cart

  ngOnInit() {
    this.initializeUserCart();
  }

  private initializeUserCart() {
    const user = this.getLoggedInUser();
    if (!user) {
      console.warn('⚠️ No user logged in.');
      this.orders = [];
      return;
    }

    this.userCartKey = `cart_${user}`; // Unique cart key for each user
    this.loadOrders();
  }

  private loadOrders() {
    if (typeof window !== 'undefined' && localStorage) {
      const savedOrders = localStorage.getItem(this.userCartKey);
      this.orders = savedOrders ? JSON.parse(savedOrders) : [];
      this.calculateTotal();
    } else {
      console.warn('⚠️ localStorage is not available.');
      this.orders = [];
    }
  }

  private calculateTotal() {
    this.totalAmount = this.orders.reduce((sum, item) => sum + item.price, 0);
  }

  removeItem(index: number) {
    this.orders.splice(index, 1);
    localStorage.setItem(this.userCartKey, JSON.stringify(this.orders));
    this.calculateTotal();
  }

  placeOrder() {
    if (this.orders.length === 0) {
      alert('⚠️ Your cart is empty. Add items before placing an order.');
      return;
    }

    alert('✅ Order placed successfully! Thank you for shopping with us.');
    this.clearOrders(); // ✅ Clear cart after placing order
  }

  // ✅ NEW: Clear orders manually
  clearOrders() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.userCartKey); // ✅ Remove cart for this user
      this.orders = [];
      this.totalAmount = 0;
      console.log('🗑️ Cart cleared.');
    } else {
      console.warn('⚠️ localStorage is not available.');
    }
  }
  // ✅ NEW: Get logged-in user safely
  private getLoggedInUser(): string | null {
    return typeof window !== 'undefined' && localStorage
      ? localStorage.getItem('loggedInUser')
      : null;
  }
}
