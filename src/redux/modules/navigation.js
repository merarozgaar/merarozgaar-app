// @flow
import actionTypeCreator from '../../utils/actionTypeCreator';
import type { ActionType } from '../types';
import { actionTypes as sessionActions } from './session';

const actionTypes: {
  SET_NAVIGATION_STATE: string,
  RESET_NAVIGATION_STATE: string,
} = actionTypeCreator('navigation', [
  'SET_NAVIGATION_STATE',
  'RESET_NAVIGATION_STATE',
]);

export type NavigationStateType = Array<string | Object>;

const initialState: NavigationStateType = [];

export default function navigationReducer(
  state: NavigationStateType = initialState,
  { type, payload }: ActionType,
) {
  switch (type) {
    case actionTypes.SET_NAVIGATION_STATE: {
      return payload;
    }

    case actionTypes.RESET_NAVIGATION_STATE:
    case sessionActions.SIGN_OUT:
      return initialState;

    default:
      return state;
  }
}

export function setNavigationState(
  payload: Array<string | Object>,
): ActionType {
  return {
    type: actionTypes.SET_NAVIGATION_STATE,
    payload,
  };
}

export function resetNavigationState(): ActionType {
  return {
    type: actionTypes.RESET_NAVIGATION_STATE,
  };
}
