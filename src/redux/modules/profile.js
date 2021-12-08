// @flow
import actionTypeCreator from '../../utils/actionTypeCreator';
import type { ActionType } from '../types';
import { actionTypes as sessionActions } from './session';

const actionTypes: {
  SET_PROFILE: string,
  RESET_PROFILE: string,
} = actionTypeCreator('profile', ['SET_PROFILE', 'RESET_PROFILE']);

export type ProfileStateType = {
  profile: Object,
};

const initialState: ProfileStateType = {
  profile: {},
};

export default function profileReducer(
  state: ProfileStateType = initialState,
  { type, payload }: ActionType,
) {
  switch (type) {
    case actionTypes.SET_PROFILE: {
      return {
        ...state,
        profile: payload,
      };
    }

    case actionTypes.RESET_PROFILE:
    case sessionActions.SIGN_OUT:
      return initialState;

    default:
      return state;
  }
}

export function setProfile(payload: Object): ActionType {
  return {
    type: actionTypes.SET_PROFILE,
    payload,
  };
}

export function resetProfile(): ActionType {
  return {
    type: actionTypes.RESET_PROFILE,
  };
}
