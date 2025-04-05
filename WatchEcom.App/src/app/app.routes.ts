import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WatchesComponent } from './watches/watches.component';
import { RegisterComponent } from './register/register.component';

export const appRoutes = [
  { path: '', component: LoginComponent },
  { path: 'watches', component: WatchesComponent },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders.component').then(m => m.OrdersComponent) //lazy loadind load when only i need it dont unnecessarily
  },
  { path: 'register', component: RegisterComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(appRoutes)
];
