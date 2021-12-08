// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Vibration } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import allSettled from 'promise.allsettled';
import isEmpty from 'lodash.isempty';
import validator from 'validator/es';
import EditJob from '../components/EditJob';
import type { FormConfig } from '../../../lib/useForm';
import useForm from '../../../lib/useForm';
import apiClient from '../../../utils/apiClient';
import useGeolocation from '../../../lib/useGeolocation';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { appLanguageSelector } from '../../../redux/selectors/app';

const EditJobContainer = () => {
  const appLanguage = useSelector(appLanguageSelector);

  const navigation = useNavigation();

  const { params } = useRoute();

  const { item } = params;

  const { getLocationByPlaceID } = useGeolocation();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const [jobTypes, setJobTypes] = useState([]);

  const [professions, setProfessions] = useState([]);

  const [salaryFrequencies, setSalaryFrequencies] = useState([]);

  const [qualifications, setQualifications] = useState([]);

  const [skills, setSkills] = useState([]);

  const [jobLocation, setJobLocation] = useState({});

  const formConfig: FormConfig = {
    initialValues: item?.id
      ? {
          profession_id: item?.profession_id,
          vacancies: item?.vacancies?.toString(),
          gender: item?.gender,
          min_experience: item?.min_experience?.toString(),
          salary: item?.salary?.toString(),
          salary_frequency: item?.salary_frequency,
          benefits: item?.benefits,
          start_day: item?.working_days?.split(' to ')[0].replace(' ', ''),
          end_day: item?.working_days?.split(' to ')[1].replace(' ', ''),
          start_time: item?.timings?.slice(0, 5)?.trim(),
          start_time_meridian: item?.timings?.slice(6, 8)?.trim() ?? 'AM',
          end_time: item?.timings?.slice(11, 16)?.trim(),
          end_time_meridian: item?.timings?.slice(17, 20)?.trim() ?? 'AM',
          address: {
            address_id: item?.address_id,
            city: item?.city,
            coordinates: {
              latitude: item?.geo_code?.y,
              longitude: item?.geo_code?.x,
            },
            country: item?.country,
            state: item?.state,
            pin_code: item?.pin_code,
            locality: item?.locality,
            street_address: item?.street_address,
          },
        }
      : {
          address: {},
          benefits: '',
          description: '',
          education_id: '',
          gender: '',
          location_type: '',
          min_age: '',
          min_experience: '',
          profession_id: '',
          salary: '',
          salary_frequency: '',
          title: '',
          type_id: '',
          vacancies: '',
          start_time_meridian: 'AM',
          end_time_meridian: 'PM',
        },
    validations: ({ start_time_meridian, end_time_meridian }) => ({
      profession_id: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      vacancies: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      gender: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      salary: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
        rules: [
          {
            validator: (value) => (value < 0 ? false : true),
            message: isHindi
              ? 'यह एक अमान्य मान है।'
              : 'This is an invalid value.',
          },
        ],
      },
      salary_frequency: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      start_day: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      end_day: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
      },
      start_time: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
        rules: [
          {
            validator: (value) => {
              console.log(value, start_time_meridian);

              return new RegExp(
                /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/,
                'igm',
              ).test(`${value} ${start_time_meridian}`);
            },
            message: isHindi
              ? 'यह एक अमान्य मान है।'
              : 'This is an invalid value.',
          },
        ],
      },
      end_time: {
        required: true,
        message: isHindi ? 'यह इनपुट आवश्यक है।' : 'This input is required.',
        rules: [
          {
            validator: (value) => {
              console.log(`${value}$ {end_time_meridian}`);

              return new RegExp(
                /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/,
                'igm',
              ).test(`${value} ${end_time_meridian}`);
            },
            message: isHindi
              ? 'यह एक अमान्य मान है।'
              : 'This is an invalid value.',
          },
        ],
      },
      address: {
        rules: [
          {
            validator: (value) => (isEmpty(value) ? false : true),
            message: isHindi
              ? 'यह इनपुट आवश्यक है।'
              : 'This input is required.',
          },
        ],
      },
    }),
    onSubmit: (values) => {
      (async () => {
        setLoading(true);

        try {
          const {
            address,
            start_day,
            end_day,
            start_time,
            end_time,
            start_time_meridian,
            end_time_meridian,
          } = values;

          const payload = {
            ...values,
            address,
          };

          const { place_id } = address;

          if (start_time !== '' && end_time) {
            payload.timings = `${start_time} ${start_time_meridian} - ${end_time} ${end_time_meridian}`;
          } else {
            payload.timings = '';
          }

          if (start_day !== '' && end_day !== '') {
            payload.working_days = `${start_day} to ${end_day}`;
          } else {
            payload.working_days = '';
          }

          if (!isEmpty(item)) {
            if (place_id) {
              const newAddress = await getLocationByPlaceID(place_id);

              payload.address = {
                ...newAddress,
                address_id: item.address_id,
              };
            }

            payload.id = item.id;

            await apiClient.put(`/jobs/${item.id}`, payload);

            navigation.goBack();
          } else {
            payload.address = await getLocationByPlaceID(place_id);

            console.log({ values });

            console.log({ payload });

            await apiClient.post('/jobs', payload);

            Alert.alert(
              isHindi ? 'धन्यवाद' : 'Thank you',
              isHindi
                ? 'आपकी नौकरी की पोस्टिंग शीघ्र ही लाइव हो।'
                : 'Your job posting be live shortly.',
              [
                {
                  text: isHindi ? 'ठीक है' : 'Ok',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            );
          }
        } catch (e) {
          console.log(e);

          Vibration.vibrate();

          Snackbar.show({
            text: 'Something went wrong, try after sometime.',
            duration: Snackbar.LENGTH_LONG,
          });
        } finally {
          setLoading(false);
        }
      })();
    },
  };

  const formProps = useForm(formConfig);

  const { onChange } = formProps;

  useEffect(() => {
    (async () => {
      try {
        const options = [
          {
            endpoint: '/options/job_types',
            setter: setJobTypes,
          },
          {
            endpoint: '/options/professions',
            setter: setProfessions,
          },
          {
            endpoint: '/options/qualifications',
            setter: setQualifications,
          },
          {
            endpoint: '/options/salary_frequencies',
            setter: setSalaryFrequencies,
          },
          {
            endpoint: '/options/skills',
            setter: setSkills,
          },
        ];

        const promises = options.map(
          ({ endpoint, setter }) =>
            new Promise((resolve, reject) => {
              (async () => {
                try {
                  const { data } = await apiClient.get(endpoint, {
                    params: {
                      lang: appLanguage,
                    },
                  });

                  setter(data);

                  resolve();
                } catch (e) {
                  reject();
                }
              })();
            }),
        );

        await allSettled(promises);
      } catch (e) {}
    })();
  }, [appLanguage]);

  useEffect(() => {
    if (params?.locationObj?.place_id) {
      (async () => {
        try {
          // setJobLocation(params.locationObj);
          onChange('address', params.locationObj);
        } catch (e) {}
      })();
    }

    // eslint-disable-next-line
  }, [params]);

  return (
    <EditJob
      editing={item?.id}
      loading={loading}
      jobTypes={jobTypes}
      professions={professions}
      qualifications={qualifications}
      salaryFrequencies={salaryFrequencies}
      skills={skills}
      formProps={formProps}
      jobLocation={jobLocation}
    />
  );
};

export default EditJobContainer;
