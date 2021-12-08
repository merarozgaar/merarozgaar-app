// @flow
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../redux/selectors/session';
import { isProfileSetupSelector } from '../redux/selectors/profile';
import { RouteNames } from '../navigation/Navigator';
import apiClient from '../utils/apiClient';
import { setProfile } from '../redux/modules/profile';

const withAuth =
  (Component: React$ComponentType<Object>) =>
  (props: Object): React$Node => {
    const dispatch = useDispatch();

    const session = useSelector(sessionSelector);

    const isLoggedIn = useSelector(sessionLoggedInSelector);

    useEffect(() => {
      (async () => {
        try {
          if (session.role === 'EMPLOYEE') {
            const { data } = await apiClient.get('/employee/profile');

            dispatch(setProfile(data));
          } else {
            const { data } = await apiClient.get('/employer/profile');

            dispatch(setProfile(data));
          }
        } catch (e) {}
      })();
    }, [dispatch, isLoggedIn, session.role]);

    return <Component {...props} />;
  };

export default withAuth;
