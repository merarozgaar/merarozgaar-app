// @flow
import { createSelector } from 'reselect';
import isEmpty from 'lodash.isempty';
import type { StateType } from '../rootReducer';
import type { LocationStateType } from '../modules/location';

const stateSelector: (StateType) => LocationStateType = (state) =>
  state.location;

export const locationStateSelector: Function = createSelector(
  stateSelector,
  (location: LocationStateType) => location,
);

export const isSetLocationStateSelector: Function = createSelector(
  stateSelector,
  (location: LocationStateType) => !isEmpty(location),
);
