// @flow
import actionTypeCreator from '../../utils/actionTypeCreator';
import type { ActionType } from '../types';
import { actionTypes as sessionActions } from './session';

const actionTypes: {
  SETUP_APP_VIEW: string,
  RESET_APP_VIEW: string,
  SETUP_APP_LANGUAGE: string,
  TOGGLE_NOTIFICATION_REDIRECT: string,
  SET_NOTIFICATION_COUNT: string,
} = actionTypeCreator('app', [
  'SETUP_APP_VIEW',
  'RESET_APP_VIEW',
  'SETUP_APP_LANGUAGE',
  'TOGGLE_NOTIFICATION_REDIRECT',
  'SET_NOTIFICATION_COUNT',
]);

type AppViewType = '' | 'EMPLOYEE' | 'EMPLOYER';

type LanguageType = 'HINDI' | 'ENGLISH';

export type AppStateType = {
  appView: AppViewType,
  notificationRedirect: boolean,
  language: LanguageType,
  notificationCount: number,
};

const initialState: AppStateType = {
  appView: '',
  notificationRedirect: false,
  language: 'HINDI',
  notificationCount: 0,
};

export default function appReducer(
  state: AppStateType = initialState,
  { type, payload }: ActionType,
) {
  switch (type) {
    case actionTypes.SETUP_APP_VIEW: {
      return {
        ...state,
        appView: payload,
      };
    }

    case actionTypes.TOGGLE_NOTIFICATION_REDIRECT: {
      return {
        ...state,
        notificationRedirect: payload,
      };
    }

    case actionTypes.SETUP_APP_LANGUAGE: {
      return {
        ...state,
        language: payload,
      };
    }

    case actionTypes.SET_NOTIFICATION_COUNT: {
      return {
        ...state,
        notificationCount: payload,
      };
    }

    case actionTypes.RESET_APP_VIEW:
    case sessionActions.SIGN_OUT:
      return initialState;

    default:
      return state;
  }
}

export function setAppView(payload: AppViewType): ActionType {
  return {
    type: actionTypes.SETUP_APP_VIEW,
    payload,
  };
}

export function resetAppView(): ActionType {
  return {
    type: actionTypes.RESET_APP_VIEW,
  };
}

export function toggleNotificationRedirect(payload: boolean): ActionType {
  return {
    type: actionTypes.TOGGLE_NOTIFICATION_REDIRECT,
    payload,
  };
}

export function setupAppLanguage(payload: LanguageType): ActionType {
  return {
    type: actionTypes.SETUP_APP_LANGUAGE,
    payload,
  };
}

export function setNotificationCount(payload: number): ActionType {
  return {
    type: actionTypes.SET_NOTIFICATION_COUNT,
    payload,
  };
}
