// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import Location from '../components/Location';
import { setLocation } from '../../../redux/modules/location';
import useGeolocation from '../../../lib/useGeolocation';
import { cos } from 'react-native-reanimated';

const LocationContainer = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { params } = useRoute();

  console.log({ name: 'LocationContainer', params });

  const {
    getCurrentPositionAsync,
    hasLocationPermission,
    requestLocationPermission,
    getLocationsByGeocode,
    getLocationPredictions,
  } = useGeolocation();

  const [query, setQuery] = useState('');

  const [data, setData] = useState([]);

  const onChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const onSelect = useCallback(
    (payload) => () => {
      if (params?.withCallback) {
        navigation.navigate({
          merge: true,
          name: params?.prevRoute,
          params: { locationObj: payload },
        });
      } else {
        dispatch(setLocation(payload));

        navigation.goBack();
      }
    },
    [dispatch, navigation, params?.prevRoute, params?.withCallback],
  );

  const onGetCurrentLocation = useCallback(() => {
    Keyboard.dismiss();

    (async () => {
      try {
        const granted = await hasLocationPermission();
        console.log(`--------->>>>>>:${granted}`);

        if (granted) {
          const position = await getCurrentPositionAsync();
          console.log(`--------->>>>>>:${JSON.stringify(position)}`);
          const {
            coords: { latitude, longitude },
          } = position;

          const results = await getLocationsByGeocode(latitude, longitude);

          setData(
            results.map(
              ({
                address_components,
                formatted_address: description,
                place_id,
              }) => ({
                description,
                place_id,
                structured_formatting: {
                  main_text: address_components?.[0]?.long_name ?? description,
                },
              }),
            ),
          );
        } else {
          await requestLocationPermission();
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    params,
    getCurrentPositionAsync,
    getLocationsByGeocode,
    hasLocationPermission,
    requestLocationPermission,
  ]);

  useEffect(() => {
    if (query.length >= 3) {
      debounce(async () => {
        try {
          const predictions = await getLocationPredictions(query);

          setData(predictions);
        } catch (e) {}
      }, 500)();
    } else if (query.length === 0) {
      setData([]);
    }
  }, [getLocationPredictions, query]);

  return (
    <Location
      query={query}
      data={data}
      onChange={onChange}
      onSelect={onSelect}
      onGetCurrentLocation={onGetCurrentLocation}
    />
  );
};

export default LocationContainer;
