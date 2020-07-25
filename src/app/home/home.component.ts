import {Component, OnInit} from '@angular/core';
import {PostsService} from './posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slides: Array<any> = [];

  constructor(
    private postsService: PostsService
  ) {
  }

  ngOnInit(): void {
    this.postsService.getPosts().subscribe(res => {
      this.slides = res.slice(0, 5).map(slide => {
        slide.img = `https://picsum.photos/id/${slide.id}/600/400`;
        return slide;
      });
    });
  }

}
