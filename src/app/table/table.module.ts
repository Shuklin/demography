import {TableComponent} from './table.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableRoutingModule} from './table-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbdSortableHeader} from './sortable.directive';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TableRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [TableComponent, NgbdSortableHeader],
  providers: []
})
export class TableModule {
}
