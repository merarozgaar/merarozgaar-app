// @flow
import React, { useCallback, useMemo } from 'react';
import {
  Linking,
  SafeAreaView,
  SectionList,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, List, Paragraph, Switch, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  onDeactivate: Function,
  onSwitchAccount: Function,
  onSignOut: Function,
};

const Settings = ({
  onDeactivate,
  onSwitchAccount,
  onSignOut,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const options = useMemo(
    () => [
      {
        data: [
          {
            title: 'भाषा बदलें / Change language',
            icon: 'translate',
            onPress: () => navigation.navigate(RouteNames.languages),
          },
        ],
      },
      {
        data: [
          {
            title: isHindi ? 'मित्रों को आमंत्रित करें' : 'Invite friends',
            icon: 'account-plus-outline',
            onPress: () =>
              Share.share({
                message: 'https://merarozgaar.app',
              }),
          },
        ],
      },
      {
        data: [
          {
            title: isHindi ? 'मेरा रोज़गार के बारे में' : 'About',
            icon: 'information-outline',
            onPress: () =>
              Linking.openURL(
                'https://docs.google.com/document/d/1VJLu-Wm3xau7RD8mherRta_0xA55jO4ExdF7T5Umv3g/edit?usp=sharing',
              ),
          },
          {
            title: isHindi ? 'पूछे जाने वाले प्रश्न' : 'FAQs',
            icon: 'comment-question-outline',
            onPress: () =>
              Linking.openURL(
                'https://drive.google.com/file/d/1X8JBf0d-NG5jG7w1akIck13-kk4SwykO/view?usp=sharing',
              ),
          },
          {
            title: isHindi ? 'हेल्प और फीडबैक' : 'Help & Feedback',
            icon: 'email-outline',
            onPress: () => Linking.openURL('mailto:contact@gicbol.com'),
          },
        ],
      },
      {
        data: [
          {
            title: isHindi ? 'अकाउंट डीएक्टिवेट' : 'Deactivate account',
            icon: 'delete-outline',
            onPress: onDeactivate,
          },
          {
            title: isHindi ? 'साईन आउट करें' : 'Sign Out',
            icon: 'exit-to-app',
            onPress: onSignOut,
          },
        ],
      },
    ],
    [isHindi, navigation, onDeactivate, onSignOut],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item: { title, icon, onPress = () => {} } }) => (
      <List.Item
        title={<Paragraph>{title}</Paragraph>}
        style={{ backgroundColor: theme.colors.surface }}
        left={(props) => <List.Icon {...props} icon={icon} />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={onPress}
      />
    ),
    [theme.colors.surface],
  );

  const renderSeparator = useCallback(
    () => (
      <View
        style={[styles.separator, { backgroundColor: theme.colors.background }]}
      />
    ),
    [theme.colors.background],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={isHindi ? 'सेटिंग्स' : 'Settings'} />
      </Appbar>
      <SectionList
        sections={options}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSeparator}
        initialNumToRender={25}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
    elevation: 0,
  },
  separator: {
    height: 8,
  },
});

export default Settings;
