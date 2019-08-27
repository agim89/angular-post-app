import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
isLoading = false;
authStatusSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(res => {
      this.isLoading = false;
    });
  }
  onSignup(form) {
    if (form.invalid) {
      return;
    }
    this.authService.createNewUser(form.controls.email.value, form.controls.password.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
