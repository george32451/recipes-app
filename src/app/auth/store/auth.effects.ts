import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { AuthResponseData } from '../auth-response-data.interface';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupData: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          email: signupData.payload.email,
          password: signupData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map((signupResponse: AuthResponseData) => {
          return this.handleAuthentication(
            signupResponse.email,
            signupResponse.localId,
            signupResponse.idToken,
            +signupResponse.expiresIn
          );
        }),
        catchError(this.handleError),
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map((authResponse: AuthResponseData) => {
          return this.handleAuthentication(
            authResponse.email,
            authResponse.localId,
            authResponse.idToken,
            +authResponse.expiresIn
          );
        }),
        catchError(this.handleError)
      );
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: { email: string; id: string; _token: string; _tokenExpirationDate: string }
        = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'NOOP' };
      }

      if (userData._token) {
        const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationTime);

        return new AuthActions.AuthSuccess({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      }

      return { type: 'NOOP' };
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  private handleAuthentication(email: string, userId: string, token: string, expiration: number): AuthActions.AuthActions {
    const expirationDate = new Date(new Date().getTime() + expiration * 1000);
    const user = new User(email, userId, token, expirationDate);

    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(expiration * 1000);

    return new AuthActions.AuthSuccess({ email, userId, token, expirationDate, redirect: true });
  }

  private handleError(error: HttpErrorResponse): Observable<AuthActions.AuthFail> {
    let errorMessage = 'An unknown error occurred!';

    if (!error.error || !error.error.error) {
      return of(new AuthActions.AuthFail(errorMessage));
    }

    switch (error.error.error.message) {
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Email or password incorrect!';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user is blocked!';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!';
        break;
    }

    return of(new AuthActions.AuthFail(errorMessage));
  }
}
