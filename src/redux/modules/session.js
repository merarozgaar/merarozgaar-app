// @flow
import actionTypeCreator from '../../utils/actionTypeCreator';
import type { ActionType, ThunkActionType } from '../types';

export const actionTypes: {
  API_ERROR: string,
  API_REQUEST: string,
  API_SUCCESS: string,
  SIGN_OUT: string,
} = actionTypeCreator('session', [
  'API_ERROR',
  'API_REQUEST',
  'API_SUCCESS',
  'SIGN_OUT',
]);

export type SessionStateType = {
  error: any,
  loading: boolean,
  session: Object,
};

const initialState: SessionStateType = {
  error: null,
  loading: false,
  session: {},
};

export default function sessionReducer(
  state: SessionStateType = initialState,
  { type, payload }: ActionType,
) {
  switch (type) {
    case actionTypes.API_ERROR: {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    }

    case actionTypes.API_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }

    case actionTypes.API_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        session: { ...state.session, ...payload },
      };
    }

    case actionTypes.SIGN_OUT:
      return initialState;

    default:
      return state;
  }
}

export function apiError(payload: Object): ActionType {
  return {
    type: actionTypes.API_ERROR,
    payload,
  };
}

export function apiRequest(): ActionType {
  return {
    type: actionTypes.API_REQUEST,
  };
}

export function apiSuccess(payload: Object): ActionType {
  return {
    type: actionTypes.API_SUCCESS,
    payload,
  };
}

export function signOut(): ActionType {
  return {
    type: actionTypes.SIGN_OUT,
  };
}

export function signIn(payload: Object): ThunkActionType {
  return (dispatch) => dispatch(apiSuccess(payload));
}
