import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideHttpClient(withFetch()), // ✅ Enables Fetch API for HttpClient
    ...(appConfig.providers || [])
  ],
}).catch((err) => console.error(err));
