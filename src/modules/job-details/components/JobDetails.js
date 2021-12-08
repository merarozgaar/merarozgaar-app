// @flow
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Caption,
  Chip,
  Colors,
  Divider,
  FAB,
  Headline,
  List,
  Menu,
  Paragraph,
  Surface,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import dayjs from 'dayjs';
import WithProgressBar from '../../../components/WithProgressBar';
import {
  formatCurrency,
  parseApplicationStatus,
  parseSalary,
  parseSalaryFrequency,
} from '../../../utils';
import { timeFromNow } from '../../../utils/dayjs';
import DetailsView from './DetailsView';
import ApplicationsView from './ApplicationsView';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  loading: boolean,
  job: Object,
  session: Object,
  visible: boolean,
  applying: boolean,
  applications: Array<Object>,
  isApplied: boolean,
  status: string,
  fetchApplications: Function,
  onApply: Function,
  onDismiss: Function,
  onConfirmApply: Function,
  onActivateDeactivateJob: Function,
  onWithdrawApplication: Function,
};

const JobDetails = ({
  loading,
  session,
  job,
  applications,
  visible,
  applying,
  isApplied,
  status,
  fetchApplications,
  onApply,
  onDismiss,
  onConfirmApply,
  onActivateDeactivateJob,
  onWithdrawApplication,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const { appLanguage } = useAppContent();

  const timestamp = useRef(Date.now());

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [index, setIndex] = useState(0);

  const [show, setShow] = useState(false);

  const [routes] = useState(() => [
    { key: 'overview', title: isHindi ? 'विवरण' : 'Overview' },
    { key: 'applications', title: isHindi ? 'आवेदन' : 'Applications' },
  ]);

  const toggleShow = useCallback(() => {
    setShow((state) => !state);
  }, []);

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

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case 'OPEN':
        case 'SHORTLISTED':
        case 'SCREENING':
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

  console.log(job);

  const renderHeader = useCallback(() => {
    switch (session.role) {
      case 'EMPLOYER':
        return (
          <Surface elevtion={4}>
            <List.Item
              title={<Headline>{job.profession}</Headline>}
              right={(props) => (
                <View {...props} style={{ marginTop: 8 }}>
                  <Chip
                    mode="outlined"
                    textStyle={{
                      ...(job.active ? { color: theme.colors.primary } : {}),
                    }}>
                    {job.active ? 'Active' : 'Inactive'}
                  </Chip>
                </View>
              )}
              style={{
                paddingRight: 16,
              }}
            />
          </Surface>
        );

      case 'EMPLOYEE':
      default:
        return (
          <Surface elevation={4}>
            <List.Item
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{
                    uri: `${job.avatar_url}?timestamp=${timestamp.current}`,
                  }}
                  style={{
                    ...props.style,
                    backgroundColor: theme.colors.surface,
                  }}
                />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={job.verified ? Colors.green500 : 'transparent'}
                  icon="check-decagram"
                />
              )}
              title={
                <Paragraph style={{ color: theme.colors.placeholder }}>
                  {job.employer_name}
                </Paragraph>
              }
              description={<Headline>{job.profession}</Headline>}
              descriptionNumberOfLines={2}
              style={styles.headerContainer}
            />
            <List.Item
              title={<Title>{formatCurrency(parseSalary(job.salary))}</Title>}
              description={`${
                isHindi ? 'वेतन' : 'Salary'
              } ${parseSalaryFrequency(job.salary_frequency, isHindi)}`}
              right={() => (
                <View>
                  {isApplied ? (
                    <Chip
                      style={getStatusBackgroundColor(status ?? 'Open')}
                      textStyle={getStatusColor(status ?? 'Open')}>
                      {parseApplicationStatus(status ?? 'Open')}
                    </Chip>
                  ) : (
                    <FAB
                      disabled={job.is_applied}
                      icon={job.is_applied ? 'check' : 'send'}
                      label={
                        isHindi
                          ? job.is_applied
                            ? 'आवेदन'
                            : 'आवेदन'
                          : job.is_applied
                          ? 'Applied'
                          : 'Apply'
                      }
                      style={{
                        backgroundColor: job.is_applied
                          ? theme.colors.disabled
                          : theme.colors.primary,
                        elevation: 0,
                      }}
                      uppercase={false}
                      onPress={onApply}
                    />
                  )}
                </View>
              )}
              style={[styles.headerContainer]}
            />
          </Surface>
        );
    }
  }, [
    getStatusBackgroundColor,
    getStatusColor,
    isApplied,
    isHindi,
    job.active,
    job.avatar_url,
    job.employer_name,
    job.is_applied,
    job.profession,
    job.salary,
    job.salary_frequency,
    job.verified,
    onApply,
    session.role,
    status,
    theme.colors.disabled,
    theme.colors.placeholder,
    theme.colors.primary,
    theme.colors.surface,
  ]);

  const renderTabBar = useCallback(
    (props) => (
      <Fragment>
        <TabBar
          {...props}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.placeholder}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          renderLabel={({ color, route }) => (
            <Paragraph style={{ color }}>{route.title}</Paragraph>
          )}
          style={{
            backgroundColor: theme.colors.surface,
          }}
        />
      </Fragment>
    ),
    [theme],
  );

  const renderDetailsView = useCallback(
    () => (
      <DetailsView
        loading={loading}
        job={job}
        visible={visible}
        onDismiss={onDismiss}
        applying={applying}
        session={session}
        onApply={onApply}
        onConfirmApply={onConfirmApply}
      />
    ),
    [
      applying,
      job,
      loading,
      onApply,
      onConfirmApply,
      onDismiss,
      session,
      visible,
    ],
  );

  const renderApplicationsView = useCallback(
    () => (
      <ApplicationsView
        applications={applications}
        fetchApplications={fetchApplications}
      />
    ),
    [applications, fetchApplications],
  );

  const renderTabView = useCallback(
    () => (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          overview: renderDetailsView,
          applications: renderApplicationsView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    ),
    [
      index,
      layout.width,
      renderApplicationsView,
      renderDetailsView,
      renderTabBar,
      routes,
    ],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface elevation={loading ? 0 : session.role === 'EMPLOYEE' ? 4 : 0}>
        <Appbar.Header
          style={[
            styles.appbar,
            {
              backgroundColor: loading
                ? theme.colors.surface
                : theme.colors.surface,
            },
          ]}>
          <Appbar.BackAction
            color={theme.colors.placeholder}
            onPress={goBack}
          />
          {session.role === 'EMPLOYER' ? (
            <Menu
              visible={show}
              onDismiss={toggleShow}
              anchor={
                <Appbar.Action
                  icon="dots-vertical"
                  color={theme.colors.placeholder}
                  onPress={toggleShow}
                />
              }>
              <Menu.Item
                // icon="alert-octagon-outline"
                title={
                  isHindi
                    ? `${
                        job.active
                          ? 'इस नौकरी को निष्क्रिय करें'
                          : 'इस नौकरी को सक्रिय करें'
                      }`
                    : `${job.active ? 'Deactivate' : 'Activate'} this job`
                }
                // titleStyle={{ marginLeft: -16 }}
                onPress={() => {
                  onActivateDeactivateJob();
                  toggleShow();
                }}
              />
            </Menu>
          ) : null}
        </Appbar.Header>
      </Surface>
      <WithProgressBar loading={loading}>
        {renderHeader()}
        {session.role === 'EMPLOYEE' ? renderDetailsView() : renderTabView()}
        {isApplied && ['OPEN', 'SHORTLISTED', 'CLOSED'].includes(status) && (
          <View style={[styles.fabContainer, { alignItems: 'flex-end' }]}>
            <FAB
              icon="minus-circle-outline"
              label={isHindi ? 'वापस ले' : 'Withdraw'}
              color={theme.colors.surface}
              onPress={onWithdrawApplication}
              style={{
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: Colors.red500 }),
              }}
              uppercase={false}
            />
          </View>
        )}
      </WithProgressBar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cardContainer: {
    // marginHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    height: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    padding: 16,
  },
});

export default JobDetails;
