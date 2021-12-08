// @flow
import { createSelector } from 'reselect';
import isEmpty from 'lodash.isempty';
import type { StateType } from '../rootReducer';
import type { NavigationStateType } from '../modules/navigation';

const stateSelector: (StateType) => NavigationStateType = (state) =>
  state.navigation;

export const navigationStateSelector: Function = createSelector(
  stateSelector,
  (navigation: NavigationStateType) => navigation,
);

export const isSetNavigationStateSelector: Function = createSelector(
  stateSelector,
  (navigation: NavigationStateType) => !isEmpty(navigation),
);
