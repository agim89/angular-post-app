import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  page = 1;
  size = 5;
  totalPages: any;
  totalItems: any;
  pageSizeOptions = [5, 10, 15, 20];
  userIsAuthenticated = false;
  userId: string;
  private postSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.refrashPosts();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  refrashPosts() {
    this.postsService.getPosts(this.page, this.size);
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    });
    this.postsService.getPagerResult().subscribe(res => {
      this.totalItems = res.totalItems;
    }, err => {
      this.isLoading = false;
    });
  }

  onDelete(postId) {
    this.postsService.deletePost(postId);
    this.refrashPosts();
  }

  onChangePage(event) {
    this.postsService.getPosts(event.pageIndex + 1, event.pageSize);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
