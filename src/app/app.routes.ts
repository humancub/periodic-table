import { Route } from '@angular/router';
import { PeriodicTableComponent } from './components/periodic-table';

export const appRoutes: Route[] = [
  { path: 'periodic-table', component: PeriodicTableComponent },
  { path: '', redirectTo: '/periodic-table', pathMatch: 'full' },
];
