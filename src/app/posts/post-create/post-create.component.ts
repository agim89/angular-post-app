import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute} from '@angular/router';
import {mimeType} from './mime-type.validator';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  @Output() postCreated = new EventEmitter<Post>();
  private modeType = 'create';
  postId: any;
  post: Post;
  isLoading = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  form: FormGroup;
  imagePreview: any;
  authStatusSub: Subscription;
  constructor(public postsService: PostsService,
              private route: ActivatedRoute, private  authService: AuthService) {
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.queryParams.subscribe(res => {
      if (res['postId']) {
        this.modeType = 'edit';
        this.postId = res.postId;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(result => {
          this.imagePreview = result.imagePath;
          this.post = {id: this.postId, title: result.title, content: result.content, imagePath: result.imagePath, creator: result.creator};
          this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath});
          this.isLoading = false;
        });
      } else {
        this.modeType = 'create';
        this.postId = null;
      }
    });

    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.modeType === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }
    this.form.reset();
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview =  reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(this.imagePreview)

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
