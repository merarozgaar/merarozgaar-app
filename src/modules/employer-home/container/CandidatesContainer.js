// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import orderBy from 'lodash.orderby';
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
import useAppContent from '../../../lib/useAppContent';
import { RouteNames } from '../../../Navigator-v2';
import {
  appLanguageSelector,
  appNotificationCountSelector,
} from '../../../redux/selectors/app';

const CandidatesContainer = () => {
  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const notificationCount = useSelector(appNotificationCountSelector);

  const { getLocationByPlaceID } = useGeolocation();

  const isScreenFocused = useIsFocused();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState([]);

  const [jobs, setJobs] = useState([]);

  const [professions, setProfessions] = useState([]);

  const [professionID, setProfessionID] = useState(null);

  const search = useCallback(() => {
    (async () => {
      try {
        if (isSetLocation) {
          const { place_id } = location;

          const place = await getLocationByPlaceID(place_id);

          const {
            coordinates: { latitude, longitude },
          } = place;

          const { data } = await apiClient.get('/candidates/search', {
            params: {
              latitude,
              longitude,
              profession_id: professionID,
            },
          });

          setCandidates(orderBy(data, 'distance', 'asc'));
        } else {
          Snackbar.show({
            text: isHindi
              ? 'उम्मीदवारों को खोजने के लिए कृपया स्थान अनुमति सक्षम करें।'
              : 'Please enable location permission to find candidates.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } catch (e) {}
    })();
  }, [getLocationByPlaceID, isHindi, isSetLocation, location, professionID]);

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

          setCandidates(orderBy(data, 'distance', 'asc'));
        } else {
          Snackbar.show({
            text: isHindi
              ? 'उम्मीदवारों को खोजने के लिए कृपया स्थान अनुमति सक्षम करें।'
              : 'Please enable location permission to find candidates.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [getLocationByPlaceID, isHindi, isSetLocation, location]);

  const fetchJobs = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employer/jobs');

        setJobs(data.reverse());
      } catch (e) {}
    })();
  }, []);

  const fetchContent = useCallback(() => {
    fetch();

    fetchJobs();
  }, [fetch, fetchJobs]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();

      fetchJobs();

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
  }, [appLanguage, fetch, fetchJobs, isScreenFocused]);

  useEffect(() => {
    if (professionID) {
      search();
    } else {
      fetch();
    }
  }, [fetch, professionID, search]);

  return (
    <Home
      isLoggedIn={isLoggedIn}
      session={session}
      location={location}
      loading={loading}
      professionID={professionID}
      setProfessionID={setProfessionID}
      candidates={candidates}
      jobs={jobs}
      professions={professions}
      notificationCount={notificationCount}
      fetch={fetch}
      fetchContent={fetchContent}
    />
  );
};

export default CandidatesContainer;
