import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  error: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  error: null,
  isLoading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return { ...state, isLoading: true, error: null };

    case AuthActions.AUTH_SUCCESS: {
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return { ...state, user, isLoading: false, error: null };
    }

    case AuthActions.AUTH_FAIL:
      return { ...state, user: null, error: action.payload, isLoading: false };

    case AuthActions.LOGOUT:
      return { ...state, user: null, isLoading: false, error: null };

    default:
      return state;
  }
}
