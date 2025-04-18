import { provideRouter, withComponentInputBinding } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WatchesComponent } from './watches/watches.component';
import { RegisterComponent } from './register/register.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth guard function
const authGuard = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('loggedInUser') !== null;

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const appRoutes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' as const },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'watches', 
    component: WatchesComponent,
    canActivate: [authGuard] // Protects the route with auth guard
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard] // Protects the route with auth guard
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard] // Protects the route with auth guard
  },
  { path: '**', redirectTo: 'login' } // Catch-all wildcard route
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(appRoutes, withComponentInputBinding()) // Enable component input binding for lazy-loaded routes
];
