// @flow
import axios from 'axios';

export const getGeocode = (latitude: number, longitude: number): Promise<any> =>
  new Promise<any>((resolve, reject) => {
    (async () => {
      try {
        const data = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              latlng: `${latitude},${longitude}`,
              key: 'AIzaSyByChJ6eImvdtgXwqatrQmOJGOMlG6xo8o',
              result_type: 'locality|sublocality|postal_code|country',
            },
          },
        );

        const {
          data: { results = [] },
        } = data;

        console.log(results);

        const {
          formatted_address: streetAddress,
          address_components: addressComponents,
        } = results.filter((a) => a.types.includes('street_address'))[0];

        const { long_code: city } = addressComponents.filter((a) =>
          a.types.includes('administrative_area_level_2'),
        )[0];

        const { long_code: state } = addressComponents.filter((a) =>
          a.types.includes('administrative_area_level_1'),
        )[0];

        const { long_code: zipCode } = addressComponents.filter((a) =>
          a.types.includes('postal_code'),
        )[0];

        const payload = { streetAddress, city, state, zipCode };

        console.log(payload);

        resolve(payload);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    })();
  });
