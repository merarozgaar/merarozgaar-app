// @flow
import { createSelector } from 'reselect';
import isEmpty from 'lodash.isempty';
import type { StateType } from '../rootReducer';
import type { ProfileStateType } from '../modules/profile';

const stateSelector = (state: StateType): ProfileStateType => state.profile;

export const profileSelector = createSelector(
  stateSelector,
  ({ profile }): ProfileStateType => profile,
);

export const isProfileSetupSelector = createSelector(
  stateSelector,
  ({ profile }): ProfileStateType => !isEmpty(profile),
);
