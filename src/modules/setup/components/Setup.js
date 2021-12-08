// @flow
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Caption,
  FAB,
  Headline,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import OptionsView from './OptionsView';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  onContinue: Function,
};

const Setup = ({ onContinue }: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent } = useAppContent();

  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(() => {
    setVisible((state) => !state);
  }, []);

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ImageBackground
        source={require('../../../assets/images/banner.png')}
        style={styles.contentContainer}
        imageStyle={{
          alignSelf: 'flex-end',
          resizeMode: 'contain',
        }}>
        <View>
          <Appbar
            style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
            <Appbar.Action
              color={theme.colors.placeholder}
              icon="translate"
              onPress={navigate(RouteNames.languages)}
            />
          </Appbar>
          <View style={styles.headerContainer}>
            <Headline style={{ color: theme.colors.primary }}>
              {appContent.setup.intro}
            </Headline>
            <Subheading
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              {appContent.setup.tagline}
            </Subheading>
          </View>
        </View>
        <View style={styles.fabContainer}>
          <FAB
            label={appContent.setup.primaryCTA}
            style={{
              minWidth: Dimensions.get('window').width / 2,
              backgroundColor: theme.colors.primary,
              elevation: 0,
            }}
            uppercase={false}
            onPress={toggleVisible}
          />
          <Subheading
            style={{
              marginTop: 48,
              color: theme.colors.placeholder,
              letterSpacing: 0,
            }}>
            {appContent.setup.colophon}
          </Subheading>
          <Caption style={{ letterSpacing: 0 }}>
            {appContent.setup.madeInIndia}
          </Caption>
        </View>
      </ImageBackground>
      <OptionsView
        isVisible={visible}
        onDismiss={toggleVisible}
        onContinue={onContinue}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'flex-end',
    elevation: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 24,
  },
  headerContainer: {
    padding: 16,
  },
  fabContainer: {
    alignItems: 'center',
  },
});

export default Setup;
