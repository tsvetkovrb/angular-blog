import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../shared/post.service';
import { switchMap } from 'rxjs/operators';
import { Post } from '../../shared/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submitting = false;
  uSub: Subscription;

  constructor(
    private router: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.router.params
      .pipe(switchMap((params) => this.postService.getById(params['id'])))
      .subscribe((post: Post) => {
        this.post = post;

        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
        });
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    const post: Post = {
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    };

    this.uSub = this.postService.update(post).subscribe(() => {
      this.submitting = false;
    });
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
