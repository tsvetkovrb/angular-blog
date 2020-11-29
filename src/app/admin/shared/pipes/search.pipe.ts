import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../../../shared/interfaces';

@Pipe({
  name: 'searchPosts',
})
export class SearchPipe implements PipeTransform {
  transform(posts: Post[], searchValue: string): Post[] {
    if (!searchValue.trim()) {
      return posts;
    }

    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
}
