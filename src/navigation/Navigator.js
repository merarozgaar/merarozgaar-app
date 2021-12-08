// @flow
import 'react-native-gesture-handler';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Surface, useTheme } from 'react-native-paper';
import withGeolocation from '../containers/withGeolocation';
import { sessionLoggedInSelector } from '../redux/selectors/session';
import { appViewSelector } from '../redux/selectors/app';
import { isProfileSetupSelector } from '../redux/selectors/profile';
import withNotification from '../containers/withNotification';
import SetupContainer from '../modules/setup';
import JobsContainer from '../modules/jobs';
import ProfileContainer from '../modules/profile';
import NotificationsContainer from '../modules/notifications';
import CoursesContainer from '../modules/courses';
import SettingsContainer from '../modules/settings';
import JobDetailsContainer from '../modules/job-details';
import LanguagesContainer from '../modules/languages';
import LoginContainer from '../modules/login';
import SignupContainer from '../modules/signup';
import EditProfileContainer from '../modules/edit-profile';
import EditJobContainer from '../modules/edit-job';
import CandidatesContainer from '../modules/employer-home';
import EmployeeDetailsContainer from '../modules/employee-details';
import LocationContainer from '../modules/location';
import ScheduleInterviewContainer from '../modules/schedule-interview';
import InterviewsContainer from '../modules/interviews';
import VideoCallContainer from '../modules/video-call';
import ViewCourseContainer from '../modules/view-course';
import SearchContainer from '../modules/search';
import OnboardingContainer from '../modules/onboarding';
import { signOut } from '../redux/modules/session';
import EmployeeView from './EmployeeView';

const PublicRoutes = {
  setup: 'Setup',
  home: 'Home',
  jobDetails: 'Job details',
  languages: 'Languages',
  login: 'Login',
  signup: 'Sign up',
};

const PrivateRoutes = {
  jobs: 'Jobs',
  profile: 'Profile',
  editProfile: 'Edit profile',
  notifications: 'Notifications',
  settings: 'Settings',
  courses: 'Courses',
  editJob: 'Edit job',
  employeeDetails: 'Employee details',
  location: 'Location',
  scheduleInterview: 'Schedule interview',
  onboarding: 'Onboarding',
  interviews: 'Interviews',
  videoCall: 'Video call',
  viewCourse: 'View course',
  search: 'Search',
  guest: 'Guest',
};

export const RouteNames = {
  ...PublicRoutes,
  ...PrivateRoutes,
};

