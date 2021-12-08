// @flow
import { createSelector } from 'reselect';
import type { StateType } from '../rootReducer';
import type { AppStateType } from '../modules/app';
import { getAppContent } from '../../utils/contentProviders';
import type { ContentType } from '../../utils/contentProviders';

const stateSelector: (StateType) => AppStateType = (state) => state.app;

export const appViewSelector = createSelector(
  stateSelector,
  ({ appView }: AppStateType) => appView,
);

export const isAppSetupSelector = createSelector(
  stateSelector,
  ({ appView }: AppStateType) => appView !== '',
);

export const appLanguageSelector = createSelector(
  stateSelector,
  ({ language }) => language,
);

export const appContentSelector: (StateType) => ContentType = createSelector(
  stateSelector,
  ({ language }) => {
    const translations = getAppContent();

    return translations[language];
  },
);

export const appNotificationCountSelector = createSelector(
  stateSelector,
  ({ notificationCount }) => notificationCount ?? 0,
);
