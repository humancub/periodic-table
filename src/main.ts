import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { PeriodicTableComponent } from './app/components/periodic-table';

bootstrapApplication(PeriodicTableComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes),
  ],
}).catch((err) => console.error(err));
