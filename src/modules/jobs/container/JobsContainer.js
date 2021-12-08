// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import orderBy from 'lodash.orderby';
import Home from '../components/Jobs';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../../../redux/selectors/session';
import {
  isSetLocationStateSelector,
  locationStateSelector,
} from '../../../redux/selectors/location';
import apiClient from '../../../utils/apiClient';
import useGeolocation from '../../../lib/useGeolocation';
import Snackbar from 'react-native-snackbar';
import useAppContent from '../../../lib/useAppContent';
import { appNotificationCountSelector } from '../../../redux/selectors/app';

const JobsContainer = () => {
  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const notificationCount = useSelector(appNotificationCountSelector);

  const isScreenFocused = useIsFocused();

  const { getLocationByPlaceID, requestLocationPermission } = useGeolocation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [applications, setApplications] = useState([]);

  const [courses, setCourses] = useState([]);

  const [professions, setProfessions] = useState([]);

  const [interviews, setInterviews] = useState([]);

  const fetch = useCallback(() => {
    (async () => {
      setLoading(true);

      try {
        if (isSetLocation) {
          const { place_id } = location;

          const place = await getLocationByPlaceID(place_id);

          const {
            coordinates: { latitude, longitude },
          } = place;

          const { data } = await apiClient.get('/jobs', {
            params: {
              latitude,
              longitude,
            },
          });

          setJobs(orderBy(data, 'distance', 'asc'));
        } else {
          const granted = await requestLocationPermission();

          if (granted) {
            fetch();
          } else {
            Snackbar.show({
              text: isHindi
                ? 'कृपया नौकरी खोजने के लिए स्थान अनुमति सक्षम करें।'
                : 'Please enable location permission to find jobs.',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [
    getLocationByPlaceID,
    isHindi,
    isSetLocation,
    location,
    requestLocationPermission,
  ]);

  const fetchApplications = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employee/applications');

        setApplications(data);
      } catch (e) {}
    })();
  }, []);

  const fetchCourses = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/courses');

        setCourses(data);
      } catch (e) {}
    })();
  }, []);

  const fetchInterviews = useCallback(() => {
    (async () => {
      setLoading(true);

      try {
        const { data } = await apiClient.get('/interviews');

        setInterviews(data.filter(({ status }) => status === 'PENDING'));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();

      fetchApplications();

      fetchCourses();

      fetchInterviews();
    }
  }, [
    fetch,
    fetchApplications,
    fetchCourses,
    isScreenFocused,
    fetchInterviews,
  ]);

  useEffect(() => {
    if (isScreenFocused) {
      (async () => {
        try {
          const { data } = await apiClient.get('/options/professions', {
            params: {
              lang: appLanguage,
            },
          });

          setProfessions(data);
        } catch (e) {}
      })();
    }
  }, [appLanguage, fetch, isScreenFocused]);

  return (
    <Home
      isLoggedIn={isLoggedIn}
      session={session}
      location={location}
      loading={loading}
      jobs={jobs}
      applications={applications}
      professions={professions}
      interviews={interviews}
      courses={courses}
      notificationCount={notificationCount}
      fetch={fetch}
      fetchApplications={fetchApplications}
    />
  );
};

export default JobsContainer;
