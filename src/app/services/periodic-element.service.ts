import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ELEMENT_DATA, PeriodicElement } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PeriodicElementService {
  constructor() {}

  getElements(): Observable<PeriodicElement[]> {
    return of(ELEMENT_DATA);
  }
}
