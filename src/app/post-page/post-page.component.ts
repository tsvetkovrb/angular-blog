import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../shared/post.service';
import { switchMap } from 'rxjs/operators';
import { Post } from '../shared/interfaces';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent implements OnInit {
  post: Post;

  constructor(
    private router: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.router.params
      .pipe(switchMap((params) => this.postService.getById(params['id'])))
      .subscribe((post) => {
        this.post = post;
      });
  }
}
