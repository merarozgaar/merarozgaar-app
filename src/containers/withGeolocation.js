// @flow
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import useGeolocation from '../lib/useGeolocation';
import { setLocation } from '../redux/modules/location';
import { locationStateSelector } from '../redux/selectors/location';

const withGeolocation =
  (WrappedComponent: React$ComponentType<any>): React$ComponentType<any> =>
  (props: any) => {
    const dispatch = useDispatch();

    const location = useSelector(locationStateSelector);

    const { requestLocationPermission, getLocationsByGeocode } =
      useGeolocation();

    const watchID = useRef();

    const watchPosition = useCallback(
      ({ coords: { latitude, longitude } }) => {
        (async () => {
          try {
            dispatch(setLocation({ latitude, longitude }));

            const results = await getLocationsByGeocode(latitude, longitude);

            if (results.length) {
              const {
                address_components,
                formatted_address: description,
                place_id,
              } = results[0];

              if (location?.place_id !== place_id) {
                dispatch(
                  setLocation({
                    formatted_address: description,
                    name: address_components?.[0]?.long_name ?? description,
                    place_id,
                  }),
                );
              }
            }
          } catch (e) {
            console.log(e);
          }
        })();
      },
      [dispatch, getLocationsByGeocode, location?.place_id],
    );

    useEffect(() => {
      (async () => {
        try {
          const granted = await requestLocationPermission();

          if (granted) {
            watchID.current = Geolocation.watchPosition(
              watchPosition,
              (e) => {
                console.log(e);
              },
              {
                enableHighAccuracy: true,
              },
            );
          }
        } catch (e) {
          /* do nothing */
          console.log(e);
        }
      })();

      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      return () => {
        if (watchID.current) {
          Geolocation.clearWatch(watchID.current);
        }
      };
    }, [watchID]);

    return <WrappedComponent {...props} />;
  };

export default withGeolocation;
