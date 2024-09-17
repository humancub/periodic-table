import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { PeriodicElement } from '../models';
import { RxState } from '@rx-angular/state';
import { ELEMENT_DATA } from '../mocks';

@Injectable({
  providedIn: 'root',
})
export class PeriodicElementService {
  constructor(private state: RxState<{ isLoading: boolean }>) {
    this.state.set({ isLoading: false });
  }

  getElements(): Observable<PeriodicElement[]> {
    this.state.set({ isLoading: true });
    return of(ELEMENT_DATA).pipe(
      delay(3000),
      tap(() => this.state.set({ isLoading: false }))
    );
  }
}
