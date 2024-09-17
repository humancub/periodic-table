import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { PeriodicTableComponent } from './app/components/periodic-table';
import { RxState } from '@rx-angular/state';

bootstrapApplication(PeriodicTableComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes),
    RxState,
  ],
}).catch((err) => console.error(err));
