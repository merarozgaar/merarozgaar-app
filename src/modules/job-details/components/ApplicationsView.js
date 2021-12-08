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
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import NoContent from '../../../components/NoContent';
import { RouteNames } from '../../../navigation/Navigator';
import { timeFromNow } from '../../../utils/dayjs';
import { parseApplicationStatus } from '../../../utils';
import OptionsView from '../../../components/OptionsView';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  applications: Array<Object>,
  fetchApplications: Function,
};

const ApplicationsView = ({
  applications,
  fetchApplications,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [visible, setVisible] = useState(false);

  const [filter, setFilter] = useState('');

  const statusOptions = useMemo(
    () => [
      {
        label: isHindi ? 'सभी' : 'All',
        value: '',
      },
      {
        label: isHindi ? 'बंद' : 'Closed',
        value: 'CLOSED',
      },
      {
        label: isHindi ? 'काम पर रखा' : 'Hired',
        value: 'HIRED',
      },
      {
        label: isHindi ? 'खोलना' : 'Open',
        value: 'OPEN',
      },
      {
        label: isHindi ? 'स्क्रीनिंग' : 'Screening',
        value: 'SCREENING',
      },
      {
        label: isHindi ? 'शॉर्टलिस्टेड' : 'Shortlisted',
        value: 'SHORTLISTED',
      },
    ],
    [isHindi],
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

  const onApplyFilter = useCallback((_, v) => {
    setFilter(v);
  }, []);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case 'CLOSED': {
          return { color: Colors.red500 };
        }

        case 'SHORTLISTED': {
          return { color: Colors.green500 };
        }

        default:
          return { color: theme.colors.primary };
      }
    },
    [theme.colors.primary],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({ item: { applicant_id, id, name, created_at, status, verified } }) => (
      <Card
        onPress={navigate(RouteNames.employeeDetails, {
          id: applicant_id,
          applicationID: id,
          applicantView: true,
        })}>
        <Card.Content>
          <List.Item
            title={<Subheading style={{ letterSpacing: 0 }}>{name}</Subheading>}
            titleNumberOfLines={2}
            description={
              <Paragraph style={{ color: theme.colors.placeholder }}>
                {/*{verified ? 'Verified' : 'Not verified'}*/}
                {/*{'\n'}*/}
                {isHindi ? (
                  <Caption style={{ letterSpacing: 0 }}>
                    {timeFromNow(created_at)} सबमिट किया गया
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
                <Chip mode="outlined" textStyle={getStatusColor(status)}>
                  {parseApplicationStatus(status)}
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
    [getStatusColor, isHindi, navigate, theme.colors.placeholder],
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
          message="Job applications will appear here."
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

  console.log(filteredApplications);

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
        placeholder={isHindi ? 'फ़िल्टर ऍप्लिकेशन्स' : 'Filter applications'}
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

export default ApplicationsView;
