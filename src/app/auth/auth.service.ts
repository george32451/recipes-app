import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: number = null;

  constructor(
    private http: HttpClient, private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  get user(): Observable<User> {
    return this.store.select('auth').pipe(map(state => state.user));
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
    const userData: { email: string; id: string; _token: string; _tokenExpirationDate: string }
      = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    if (userData._token) {
      this.store.dispatch(new AuthActions.AuthSuccess({
        email: userData.email,
        userId: userData.id,
        token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  }

  logout(): void {
    this.store.dispatch(new AuthActions.Logout());
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

}
