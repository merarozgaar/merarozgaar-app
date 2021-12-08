// @flow
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Colors,
  Divider,
  List,
  Paragraph,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import ProfileView from './ProfileView';
import ActivityView from './ActivityView';
import JobsView from './JobsView';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  session: Object,
  profile: Object,
  applications: Array<Object>,
  jobs: Array<Object>,
  fetchProfile: Function,
  fetchApplications: Function,
  fetchJobs: Function,
};

const Profile = ({
  session,
  profile,
  applications,
  jobs,
  fetchProfile,
  fetchApplications,
  fetchJobs,
}: PropTypes) => {
  const theme = useTheme();

  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const { appContent, appLanguage } = useAppContent();

  const timestamp = useRef(Date.now());

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [routes] = useState(() =>
    session.type === 'EMPLOYEE'
      ? isHindi
        ? [
            { key: 'profile', title: 'प्रोफ़ाइल' },
            { key: 'activities', title: 'नौकरी' },
          ]
        : [
            { key: 'profile', title: 'Profile' },
            { key: 'activities', title: 'Job Activity' },
          ]
      : isHindi
      ? [
          { key: 'profile', title: 'प्रोफ़ाइल' },
          { key: 'activities', title: 'नौकरी' },
        ]
      : [
          { key: 'profile', title: 'Profile' },
          { key: 'activities', title: 'Jobs' },
        ],
  );

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate(RouteNames.home);
  }, [navigation]);

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
            // elevation: 0,
          }}
        />
        {/*<Divider style={{ height: 1 }} />*/}
      </Fragment>
    ),
    [theme],
  );

  const renderProfileView = useCallback(
    () => (
      <ProfileView
        profile={profile}
        session={session}
        fetchProfile={fetchProfile}
      />
    ),
    [fetchProfile, profile, session],
  );

  const renderActivityView = useCallback(
    () =>
      session.role === 'EMPLOYEE' ? (
        <ActivityView
          applications={applications}
          fetchApplications={fetchApplications}
        />
      ) : (
        <JobsView jobs={jobs} fetchJobs={fetchJobs} />
      ),
    [applications, fetchApplications, fetchJobs, jobs, session.role],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Action
          color={theme.colors.placeholder}
          icon="cog-outline"
          onPress={navigate(RouteNames.settings)}
        />
      </Appbar>
      <List.Item
        left={(props) =>
          profile.profile_picture_url ? (
            <Avatar.Image
              {...props}
              source={{
                uri: `${profile.profile_picture_url}?timestamp=${timestamp.current}`,
              }}
              color={theme.colors.surface}
              style={{
                ...props.style,
                backgroundColor: theme.colors.placeholder,
              }}
            />
          ) : (
            <Avatar.Icon
              {...props}
              icon="account-outline"
              color={theme.colors.surface}
              style={{
                ...props.style,
                backgroundColor: theme.colors.placeholder,
              }}
            />
          )
        }
        right={(props) =>
          profile.profile_score >= 6 ? (
            <Avatar.Image
              {...props}
              size={48}
              style={{ ...props.style, backgroundColor: 'transparent' }}
              source={require('../../../assets/images/icons/reward.png')}
            />
          ) : null
        }
        title={<Title>{session.name}</Title>}
        description={`${session.dial_code}${session.mobile_number}`}
        style={[
          styles.headerContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      />
      <View style={styles.detailsContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            profile: renderProfileView,
            activities: renderActivityView,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
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
  headerContainer: {
    paddingLeft: 16,
  },
  detailsContainer: {
    flex: 1,
  },
});

export default Profile;
