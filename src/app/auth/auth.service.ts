import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthResponseData } from './auth-response-data.interface';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) {
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKDJztHve-RngZL8uWbzXWyYGul3iaSk8',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(response => this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn))
    );
  }

  signin(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKDJztHve-RngZL8uWbzXWyYGul3iaSk8',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(response => this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn))
    );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiration: number): void {
    const expirationDate = new Date(new Date().getTime() + expiration * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
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

    return throwError(errorMessage);
  }
}
