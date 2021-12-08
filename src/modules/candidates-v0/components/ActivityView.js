// @flow
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import {
  Caption,
  Card,
  Chip,
  Colors,
  FAB,
  List,
  Paragraph,
  Subheading,
  Surface,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import NoContent from '../../../components/NoContent';
import { timeFromNow } from '../../../utils/dayjs';
import { parseApplicationStatus } from '../../../utils';
import OptionsView from '../../../components/OptionsView';

type PropTypes = {
  applications: Array<Object>,
  fetchApplications: Function,
};

const ActivityView = ({
  applications,
  fetchApplications,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const [filter, setFilter] = useState('');

  const statusOptions = useMemo(
    () => [
      {
        label: 'All',
        value: '',
      },
      {
        label: 'Closed',
        value: 'CLOSED',
      },
      {
        label: 'Hired',
        value: 'HIRED',
      },
      {
        label: 'Open',
        value: 'OPEN',
      },
      {
        label: 'Screening',
        value: 'SCREENING',
      },
      {
        label: 'Shortlisted',
        value: 'SHORTLISTED',
      },
    ],
    [],
  );

  const filteredApplications = useMemo(
    () =>
      filter === ''
        ? applications
        : applications.filter(({ status }) => status === filter),
    [applications, filter],
  );

  const toggleVisible = useCallback(() => {
    setVisible((state) => !state);
  }, []);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const onApplyFilter = useCallback((_, v) => {
    setFilter(v);
  }, []);

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case 'OPEN':
        case 'HIRED': {
          return { color: theme.colors.surface };
        }

        default:
          return { color: theme.colors.primary };
      }
    },
    [theme.colors.primary, theme.colors.surface],
  );

  const getStatusBackgroundColor = useCallback(
    (status) => {
      switch (status) {
        case 'HIRED': {
          return { backgroundColor: Colors.orange700 };
        }

        case 'OPEN': {
          return { backgroundColor: Colors.green500 };
        }

        default:
          return { backgroundColor: theme.colors.primary };
      }
    },
    [theme.colors.primary],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item: { job_id, title, company, created_at, status } }) => (
      <Card
        onPress={navigate(RouteNames.jobDetails, {
          id: job_id,
          isApplied: true,
          status,
        })}>
        <Card.Content>
          <Fragment>
            <List.Item
              title={
                <Subheading style={{ letterSpacing: 0 }}>{title}</Subheading>
              }
              titleNumberOfLines={2}
              description={
                <Paragraph style={{ color: theme.colors.placeholder }}>
                  {company}
                  {'\n'}
                  <Caption style={{ letterSpacing: 0 }}>
                    Applied {timeFromNow(created_at)}
                  </Caption>
                </Paragraph>
              }
              descriptionNumberOfLines={10}
              right={(props) => (
                <View {...props} style={{ marginTop: 8 }}>
                  <Chip
                    textStyle={getStatusColor(status)}
                    style={getStatusBackgroundColor(status)}>
                    {parseApplicationStatus(status)}
                  </Chip>
                </View>
              )}
              style={{
                padding: 0,
              }}
            />
          </Fragment>
        </Card.Content>
      </Card>
    ),
    [getStatusColor, navigate, theme.colors.placeholder],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.container}>
        <NoContent
          icon="magnify"
          message="Your job applications will appear here."
        />
        <FAB
          icon="magnify"
          label="Browse jobs"
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
        data={filteredApplications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          { paddingHorizontal: 16 },
          filteredApplications.length === 0 ? { flex: 1 } : {},
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        // ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchApplications} />
        }
      />
      {/*<View style={styles.fabContainer}>*/}
      {/*  <FAB*/}
      {/*    icon="filter"*/}
      {/*    onPress={toggleVisible}*/}
      {/*    style={{*/}
      {/*      backgroundColor: theme.colors.primary,*/}
      {/*    }}*/}
      {/*    uppercase={false}*/}
      {/*  />*/}
      {/*</View>*/}
      <OptionsView
        isVisible={visible}
        options={statusOptions}
        name="status"
        placeholder="Filter applications"
        value={filter}
        onChange={onApplyFilter}
        onDismiss={toggleVisible}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 128,
  },
  separator: {
    height: 16,
  },
  listItemContainer: {},
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default ActivityView;
