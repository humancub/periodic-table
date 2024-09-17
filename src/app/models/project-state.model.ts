import { PeriodicElement } from './periodic-element.model';

export interface ProjectState {
  filterValue: string;
  elements: PeriodicElement[];
  isLoading: boolean;
}
