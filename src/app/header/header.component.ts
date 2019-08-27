import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
private authListenerSub: Subscription;
userIsAuthenticated = false;
  constructor(private authServeice: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authServeice.getIsAuth();
    this.authListenerSub = this.authServeice.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  logOut() {
    this.authServeice.logOut();
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();

  }

}
