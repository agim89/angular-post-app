import {Post} from './post.model';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'posts';
@Injectable({ providedIn: 'root'})
export class PostsService {

  constructor(private http: HttpClient, private router: Router) {

  }
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private pagerInfo = new Subject<any>();

  getPosts(page, size) {
     this.http.get<{message: string, posts: any, totalItems: any, totalPages: any}>(BACKEND_URL + `?page=${page}&size=${size}`)
       .pipe(map((postData) => {
         this.pagerInfo.next({totalPages: postData.totalPages, totalItems: postData.totalItems});
         return postData.posts.map(post => {
           return {
             title: post.title,
             content: post.content,
             id: post._id,
             imagePath: post.imagePath,
             creator: post.creator
           };
         });
    })).subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPagerResult() {
    return this.pagerInfo.asObservable();
  }
  getPost(id ) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + '/' + id);
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title),
    postData.append('content', content),
    postData.append('image', image, title),
    this.http.post<{message: string, post: any}>(BACKEND_URL, postData).subscribe(res => {
      console.log(res)
      const post: Post = {id: res.post.id, title: res.post._doc.title, content: res.post._doc.content, imagePath: res.post._doc.imagePath, creator: null};
      console.log(post)
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);

    });
  }
  updatePost(id, title, content, image: File | string ) {
    let post;
    if (typeof(image) === 'object') {
        const postData = new FormData();
        postData.append('id', id),
        postData.append('title', title),
        postData.append('content', content),
        postData.append('image', image, title),
        post = postData;
    } else {
      const postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
      post = postData;
    }
    this.http.put(BACKEND_URL + '/' + id, post).subscribe(res => {
      const newPost  = {
        id: id,
        title: title,
        content: content,
        imagePath: '',
        creator: null
      }
      this.posts.splice(this.posts.indexOf((this.posts.find(x => x.id == id))), 1, newPost)
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
}

  deletePost(postId: string) {
    this.http.delete(BACKEND_URL + '/' + postId).subscribe(res => {
      this.posts.splice(this.posts.indexOf(this.posts.find(x => x.id == postId)), 1);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
