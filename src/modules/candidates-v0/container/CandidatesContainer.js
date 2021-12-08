// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Home from '../components/Candidates';
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

const CandidatesContainer = () => {
  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const { getLocationByPlaceID } = useGeolocation();

  const isScreenFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState([]);

  const [jobs, setJobs] = useState([]);

  const [applications, setApplications] = useState([]);

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

          const { data } = await apiClient.get('/candidates', {
            params: {
              latitude,
              longitude,
            },
          });

          setCandidates(data);
        } else {
          Snackbar.show({
            text: 'Please enable location permission to find matching candidates.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [getLocationByPlaceID, isSetLocation, location]);

  const fetchApplications = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employer/applications');

        setApplications(data);
      } catch (e) {}
    })();
  }, []);

  const fetchJobs = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employer/jobs');

        setJobs(data);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();

      fetchApplications();

      fetchJobs();
    }
  }, [fetch, fetchApplications, fetchJobs, isScreenFocused]);

  return (
    <Home
      isLoggedIn={isLoggedIn}
      session={session}
      location={location}
      loading={loading}
      data={candidates}
      applications={applications}
      jobs={jobs}
      fetch={fetch}
    />
  );
};

export default CandidatesContainer;
