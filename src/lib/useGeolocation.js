// @flow
import { useCallback } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform , Permission} from 'react-native';
import axios from 'axios';
import apiClient from '../utils/apiClient';
import { useSelector } from 'react-redux';
import { appLanguageSelector } from '../redux/selectors/app';

type UseGeolocationType = () => {
  getCurrentPositionAsync: Function,
  hasLocationPermission: Function,
  requestLocationPermission: Function,
  getLocationsByGeocode: Function,
  getLocationPredictions: Function,
  getLocationByPlaceID: Function,
};

const useGeolocation: UseGeolocationType = () => {
  const appLanguage = useSelector(appLanguageSelector);

  const getCurrentPositionAsync = useCallback(
    () =>
      new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }),
    [],
  );

  const hasLocationPermission = useCallback(async () => {
    try {
      switch (Platform.OS) {
        case 'android': {
          if (Platform.Version < 23) {
            return true;
          } else {
            return await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
          }
        }
        case 'ios': {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          if(auth === "granted") {
            return true;
          }
        }

        default:
          return false; 
      }
    } catch (e) {
      return false;
    }
  }, []);

  const requestLocationPermission = useCallback(
    () =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            switch (Platform.OS) {
              case 'android': {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );

                resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
                break;
              }
              case 'ios': {
                const auth = await Geolocation.requestAuthorization('whenInUse');
                if(auth === "granted") {
                  resolve(true);
                }
              }
              default:
                reject();
            }
          } catch (e) {
            reject(e);
          }
        })();
      }),
    [],
  );

  const getLocationsByGeocode = useCallback(
    (latitude, longitude) =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const data = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  latlng: `${latitude},${longitude}`,
                  key: 'AIzaSyCJmZcE0owDtTblyxo57BgE4LOQ6dZwwCM',
                  result_type: 'locality|sublocality|postal_code|country',
                  language: { HINDI: 'hi', ENGLISH: 'en' }[appLanguage],
                },
              },
            );

            const {
              data: { results = [] },
            } = data;

            resolve(results);
          } catch (e) {
            reject(e);
          }
        })();
      }),
    [appLanguage],
  );

  const getLocationPredictions = useCallback(
    (query) =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const {
              data: { predictions = [] },
            } = await axios.get(
              'https://maps.googleapis.com/maps/api/place/autocomplete/json',
              {
                params: {
                  key: 'AIzaSyCJmZcE0owDtTblyxo57BgE4LOQ6dZwwCM',
                  input: query,
                  language: { HINDI: 'hi', ENGLISH: 'en' }[appLanguage],
                },
              },
            );

            resolve(predictions);
          } catch (e) {
            reject(e);
          }
        })();
      }),
    [appLanguage],
  );

  const extractAddressComponent = useCallback((addressComponents, type) => {
    try {
      const matches =
        addressComponents.filter(({ types = [] }) => types.includes(type)) ??
        [];

      if (matches.length) {
        const { long_name } = matches[0];

        return long_name;
      }
    } catch (e) {
      return '';
    }
  }, []);

  const getLocationByPlaceID = useCallback(
    (placeID) =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const { data } = await apiClient.get(
              'https://maps.googleapis.com/maps/api/place/details/json',
              {
                params: {
                  key: 'AIzaSyCJmZcE0owDtTblyxo57BgE4LOQ6dZwwCM',
                  place_id: placeID,
                  fields: 'address_component,name,geometry,formatted_address',
                  language: { HINDI: 'hi', ENGLISH: 'en' }[appLanguage],
                },
              },
            );

            const { status } = data;

            if (status === 'OK') {
              const {
                result: {
                  address_components = [],
                  geometry,
                  formatted_address = '',
                },
              } = data;

              const payload = {
                city: extractAddressComponent(address_components, 'locality'),
                coordinates: {
                  latitude: geometry?.location?.lat ?? 0,
                  longitude: geometry?.location?.lng ?? 0,
                },
                country: extractAddressComponent(address_components, 'country'),
                state: extractAddressComponent(
                  address_components,
                  'administrative_area_level_1',
                ),
                pin_code:
                  extractAddressComponent(address_components, 'postal_code') ??
                  '',
                locality:
                  [...Array(5).keys()]
                    .map((_, i) =>
                      extractAddressComponent(
                        address_components,
                        `sublocality_level_${i + 1}`,
                      ),
                    )
                    .find(Boolean) ??
                  extractAddressComponent(address_components, 'sublocality') ??
                  '',
                street_address: formatted_address,
              };

              resolve(payload);
            } else {
              reject(status);
            }
          } catch (e) {
            reject(e);
          }
        })();
      }),
    [appLanguage, extractAddressComponent],
  );

  return {
    getCurrentPositionAsync,
    hasLocationPermission,
    requestLocationPermission,
    getLocationsByGeocode,
    getLocationPredictions,
    getLocationByPlaceID,
  };
};

export default useGeolocation;
