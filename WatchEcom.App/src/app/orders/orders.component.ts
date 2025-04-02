import { Component, OnInit } from '@angular/core';
import { NgFor, DatePipe, CurrencyPipe } from '@angular/common'; // ✅ Import necessary directives and pipes
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  imports: [NgFor, DatePipe, CurrencyPipe], // ✅ Explicitly add NgFor, DatePipe, and CurrencyPipe
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    const token = localStorage.getItem('token') || '';
    const userId = 1; // Replace with actual user ID from JWT

    this.orderService.getOrders(userId, token).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }
}