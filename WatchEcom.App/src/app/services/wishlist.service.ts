import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5194/api/wishlist';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addToWishlist(watchId: number): Observable<any> {
    if (!watchId) {
      console.error('Error: Watch ID is undefined or invalid.');
      return throwError(() => new Error('Invalid Watch ID'));
    }

    const url = `${this.apiUrl}/${watchId}`;
    console.log('Sending POST request to:', url);

    // Assuming the API expects an empty body or specific structure
    return this.http.post(url, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  removeFromWishlist(watchId: number): Observable<any> {
    if (!watchId) {
      console.error('Error: Watch ID is undefined or invalid.');
      return throwError(() => new Error('Invalid Watch ID'));
    }

    const url = `${this.apiUrl}/${watchId}`;
    console.log('Sending DELETE request to:', url);

    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Wishlist service error:', error);

    // Unauthorized (401) - handle session expired or unauthenticated user
    if (error.status === 401) {
      return throwError(() => new Error('Please log in to access your wishlist'));
    }

    // Generic error handling
    return throwError(() => new Error('An error occurred while managing your wishlist'));
  }
}
