import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WatchesComponent } from './watches/watches.component';
import { OrdersComponent } from './orders/orders.component';
import { RegisterComponent } from './register/register.component';

export const appRoutes = [
  { path: '', component: LoginComponent },
  { path: 'watches', component: WatchesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'register', component: RegisterComponent } // 🔹 Add this
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(appRoutes)
];
