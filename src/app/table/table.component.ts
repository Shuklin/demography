import {Component, QueryList, ViewChildren} from '@angular/core';

import {Region, RegionService} from './region.service';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [RegionService, DecimalPipe]
})

export class TableComponent {
  regions$: Observable<Region[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: RegionService) {
    this.regions$ = service.regions$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent): void {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}

