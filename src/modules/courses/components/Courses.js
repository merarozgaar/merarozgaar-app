// @flow
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Paragraph,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import NoContent from '../../../components/NoContent';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  loading: boolean,
  courses: Array<Object>,
  fetch: Function,
};

const Courses = ({ courses, loading, fetch }: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content title={isHindi ? 'पाठ्यक्रम' : 'Courses'} />
      </Appbar>
      <FlatList
        data={courses}
        renderItem={({ item: { id, name, thumbnail_url }, index }) => (
          <Card>
            <Card.Content>
              <Subheading style={{ paddingBottom: 16, letterSpacing: 0 }}>
                {name}
              </Subheading>
              {/*<Paragraph>{body}</Paragraph>*/}
            </Card.Content>
            <Card.Cover source={{ uri: thumbnail_url }} />
            <Card.Actions>
              <Button
                onPress={navigate(RouteNames.viewCourse, {
                  id,
                  badge_id: index + 1,
                })}
                uppercase={false}
                labelStyle={{ letterSpacing: 0 }}>
                {isHindi ? 'पाठ्यक्रम देखें' : 'View course'}
              </Button>
            </Card.Actions>
          </Card>
        )}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetch} />
        }
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
  notificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
});

export default Courses;
