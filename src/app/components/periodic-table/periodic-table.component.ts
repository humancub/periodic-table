import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElementService } from '../../services/periodic-element.service';
import { PeriodicElement } from '../../models/periodic-element.model';
import { MaterialModule } from '../../shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditElementDialogComponent } from '../../dialogs';
import { Subject, Observable } from 'rxjs';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { ProjectState } from '../../models';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule],
  providers: [RxState],
})
export class PeriodicTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>();
  private filterSubject = new Subject<string>();
  public isLoading$: Observable<boolean>;
  public elements$: Observable<PeriodicElement[]>;

  constructor(
    private elementService: PeriodicElementService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private state: RxState<ProjectState>
  ) {
    this.isLoading$ = this.state.select('isLoading');
    this.elements$ = this.state.select('elements');
  }

  ngOnInit(): void {
    this.loadElements();

    this.isLoading$.subscribe((isLoading) => {});

    this.filterSubject.pipe(debounceTime(2000)).subscribe((filterValue) => {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.filteredData.length === 0) {
        this.snackBar.open('No elements found', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  private loadElements(): void {
    this.state.set({ isLoading: true });
    this.elementService
      .getElements()
      .pipe(
        tap((data) => {
          this.state.set({ elements: data });
          this.dataSource.data = data;
        }),
        finalize(() => this.state.set({ isLoading: false }))
      )
      .subscribe();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  public openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (item) => item.position === result.position
        );
        if (index !== -1) {
          const updatedData = this.dataSource.data.map((item) =>
            item.position === result.position ? { ...result } : item
          );
          this.dataSource.data = updatedData;

          this.snackBar.open('Element updated successfully!', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }
}