const Stack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const Navigator = (): React$Node => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const appView = useSelector(appViewSelector);

  const isProfileSetup = useSelector(isProfileSetupSelector);

  const theme = useTheme();

  const timeout = useRef();

  const [splashScreen, setSplashScreen] = useState(true);

  useEffect(() => {
    // dispatch(resetAppView());
    dispatch(signOut());
  }, [dispatch]);

  const renderEmployeeView = useCallback(() => {}, []);

  const renderHomeView = useCallback(() => {
    switch (appView) {
      case 'EMPLOYER':
        return (
          <Stack.Screen
            name={RouteNames.home}
            component={CandidatesContainer}
          />
        );

      case 'EMPLOYEE':
        return <EmployeeView />;

      default:
        return null;
    }
  }, [appView]);

  const renderUnprotectedView = useCallback(
    () => (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={RouteNames.setup} component={SetupContainer} />
        <Stack.Screen
          name={RouteNames.languages}
          component={LanguagesContainer}
        />
        <Stack.Screen name={RouteNames.signup} component={SignupContainer} />
        <Stack.Screen name={RouteNames.login} component={LoginContainer} />
        <Stack.Screen name={RouteNames.home} component={renderHomeView} />
      </Stack.Navigator>
    ),
    [renderHomeView],
  );

  const renderAppView = useCallback(() => {
    const initialRouteName = isLoggedIn
      ? isProfileSetup
        ? RouteNames.home
        : RouteNames.editProfile
      : RouteNames.signup;

    switch (appView) {
      case 'EMPLOYEE': {
        return (
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Fragment>
                <Stack.Screen
                  name={RouteNames.home}
                  component={JobsContainer}
                />
                <Stack.Screen
                  name={RouteNames.profile}
                  component={ProfileContainer}
                />
                <Stack.Screen
                  name={RouteNames.editProfile}
                  component={EditProfileContainer}
                />
                <Stack.Screen
                  name={RouteNames.notifications}
                  component={NotificationsContainer}
                />
                <Stack.Screen
                  name={RouteNames.courses}
                  component={CoursesContainer}
                />
                <Stack.Screen
                  name={RouteNames.settings}
                  component={SettingsContainer}
                />
                <Stack.Screen
                  name={RouteNames.videoCall}
                  component={VideoCallContainer}
                />
                <Stack.Screen
                  name={RouteNames.interviews}
                  component={InterviewsContainer}
                />
                <Stack.Screen
                  name={RouteNames.viewCourse}
                  component={ViewCourseContainer}
                />
                <Stack.Screen
                  name={RouteNames.search}
                  component={SearchContainer}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Stack.Screen
                  name={RouteNames.signup}
                  component={SignupContainer}
                />
                <Stack.Screen
                  name={RouteNames.login}
                  component={LoginContainer}
                />
                <Stack.Screen
                  name={RouteNames.home}
                  component={JobsContainer}
                />
              </Fragment>
            )}
            <Stack.Screen
              name={RouteNames.languages}
              component={LanguagesContainer}
            />
            <Stack.Screen
              name={RouteNames.jobDetails}
              component={JobDetailsContainer}
            />
            <Stack.Screen
              name={RouteNames.location}
              component={LocationContainer}
            />
          </Stack.Navigator>
        );
      }

      case 'EMPLOYER': {
        return (
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Fragment>
                <Stack.Screen
                  name={RouteNames.home}
                  component={CandidatesContainer}
                />
                <Stack.Screen
                  name={RouteNames.profile}
                  component={ProfileContainer}
                />
                <Stack.Screen
                  name={RouteNames.editProfile}
                  component={EditProfileContainer}
                />
                <Stack.Screen
                  name={RouteNames.jobDetails}
                  component={JobDetailsContainer}
                />
                <Stack.Screen
                  name={RouteNames.editJob}
                  component={EditJobContainer}
                />
                <Stack.Screen
                  name={RouteNames.notifications}
                  component={NotificationsContainer}
                />
                <Stack.Screen
                  name={RouteNames.settings}
                  component={SettingsContainer}
                />
                <Stack.Screen
                  name={RouteNames.scheduleInterview}
                  component={ScheduleInterviewContainer}
                />
                <Stack.Screen
                  name={RouteNames.videoCall}
                  component={VideoCallContainer}
                />
                <Stack.Screen
                  name={RouteNames.interviews}
                  component={InterviewsContainer}
                />
                <Stack.Screen
                  name={RouteNames.search}
                  component={SearchContainer}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Stack.Screen
                  name={RouteNames.signup}
                  component={SignupContainer}
                />
                <Stack.Screen
                  name={RouteNames.login}
                  component={LoginContainer}
                />
                <Stack.Screen
                  name={RouteNames.home}
                  component={CandidatesContainer}
                />
              </Fragment>
            )}
            <Stack.Screen
              name={RouteNames.languages}
              component={LanguagesContainer}
            />
            <Stack.Screen
              name={RouteNames.employeeDetails}
              component={EmployeeDetailsContainer}
            />
            <Stack.Screen
              name={RouteNames.location}
              component={LocationContainer}
            />
          </Stack.Navigator>
        );
      }

      default:
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={RouteNames.setup} component={SetupContainer} />
            <Stack.Screen
              name={RouteNames.languages}
              component={LanguagesContainer}
            />
          </Stack.Navigator>
        );
    }
  }, [appView, isLoggedIn, isProfileSetup]);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setSplashScreen(false);
    }, 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  if (splashScreen) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'light-content'}
          backgroundColor="#075E54"
        />
        <Surface
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar.Image
            source={require('../assets/images/icon.png')}
            size={128}
            style={{
              backgroundColor: theme.colors.surface,
            }}
          />
        </Surface>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'light-content'}
        backgroundColor="#075E54"
      />
      <NavigationContainer onStateChange={console.log}>
        {isLoggedIn ? renderUnprotectedView() : renderUnprotectedView()}
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withGeolocation(withNotification(Navigator));
