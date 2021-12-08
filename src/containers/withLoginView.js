// @flow
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setNavigationState } from '../redux/modules/navigation';
import { sessionLoggedInSelector } from '../redux/selectors/session';
import { RouteNames } from '../navigation/Navigator';

const withLoginView =
  (Component: React$ComponentType<Object>) =>
  (props: Object): React$Node => {
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(sessionLoggedInSelector);

    const navigation = useNavigation();

    const onContinueWithLogin = useCallback(
      (...params) =>
        () => {
          if (isLoggedIn) {
            navigation.navigate(...params);
          } else {
            dispatch(setNavigationState(params));

            navigation.navigate(RouteNames.login);
          }
        },
      [dispatch, isLoggedIn, navigation],
    );

    return <Component {...props} onContinueWithLogin={onContinueWithLogin} />;
  };

export default withLoginView;
