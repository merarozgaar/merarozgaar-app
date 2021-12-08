// @flow
import { createSelector } from 'reselect';
import isEmpty from 'lodash.isempty';
import type { StateType } from '../rootReducer';
import type { SessionStateType } from '../modules/session';

const stateSelector: (StateType) => SessionStateType = (state) => state.session;

export const sessionSelector: Function = createSelector(
  stateSelector,
  ({ session }: SessionStateType) => session,
);

export const sessionLoggedInSelector: Function = createSelector(
  stateSelector,
  ({ session }: SessionStateType) => !isEmpty(session),
);

export const sessionProfileSetupSelector: Function = createSelector(
  stateSelector,
  ({ session }: SessionStateType) =>
    isEmpty(session) ? false : session.profile_completed,
);
