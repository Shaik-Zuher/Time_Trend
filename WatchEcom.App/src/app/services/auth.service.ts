import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',//says use globally without import
})
export class AuthService {
  private apiUrl = 'http://localhost:5194/api/auth'; //  API Endpoint

  constructor(private http: HttpClient) {}

  //  LOGIN - Authenticate user and store session data
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setLoggedInUser(username);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  //  REGISTER - Send user credentials to backend
  register(username: string, password: string, Security_Question: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password, Security_Question }).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }
  
  //  Store Token Securely
  public setToken(token: string) {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('token', token);
    }
  }

  //  Retrieve Token
  getToken(): string | null {
    return typeof window !== 'undefined' && localStorage ? localStorage.getItem('token') : null;
  }

  //  Store Logged-In User
  private setLoggedInUser(username: string) {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('loggedInUser', username);
    }
  }

  //  Retrieve Logged-In User
  getLoggedInUser(): string | null {
    return typeof window !== 'undefined' && localStorage ? localStorage.getItem('loggedInUser') : null;
  }

  //  Check if User is Authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  //  LOGOUT - Clear user session and user-specific cart
  logout() {
    const user = this.getLoggedInUser();
    if (user) {
      localStorage.removeItem(`cart_${user}`); //  Remove this user's cart only
    }
    localStorage.removeItem('token'); //  Remove token
    localStorage.removeItem('loggedInUser'); //  Remove user session
  }
  
}
