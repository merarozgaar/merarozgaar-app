// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, Vibration } from 'react-native';
import { Colors } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../components/Login';
import apiClient from '../../../utils/apiClient';
import type { FormConfig } from '../../../lib/useForm';
import useForm from '../../../lib/useForm';
import { isValidMobileNumber, isValidOTP } from '../../../utils/validations';
import { getErrorMessage } from '../../../utils/contentProviders';
import { RouteNames } from '../../../navigation/Navigator';
import { signIn } from '../../../redux/modules/session';
import {
  isSetNavigationStateSelector,
  navigationStateSelector,
} from '../../../redux/selectors/navigation';
import { resetNavigationState } from '../../../redux/modules/navigation';
import { setProfile } from '../../../redux/modules/profile';
import { setAppView } from '../../../redux/modules/app';
import { isProfileSetupSelector } from '../../../redux/selectors/profile';
import useAppContent from '../../../lib/useAppContent';

const LoginContainer = () => {
  const dispatch = useDispatch();

  const isSetNavigationState = useSelector(isSetNavigationStateSelector);

  const navigationState = useSelector(navigationStateSelector);

  const isProfileSetup = useSelector(isProfileSetupSelector);

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const formConfig: FormConfig = {
    initialValues: {
      dial_code: '+91',
      mobile_number: '',
      otp: '',
      step: 1,
    },
    validations: ({ dial_code, step }) => ({
      mobile_number: {
        required: true,
        message: 'Mobile number is required.',
        rules: [
          {
            validator: (value) =>
              isValidMobileNumber(`${dial_code}${value}`.replace(/ /gi, '')),
            message: getErrorMessage('error', 'mobileNumber'),
          },
        ],
      },
      otp: {
        required: step === 2,
        message: 'OTP is required.',
        ...(step === 2
          ? {
              rules: [
                {
                  validator: isValidOTP,
                  message: getErrorMessage('error', 'otp'),
                },
              ],
            }
          : {}),
      },
    }),
    onSubmit: () => {},
  };

  const formProps = useForm(formConfig);

  const { setValues, validate, values } = formProps;

  const onRequestOtp = useCallback(() => {
    if (validate()) {
      Keyboard.dismiss();

      setLoading(true);

      (async () => {
        const { dial_code, mobile_number } = values;

        try {
          const {
            data: { is_existing_user },
          } = await apiClient.post('auth/check_existing_user', {
            dial_code,
            mobile_number,
          });

          if (is_existing_user) {
            await apiClient.post('auth/request_otp', {
              dial_code,
              mobile_number,
            });

            setValues({ ...values, step: 2 });

            Snackbar.show({
              text: isHindi
                ? `${dial_code}${mobile_number} पर 6 अंकों का ओटीपी भेजा गया है।`
                : `A 6 digit OTP is sent to ${dial_code}${mobile_number}.`,
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            Snackbar.show({
              text: 'You need to create an account.',
              duration: Snackbar.LENGTH_LONG,
              action: {
                text: 'Sign up',
                textColor: Colors.green500,
                onPress: () => navigation.navigate(RouteNames.signup),
              },
            });
          }
        } catch (e) {
          Vibration.vibrate();

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
  }, [navigation, setValues, validate, values]);

  const onVerifyOtp = useCallback(() => {
    if (validate()) {
      Keyboard.dismiss();

      setLoading(true);

      (async () => {
        try {
          const { dial_code, mobile_number, otp } = values;

          const { data } = await apiClient.post('auth/verify_otp', {
            dial_code,
            mobile_number,
            otp,
          });

          const { role, setup_step, token } = data;

          if (role === 'EMPLOYEE') {
            const { data: profile } = await apiClient.get('/employee/profile', {
              headers: {
                Authorization: token,
              },
            });

            dispatch(setProfile(profile));
          } else {
            const { data: profile } = await apiClient.get('/employer/profile', {
              headers: {
                Authorization: token,
              },
            });

            dispatch(setProfile(profile));
          }

          dispatch(setAppView(role));

          dispatch(signIn(data));

          if (isSetNavigationState) {
            navigation.navigate(...navigationState);

            dispatch(resetNavigationState());
          } else {
            // if (isProfileSetup) {
            //   navigation.navigate(RouteNames.home);
            // } else {
            //   navigation.navigate(RouteNames.editProfile);
            // }
          }
        } catch (e) {
          Vibration.vibrate();

          if (e.response?.status === 401) {
            Snackbar.show({
              text: 'OTP does not match. Please enter correct OTP.',
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            Snackbar.show({
              text: 'Something went wrong, try after sometime.',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [
    dispatch,
    isProfileSetup,
    isSetNavigationState,
    navigation,
    navigationState,
    validate,
    values,
  ]);

  const onResendOTP = useCallback(() => {
    Keyboard.dismiss();

    setLoading(true);

    (async () => {
      try {
        const { dial_code, mobile_number } = values;

        await apiClient.post('auth/request_otp', {
          dial_code,
          mobile_number,
        });

        Snackbar.show({
          text: `A 6 digit OTP is sent again to ${dial_code}${mobile_number}.`,
          duration: Snackbar.LENGTH_LONG,
        });
      } catch (e) {
        Vibration.vibrate();

        Snackbar.show({
          text: 'Something went wrong, try after sometime.',
          duration: Snackbar.LENGTH_LONG,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [values]);

  return (
    <Login
      {...formProps}
      loading={loading}
      onRequestOtp={onRequestOtp}
      onVerifyOtp={onVerifyOtp}
      onResendOTP={onResendOTP}
    />
  );
};

export default LoginContainer;
