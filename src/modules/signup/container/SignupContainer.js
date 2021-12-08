// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, Vibration } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Signup from '../components/Signup';
import apiClient from '../../../utils/apiClient';
import type { FormConfig } from '../../../lib/useForm';
import useForm from '../../../lib/useForm';
import { isValidMobileNumber, isValidOTP } from '../../../utils/validations';
import { getErrorMessage } from '../../../utils/contentProviders';
import { RouteNames } from '../../../navigation/Navigator';
import { signIn } from '../../../redux/modules/session';
import { isProfileSetupSelector } from '../../../redux/selectors/profile';
import { appViewSelector } from '../../../redux/selectors/app';
import useAppContent from '../../../lib/useAppContent';

const SignupContainer = () => {
  const dispatch = useDispatch();

  const isProfileSetup = useSelector(isProfileSetupSelector);

  const appView = useSelector(appViewSelector);

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const formConfig: FormConfig = {
    initialValues: {
      dial_code: '+91',
      mobile_number: '',
      name: '',
      otp: '',
      step: 1,
    },
    validations: ({ dial_code, step }) => ({
      mobile_number: {
        required: true,
        message: isHindi
          ? 'मोबाइल नंबर आवश्यक है।'
          : 'Mobile number is required.',
        rules: [
          {
            validator: (value) =>
              isValidMobileNumber(`${dial_code}${value}`.replace(/ /gi, '')),
            message: getErrorMessage('error', 'mobileNumber'),
          },
        ],
      },
      name: {
        required: true,
        message: isHindi ? 'नाम आवश्यक है।' : 'Name is required.',
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
        const { dial_code, mobile_number, name } = values;

        try {
          const {
            data: { is_existing_user },
          } = await apiClient.post('auth/check_existing_user', {
            dial_code,
            mobile_number,
          });

          if (is_existing_user) {
            Snackbar.show({
              text: 'You already have an account.',
              duration: Snackbar.LENGTH_LONG,
              action: {
                text: 'Login',
                textColor: Colors.green500,
                onPress: () => navigation.navigate(RouteNames.login),
              },
            });
          } else {
            await apiClient.post('/auth/signup', {
              name,
              mobile_number,
              dial_code,
              role: appView,
            });

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
          }
        } catch (e) {
          Vibration.vibrate();

          Snackbar.show({
            text: isHindi
              ? 'कुछ गलत हो गया। पुनः प्रयास करें।'
              : 'Something went wrong. Try again',
            duration: Snackbar.LENGTH_LONG,
          });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [appView, isHindi, navigation, setValues, validate, values]);

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

          dispatch(signIn(data));

          if (isProfileSetup) {
            navigation.navigate(RouteNames.home);
          } else {
            navigation.navigate(RouteNames.editProfile);
          }
        } catch (e) {
          Vibration.vibrate();

          if (e.response?.status === 401) {
            Snackbar.show({
              text: isHindi
                ? 'ओटीपी मेल नहीं खाता। कृपया सही ओटीपी दर्ज करें।'
                : 'OTP does not match. Please enter the correct OTP.',
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            Snackbar.show({
              text: isHindi
                ? 'कुछ गलत हो गया। पुनः प्रयास करें।'
                : 'Something went wrong. Try again.',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [dispatch, isHindi, isProfileSetup, navigation, validate, values]);

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
          text: isHindi
            ? `${dial_code}${mobile_number} पर 6 अंकों का ओटीपी भेजा गया है।`
            : `A 6 digit OTP is sent to ${dial_code}${mobile_number}.`,
          duration: Snackbar.LENGTH_LONG,
        });
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
  }, [isHindi, values]);

  return (
    <Signup
      {...formProps}
      loading={loading}
      onRequestOtp={onRequestOtp}
      onVerifyOtp={onVerifyOtp}
      onResendOTP={onResendOTP}
    />
  );
};

export default SignupContainer;
