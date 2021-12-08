// @flow
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Setup from '../components/Setup';
import { setAppView } from '../../../redux/modules/app';
import { RouteNames } from '../../../navigation/Navigator';

const SetupContainer = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const onContinue = useCallback(
    (view) => () => {
      dispatch(setAppView(view));

      navigation.navigate(RouteNames.signup);
    },
    [dispatch, navigation],
  );

  return <Setup onContinue={onContinue} />;
};

export default SetupContainer;
