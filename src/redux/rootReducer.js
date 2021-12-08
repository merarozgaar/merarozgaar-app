// @flow
import { combineReducers } from 'redux';
import app from './modules/app';
import type { AppStateType } from './modules/app';
import location from './modules/location';
import type { LocationStateType } from './modules/location';
import navigation from './modules/navigation';
import type { NavigationStateType } from './modules/navigation';
import profile from './modules/profile';
import type { ProfileStateType } from './modules/profile';
import session from './modules/session';
import type { SessionStateType } from './modules/session';

export type StateType = {
  app: AppStateType,
  location: LocationStateType,
  navigation: NavigationStateType,
  profile: ProfileStateType,
  session: SessionStateType,
};

const rootReducer = combineReducers({
  app,
  location,
  navigation,
  profile,
  session,
});

export default rootReducer;
