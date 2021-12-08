// @flow
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Languages from '../components/Languages';
import { appLanguageSelector } from '../../../redux/selectors/app';
import { setupAppLanguage } from '../../../redux/modules/app';
import { RouteNames } from '../../../navigation/Navigator';
import { sessionLoggedInSelector } from '../../../redux/selectors/session';

const LanguagesContainer = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const language = useSelector(appLanguageSelector);

  const navigation = useNavigation();

  const switchLanguage = useCallback(
    (option) => () => {
      dispatch(setupAppLanguage(option));

      if (navigation.canGoBack()) {
        if (isLoggedIn) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: RouteNames.home }],
            }),
          );
        } else {
          navigation.goBack();
        }
      }
    },
    [dispatch, navigation],
  );

  return <Languages language={language} switchLanguage={switchLanguage} />;
};

export default LanguagesContainer;
