import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const AUTH_FAIL = '[Auth] Auth Fail';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) { }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) {
  }
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date }) { }
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;

  constructor(public payload: string) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  | LoginStart
  | SignupStart
  | AuthSuccess
  | AuthFail
  | Logout;
