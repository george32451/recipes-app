import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer = false;
  private destroyTimer$: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient, private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  get user(): Observable<User> {
    return this.store.select('auth', 'user');
  }

  get authState(): Observable<fromAuth.State> {
    return this.store.select('auth');
  }

  signup(email: string, password: string): void {
    this.store.dispatch(new AuthActions.SignupStart({ email, password }));
  }

  signin(email: string, password: string): void {
    this.store.dispatch(new AuthActions.LoginStart({ email, password }));
  }

  autoLogin(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  logout(): void {
    this.store.dispatch(new AuthActions.Logout());
    if (this.tokenExpirationTimer) {
      this.destroyTimer$.next();
      this.destroyTimer$.complete();
    }
    this.tokenExpirationTimer = false;
  }

  setLogoutTimer(expirationDuration: number): void {
    this.tokenExpirationTimer = true;
    timer(expirationDuration)
      .pipe(takeUntil(this.destroyTimer$))
      .subscribe(() => this.logout(), () => {}, () => this.tokenExpirationTimer = false);
  }

}
