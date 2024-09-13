import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElementService } from '../../services/periodic-element.service';
import { PeriodicElement } from '../../models/periodic-element.model';
import { MaterialModule } from '../../shared';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditElementDialogComponent } from '../../dialogs';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  filterValue: string = '';
  private filterSubject = new Subject<string>();

  constructor(
    private elementService: PeriodicElementService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.elementService.getElements().subscribe((data) => {
      this.dataSource.data = [...data];
    });

    this.filterSubject.pipe(debounceTime(2000)).subscribe((filterValue) => {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.filteredData.length === 0) {
        this.snackBar.open('No elements found', 'Close', {
          duration: 3000,
        });
      }
    });
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
