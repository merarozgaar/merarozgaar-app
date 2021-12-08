// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Search from '../components/Search';
import { sessionSelector } from '../../../redux/selectors/session';
import apiClient from '../../../utils/apiClient';
import { appLanguageSelector } from '../../../redux/selectors/app';
import {
  isSetLocationStateSelector,
  locationStateSelector,
} from '../../../redux/selectors/location';
import useGeolocation from '../../../lib/useGeolocation';
import { RouteNames } from '../../../Navigator-v2';

const SearchContainer = () => {
  const navigation = useNavigation();

  const session = useSelector(sessionSelector);

  const appLanguage = useSelector(appLanguageSelector);

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const { getLocationByPlaceID } = useGeolocation();

  const [professions, setProfessions] = useState([]);

  const onSelect = useCallback(
    ({ profession_id }) =>
      () => {
        (async () => {
          try {
            if (isSetLocation) {
              const { place_id } = location;

              const place = await getLocationByPlaceID(place_id);
              console.log(place);
              const {
                coordinates: { latitude, longitude },
              } = place;

              if (session.role === 'EMPLOYER') {
                const { data } = await apiClient.get('/candidates/search', {
                  params: {
                    latitude,
                    longitude,
                    profession_id,
                  },
                });

                navigation.navigate(RouteNames.searchResults, {
                  results: data,
                });
              } else {
                const { data } = await apiClient.get('/jobs', {
                  // params: {
                  //   latitude,
                  //   longitude,
                  // },
                });

                const results = data.filter(
                  ({ profession_id: p }) => p === profession_id,
                );

                console.log(results);

                navigation.navigate(RouteNames.searchResults, {
                  results,
                });
              }
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
      },
    [
      getLocationByPlaceID,
      isHindi,
      isSetLocation,
      location,
      navigation,
      session.role,
    ],
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/options/professions', {
          // params: {
          //   lang: appLanguage,
          // },
        });

        setProfessions(data);
      } catch (e) {}
    })();
  }, [appLanguage]);

  return (
    <Search
      session={session}
      query={''}
      data={[]}
      professions={professions}
      onChange={() => {}}
      onSelect={onSelect}
      onGetCurrentSearch={() => {}}
    />
  );
};

export default SearchContainer;
