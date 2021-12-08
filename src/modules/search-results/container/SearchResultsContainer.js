// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SearchResults from '../components/SearchResults';
import { sessionSelector } from '../../../redux/selectors/session';
import apiClient from '../../../utils/apiClient';
import { RouteNames } from '../../../Navigator-v2';
import Snackbar from 'react-native-snackbar';
import { appLanguageSelector } from '../../../redux/selectors/app';
import {
  isSetLocationStateSelector,
  locationStateSelector,
} from '../../../redux/selectors/location';
import useGeolocation from '../../../lib/useGeolocation';

const SearchResultsContainer = () => {
  const { params } = useRoute();

  const session = useSelector(sessionSelector);

  const appLanguage = useSelector(appLanguageSelector);

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const { getLocationByPlaceID } = useGeolocation();

  const { results = [], profession_id } = params;

  const [data, setData] = useState(results);

  const fetch = useCallback(() => {
    (async () => {
      try {
        if (isSetLocation) {
          const { place_id } = location;

          const place = await getLocationByPlaceID(place_id);

          const {
            coordinates: { latitude, longitude },
          } = place;

          const { data: d } = await apiClient.get('/jobs', {
            params: {
              latitude,
              longitude,
            },
          });

          setData(d.filter(({ profession_id: p }) => p === profession_id));
        } else {
          Snackbar.show({
            text: isHindi
              ? 'कृपया खोज परिणाम प्राप्त करने के लिए स्थान अनुमति सक्षम करें।'
              : 'Please enable location permission to get search results.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      } catch (e) {}
    })();
  }, [getLocationByPlaceID, isHindi, isSetLocation, location, profession_id]);

  useEffect(() => {
    if (profession_id) {
      fetch();
    }
  }, [fetch, profession_id]);

  return <SearchResults results={data} session={session} />;
};

export default SearchResultsContainer;
