// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Vibration } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import allSettled from 'promise.allsettled';
import isEmpty from 'lodash.isempty';
import validator from 'validator/es';
import EditProfile from '../components/EditProfile';
import type { FormConfig } from '../../../lib/useForm';
import apiClient from '../../../utils/apiClient';
import useForm from '../../../lib/useForm';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../../../redux/selectors/session';
import { setProfile } from '../../../redux/modules/profile';
import {
  isProfileSetupSelector,
  profileSelector,
} from '../../../redux/selectors/profile';
import { signIn, signOut } from '../../../redux/modules/session';
import { locationStateSelector } from '../../../redux/selectors/location';
import { RouteNames } from '../../../navigation/Navigator';
import useGeolocation from '../../../lib/useGeolocation';
import useAppContent from '../../../lib/useAppContent';

const EditProfileContainer = () => {
  const dispatch = useDispatch();

  const session = useSelector(sessionSelector);

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const profile = useSelector(profileSelector);

  const isProfileSetup = useSelector(isProfileSetupSelector);

  const location = useSelector(locationStateSelector);

  const navigation = useNavigation();

  const { params } = useRoute();

  const { getLocationByPlaceID } = useGeolocation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [companySizes, setCompanySizes] = useState([]);

  const [genders, setGenders] = useState([]);

  const [industries, setIndustries] = useState([]);

  const [professions, setProfessions] = useState([]);

  const [qualifications, setQualifications] = useState([]);

  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  // console.log(profile);

  const employeeFormConfig = {
    initialValues: isProfileSetup
      ? {
          id: profile?.id,
          avatar_data_uri: profile?.profile_picture_url,
          name: session.name,
          date_of_birth: profile?.date_of_birth,
          gender_id: profile?.gender_id,
          address: {
            address_id: profile?.address?.id,
            city: profile?.address?.city,
            coordinates: {
              latitude: profile?.address?.geo_code?.y,
              longitude: profile?.address?.geo_code?.x,
            },
            country: profile?.address?.country,
            state: profile?.address?.state,
            pin_code: profile?.address?.pin_code,
            locality: profile?.address?.locality,
            street_address: profile?.address?.street_address,
          },
          education_id: profile?.education_id,
          profile_video_data_uri: '',
          preferences: profile?.preferences,
          experiences: [],
          skills: (profile?.skills ?? []).map(({ skill_id }) => ({ skill_id })),
          languages: profile?.languages,
          reference: profile?.reference,
        }
      : {
          avatar_data_uri: '',
          name: session.name,
          date_of_birth: '',
          gender_id: '',
          address: {},
          education_id: '',
          profile_video_data_uri: '',
          preferences: [
            {
              industry_id: '',
              profession_id: '',
            },
          ],
          experiences: [],
          skills: [
            {
              skill_id: '',
            },
          ],
          languages: '',
          reference: '',
        },
    validations: ({ preferences }) => ({
      avatar_data_uri: {
        required: true,
        message: isHindi
          ? 'प्रोफ़ाइल चित्र आवश्यक है।'
          : 'Profile picture is required.',
      },
      name: {
        required: true,
        message: isHindi
          ? 'नियोक्ता का नाम आवश्यक है।'
          : 'Name of employer is required.',
      },
      date_of_birth: {
        required: true,
        message: isHindi ? 'जनम तिथि आवश्यक है।' : 'Date of birth is required.',
      },
      gender_id: {
        required: true,
        message: isHindi ? 'लिंग आवश्यक है।' : 'Gender is required.',
      },
      address: {
        rules: [
          {
            validator: (value) => (isEmpty(value) ? false : true),
            message: isHindi ? 'पता आवश्यक है।' : 'Address is required.',
          },
        ],
      },
      ...preferences.reduce(
        (a, _, i) => ({
          ...a,
          [`preferences[${i}].profession_id`]: {
            required: step === 2,
            message: isHindi ? 'पेशा आवश्यक है।' : 'Profession is required.',
          },
          [`preferences[${i}].industry_id`]: {
            required: step === 2,
            message: isHindi ? 'उद्योग आवश्यक है।' : 'Industry is required.',
          },
        }),
        {},
      ),
      education_id: {
        required: step === 2,
        message: isHindi ? 'शिक्षा आवश्यक है।' : 'Education is required.',
      },
    }),
    onSubmit: () => {},
  };

  const employerFormConfig = {
    initialValues: isProfileSetup
      ? {
          id: profile?.id,
          address: {
            address_id: profile?.address?.id,
            city: profile?.address?.city,
            coordinates: {
              latitude: profile?.address?.geo_code?.y,
              longitude: profile?.address?.geo_code?.x,
            },
            country: profile?.address?.country,
            state: profile?.address?.state,
            pin_code: profile?.address?.pin_code,
            locality: profile?.address?.locality,
            street_address: profile?.address?.street_address,
          },
          avatar_data_uri: profile?.profile_picture_url,
          company_size_id: profile?.company_size_id,
          email: profile?.email ?? '',
          industry_type_id: profile?.industry_type_id,
          name: session.name,
          overview: profile?.overview,
          website: profile?.website,
        }
      : {
          address: {},
          avatar_data_uri: '',
          company_size_id: '',
          email: '',
          industry_type_id: '',
          name: session.name,
          overview: '',
          website: '',
        },
    validations: {
      avatar_data_uri: {
        required: true,
        message: isHindi ? 'लोगो आवश्यक है।' : 'Logo is required.',
      },
      name: {
        required: true,
        message: isHindi
          ? 'नियोक्ता का नाम आवश्यक है।'
          : 'Name of employer is required.',
      },
      company_size_id: {
        required: true,
        message: isHindi
          ? 'कर्मचारियों की संख्या आवश्यक है।'
          : 'Company size is required.',
      },
      industry_type_id: {
        required: true,
        message: isHindi ? 'उद्योग आवश्यक है।' : 'Industry is required.',
      },
      address: {
        rules: [
          {
            validator: (value) => (isEmpty(value) ? false : true),
            message: isHindi ? 'पता आवश्यक है।' : 'Address is required.',
          },
        ],
      },
    },
    onSubmit: () => {},
  };

  const formConfig: FormConfig =
    session.role === 'EMPLOYEE' ? employeeFormConfig : employerFormConfig;

  const formProps = useForm(formConfig);

  const { onChange, validate, values } = formProps;

  // console.log(values);

  const goBack = useCallback(() => {
    setStep((state) => (state === 1 ? state : state - 1));
  }, []);

  const onSubmit = useCallback(() => {
    validate();

    if (validate()) {
      const condition = session.role === 'EMPLOYEE' ? step < 3 : false;

      if (condition) {
        setStep((state) => state + 1);
      } else {
        (async () => {
          setLoading(true);

          try {
            switch (session.role) {
              case 'EMPLOYEE': {
                const { id } = values;

                const { email, address, ...rest } = values;

                const payload = {
                  ...rest,
                  address,
                  ...(email ? { email } : {}),
                };

                const { place_id } = address;

                if (place_id) {
                  const currentAddress = await getLocationByPlaceID(place_id);

                  payload.address = {
                    ...currentAddress,
                    id: profile?.address?.id,
                  };
                }

                if (id) {
                  const { avatar_data_uri } = values;

                  if (validator.isDataURI(avatar_data_uri)) {
                    const {
                      data: { id },
                    } = await apiClient.post('/media', {
                      context: 'AVATAR',
                      data: avatar_data_uri,
                      file_name: 'avatar',
                    });

                    payload.avatar_id = id;
                  }

                  const { data } = await apiClient.put(
                    '/employee/profile',
                    payload,
                  );

                  dispatch(setProfile(data));

                  dispatch(signIn({ ...session, name: data.name }));

                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouteNames.home }],
                  });
                } else {
                  const { avatar_data_uri } = payload;

                  if (avatar_data_uri) {
                    const {
                      data: { id },
                    } = await apiClient.post('/media', {
                      context: 'AVATAR',
                      data: avatar_data_uri,
                      file_name: 'avatar',
                    });

                    payload.avatar_id = id;
                  }

                  const { data } = await apiClient.post(
                    '/employee/profile',
                    payload,
                  );

                  dispatch(setProfile(data));

                  dispatch(signIn({ ...session, name: data.name }));

                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouteNames.home }],
                  });
                }

                break;
              }

              case 'EMPLOYER': {
                const { id } = values;

                const {
                  address: { country, place_id, ...address },
                  website,
                  ...rest
                } = values;

                const payload = {
                  address,
                  ...rest,
                  ...(website ? { website } : {}),
                };

                if (place_id) {
                  const currentAddress = await getLocationByPlaceID(place_id);

                  payload.address = {
                    ...currentAddress,
                    id: profile?.address?.id,
                  };
                }

                if (id) {
                  const { website, avatar_data_uri, ...rest } = values;

                  if (validator.isDataURI(avatar_data_uri)) {
                    const {
                      data: { id },
                    } = await apiClient.post('/media', {
                      context: 'AVATAR',
                      data: avatar_data_uri,
                      file_name: 'avatar',
                    });

                    payload.avatar_id = id;
                  }

                  const { data } = await apiClient.put(
                    '/employer/profile',
                    payload,
                  );

                  dispatch(setProfile(data));

                  dispatch(signIn({ ...session, name: data.name }));

                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouteNames.home }],
                  });
                } else {
                  const { avatar_data_uri } = values;

                  if (avatar_data_uri) {
                    const {
                      data: { id },
                    } = await apiClient.post('/media', {
                      context: 'AVATAR',
                      data: avatar_data_uri,
                      file_name: 'avatar',
                    });

                    payload.avatar_id = id;
                  }

                  const { data } = await apiClient.post(
                    '/employer/profile',
                    payload,
                  );

                  dispatch(setProfile(data));

                  dispatch(signIn({ ...session, name: data.name }));

                  navigation.reset({
                    index: 0,
                    routes: [{ name: RouteNames.home }],
                  });
                }

                break;
              }

              default:
                break;
            }
          } catch (e) {
            Vibration.vibrate();

            console.log(e);

            Snackbar.show({
              text: isHindi
                ? 'कुछ गलत हो गया। पुनः प्रयास करें।'
                : 'Something went wrong. Try again.',
              duration: Snackbar.LENGTH_LONG,
            });
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [
    dispatch,
    getLocationByPlaceID,
    isHindi,
    location,
    navigation,
    profile?.address?.id,
    session,
    step,
    validate,
    values,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const options =
          session.role === 'EMPLOYEE'
            ? [
                {
                  endpoint: '/options/genders',
                  setter: setGenders,
                },
                {
                  endpoint: '/options/industries',
                  setter: setIndustries,
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
                  endpoint: '/options/skills',
                  setter: setSkills,
                },
              ]
            : [
                {
                  endpoint: '/options/company_sizes',
                  setter: setCompanySizes,
                },
                {
                  endpoint: '/options/industries',
                  setter: setIndustries,
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
  }, [appLanguage, session.role]);

  useEffect(() => {
    if (params?.locationObj?.place_id) {
      (async () => {
        try {
          onChange('address', params.locationObj);
        } catch (e) {}
      })();
    }
    // eslint-disable-next-line
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        const { place_id } = location;

        const currentAddress = await getLocationByPlaceID(place_id);

        onChange('address', { ...currentAddress, ...profile?.address });
      } catch (e) {}
    })();
    // eslint-disable-next-line
  }, [getLocationByPlaceID, location, profile]);

  return (
    <EditProfile
      isProfileSetup={isProfileSetup}
      loading={loading}
      session={session}
      location={location}
      companySizes={companySizes}
      genders={genders}
      industries={industries}
      professions={professions}
      qualifications={qualifications}
      skills={skills}
      step={step}
      formProps={formProps}
      onSubmit={onSubmit}
      setLoading={setLoading}
      goBack={goBack}
    />
  );
};

export default EditProfileContainer;
