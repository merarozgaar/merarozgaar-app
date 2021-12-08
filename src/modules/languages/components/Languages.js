// @flow
import React, { useCallback, useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { Appbar, List, Paragraph, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  language: string,
  switchLanguage: Function,
};

const Languages = ({ language, switchLanguage }: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent } = useAppContent();

  const options = useMemo(
    () => [
      {
        label: 'हिंदी',
        value: 'HINDI',
      },
      {
        label: 'English',
        value: 'ENGLISH',
      },
    ],
    [],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({ item: { label, value }, index }) => (
      <List.Item
        title={
          <Paragraph
            style={{
              color:
                value === language
                  ? theme.colors.primary
                  : theme.colors.placeholder,
            }}>
            {label}
          </Paragraph>
        }
        right={(props) =>
          value === language ? (
            <List.Icon {...props} color={theme.colors.primary} icon="check" />
          ) : null
        }
        onPress={switchLanguage(value)}
        style={{ justifyContent: 'center', height: 48 }}
      />
    ),
    [language, switchLanguage, theme.colors.placeholder, theme.colors.primary],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content title={appContent.languages.title} />
      </Appbar>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={50}
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

export default Languages;
