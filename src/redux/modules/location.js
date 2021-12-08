// @flow
import actionTypeCreator from '../../utils/actionTypeCreator';
import type { ActionType } from '../types';

const actionTypes: { SET_LOCATION: string, RESET_LOCATION: string } =
  actionTypeCreator('location', ['SET_LOCATION', 'RESET_LOCATION']);

export type LocationStateType = Object;

const initialState: LocationStateType = {};

export default function locationReducer(
  state: LocationStateType = initialState,
  { type, payload }: ActionType,
) {
  switch (type) {
    case actionTypes.SET_LOCATION:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.RESET_LOCATION:
      return initialState;

    default:
      return state;
  }
}

export function setLocation(payload: Object): ActionType {
  return {
    type: actionTypes.SET_LOCATION,
    payload,
  };
}

export function resetLocation(): ActionType {
  return {
    type: actionTypes.RESET_LOCATION,
  };
}
