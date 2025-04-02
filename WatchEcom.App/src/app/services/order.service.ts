import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://your-api.com/orders'; // ✅ Replace with actual API

  constructor(private http: HttpClient) {}

  getOrders(userId: number, token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }
}
