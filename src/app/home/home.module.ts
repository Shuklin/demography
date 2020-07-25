import {HomeComponent} from './home.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {PostsService} from './posts.service';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgbCarouselModule
  ],
  declarations: [HomeComponent],
  providers: [PostsService]
})
export class HomeModule {
}
