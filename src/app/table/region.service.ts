import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {REGIONS} from './regions';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

export interface Region {
  id: number;
  name: string;

  population: number;
  urban: number;
  rural: number;

  area: number;
  density: number;
}

interface SearchResult {
  regions: Region[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(regions: Region[], column: SortColumn, direction: string): Region[] {
  if (direction === '' || column === '') {
    return regions;
  } else {
    return [...regions].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(region: Region, term: string, pipe: PipeTransform):void {
  return region.name.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(region.area).includes(term)
    || pipe.transform(region.population).includes(term);
}

@Injectable({providedIn: 'root'})
export class RegionService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _regions$ = new BehaviorSubject<Region[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._regions$.next(result.regions);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get regions$() { return this._regions$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let regions = sort(REGIONS, sortColumn, sortDirection);

    // 2. filter
    regions = regions.filter(region => matches(region, searchTerm, this.pipe));
    const total = regions.length;

    // 3. paginate
    regions = regions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({regions, total});
  }
}
