import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../shared/interfaces';
import { PostService } from '../shared/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private gSub: Subscription;

  constructor(private postsService: PostService) {}

  ngOnInit(): void {
    this.gSub = this.postsService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.gSub?.unsubscribe();
  }
}
