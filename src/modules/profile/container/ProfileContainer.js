// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Profile from '../components/Profile';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../../../redux/selectors/session';
import apiClient from '../../../utils/apiClient';
import { setProfile } from '../../../redux/modules/profile';
import { profileSelector } from '../../../redux/selectors/profile';
import { RouteNames } from '../../../navigation/Navigator';

const ProfileContainer = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const profile = useSelector(profileSelector);

  const isScreenFocused = useIsFocused();

  const [applications, setApplications] = useState([]);

  const [jobs, setJobs] = useState([]);

  const fetchProfile = useCallback(() => {
    (async () => {
      try {
        if (session.role === 'EMPLOYEE') {
          const { data } = await apiClient.get('/employee/profile');

          dispatch(setProfile(data));
        } else {
          const { data } = await apiClient.get('/employer/profile');

          dispatch(setProfile(data));
        }
      } catch (e) {}
    })();
  }, [dispatch, session.role]);

  const fetchApplications = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employee/applications');

        setApplications(data);
      } catch (e) {}
    })();
  }, []);

  const fetchJobs = useCallback(() => {
    (async () => {
      try {
        if (session.role === 'EMPLOYER') {
          const { data } = await apiClient.get('/employer/jobs');

          setJobs(data);
        }
      } catch (e) {}
    })();
  }, [session.role]);

  useEffect(() => {
    // const unsubscribe = navigation.addListener('tabPress', (e) => {
    //   if (isLoggedIn) {
    //     /* do nothing */
    //   } else {
    //     e.preventDefault();
    //
    //     navigation.navigate(RouteNames.login);
    //   }
    // });

    // return unsubscribe;

    if (isLoggedIn) {
      /* do nothing */
    } else {
      navigation.navigate(RouteNames.login);
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (isScreenFocused) {
      fetchApplications();
    }
  }, [fetchApplications, isScreenFocused]);

  useEffect(() => {
    if (isScreenFocused) {
      fetchJobs();
    }
  }, [fetchJobs, isScreenFocused]);

  return (
    <Profile
      session={session}
      profile={profile}
      applications={applications}
      jobs={jobs}
      fetchProfile={fetchProfile}
      fetchApplications={fetchApplications}
      fetchJobs={fetchJobs}
    />
  );
};

export default ProfileContainer;
