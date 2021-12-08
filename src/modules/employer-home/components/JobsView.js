// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import {
  Caption,
  Card,
  Chip,
  FAB,
  List,
  Paragraph,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import NoContent from '../../../components/NoContent';
import { timeFromNow } from '../../../utils/dayjs';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  jobs: Array<Object>,
  fetchJobs: Function,
};

const JobsView = ({ jobs, fetchJobs }: PropTypes): React$Node => {
  const theme = useTheme();

  console.log(jobs);

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item: { active, id, profession, company, created_at } }) => (
      <Card onPress={navigate(RouteNames.jobDetails, { id })}>
        <Card.Content>
          <List.Item
            title={
              <Subheading style={{ letterSpacing: 0 }}>{profession}</Subheading>
            }
            titleNumberOfLines={2}
            description={
              <Paragraph style={{ color: theme.colors.placeholder }}>
                {company}
                {'\n'}
                {isHindi ? (
                  <Caption style={{ letterSpacing: 0 }}>
                    {timeFromNow(created_at)} पोस्ट किया गया
                  </Caption>
                ) : (
                  <Caption style={{ letterSpacing: 0 }}>
                    Posted {timeFromNow(created_at)}
                  </Caption>
                )}
              </Paragraph>
            }
            descriptionNumberOfLines={10}
            right={(props) => (
              <View {...props} style={{ marginTop: 8 }}>
                <Chip
                  mode="outlined"
                  textStyle={{
                    ...(active ? { color: theme.colors.primary } : {}),
                  }}>
                  {active ? 'Active' : 'Inactive'}
                </Chip>
              </View>
            )}
            style={{
              padding: 0,
            }}
          />
        </Card.Content>
      </Card>
    ),
    [navigate, theme.colors.placeholder, theme.colors.primary],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.container}>
        <NoContent
          icon="file-outline"
          message="Your job postings will appear here."
        />
        <FAB
          icon="magnify"
          label="Browse candidates"
          style={{ backgroundColor: theme.colors.primary, elevation: 0 }}
          uppercase={false}
          onPress={navigate(RouteNames.home)}
        />
        <View style={styles.separator} />
      </View>
    ),
    [navigate, theme.colors.primary],
  );

  return (
    <Fragment>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          { paddingHorizontal: 16 },
          jobs.length === 0 ? { flex: 1 } : {},
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        // ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchJobs} />
        }
      />
      {/*<View style={styles.fabContainer}>*/}
      {/*  <FAB*/}
      {/*    icon="plus"*/}
      {/*    label="Post a job"*/}
      {/*    onPress={navigate(RouteNames.editJob)}*/}
      {/*    style={{*/}
      {/*      backgroundColor: theme.colors.primary,*/}
      {/*    }}*/}
      {/*    uppercase={false}*/}
      {/*  />*/}
      {/*</View>*/}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
  listItemContainer: {
    elevation: 0,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default JobsView;
