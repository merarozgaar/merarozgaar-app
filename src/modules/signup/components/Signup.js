// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  FAB,
  Headline,
  HelperText,
  Paragraph,
  Subheading,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import OTPTextView from 'react-native-otp-textinput';
import color from 'color';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import type { FormProps } from '../../../lib/useForm';
import { RouteNames } from '../../../navigation/Navigator';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  ...FormProps,
  loading: boolean,
  onRequestOtp: Function,
  onVerifyOtp: Function,
  onResendOTP: Function,
};

const Signup = ({
  values: { dial_code, mobile_number, name, otp, step },
  loading,
  getErrors,
  onChange,
  onRequestOtp,
  onVerifyOtp,
  onResendOTP,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [notAllowed, setNotAllowed] = useState(true);

  const [countdown, setCountdown] = useState(60);

  const interval = useRef();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const navigate = useCallback(
    (route, reset = false) =>
      () => {
        if (reset) {
          navigation.reset({
            index: 0,
            routes: [{ name: route }],
          });
        } else {
          navigation.navigate(route);
        }
      },
    [navigation],
  );

  const handleChange = useCallback(
    (key) => (value) => {
      onChange(key, value);
    },
    [onChange],
  );

  const renderErrorMessages = useCallback(
    (key) => (
      <React.Fragment>
        {getErrors(key).map(({ message }, i) => (
          <HelperText
            key={i}
            visible
            type="error"
            style={{ paddingHorizontal: 0 }}>
            {message}
          </HelperText>
        ))}
      </React.Fragment>
    ),
    [getErrors],
  );

  useEffect(() => {
    if (step === 2) {
      interval.current = setInterval(() => {
        if (countdown > 0) {
          setCountdown((state) => state - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [countdown, step]);

  useEffect(() => {
    if (countdown === 0 && notAllowed) {
      setNotAllowed(false);
    }
  }, [countdown, notAllowed]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        {navigation.canGoBack() ? (
          <Appbar.Action
            color={theme.colors.placeholder}
            icon="close"
            onPress={goBack}
          />
        ) : null}
      </Appbar>
      {step === 1 ? (
        <View style={styles.contentContainer}>
          <Headline style={{ color: theme.colors.primary }}>
            {appContent.signUp.heading}
          </Headline>
          <Paragraph>{appContent.signUp.subheading}</Paragraph>
          <View style={styles.separator} />
          <TextInput
            autoFocus
            value={name}
            onChangeText={handleChange('name')}
            mode="flat"
            placeholder={appContent.inputNames.name}
            numberOfLines={1}
            style={{ paddingHorizontal: 0 }}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: 'transparent' },
            }}
          />
          {renderErrorMessages('name')}
          <TextInput
            value={mobile_number}
            onChangeText={handleChange('mobile_number')}
            mode="flat"
            placeholder={appContent.inputNames.mobileNumber}
            keyboardType="number-pad"
            maxLength={10}
            numberOfLines={1}
            style={{ paddingHorizontal: 0 }}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: 'transparent' },
            }}
          />
          {renderErrorMessages('mobile_number')}
          <View style={styles.separator} />
          {appContent.signUp.disclaimer(theme)}
          <View style={styles.fabContainer}>
            <FAB
              loading={loading}
              disabled={loading}
              label={appContent.signUp.getStarted}
              style={{
                ...(loading
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
                elevation: 0,
              }}
              uppercase={false}
              onPress={onRequestOtp}
            />
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Headline style={{ color: theme.colors.primary }}>
            {isHindi
              ? 'अपना मोबाइल नंबर वेरीफाई करें'
              : 'Verify your mobile number'}
          </Headline>
          {isHindi ? (
            <Paragraph>
              6 अंकों का ओटीपी दर्ज करें जो {dial_code}
              {mobile_number} भेजा गया हैं
            </Paragraph>
          ) : (
            <Paragraph>
              Enter the 6 digit OTP sent to {dial_code}
              {mobile_number}.
            </Paragraph>
          )}
          <View style={styles.separator} />
          <OTPTextView
            defaultValue={otp}
            tintColor={theme.colors.primary}
            offTintColor={
              theme.dark
                ? color(theme.colors.background).lighten(0.24).rgb().string()
                : color(theme.colors.background).darken(0.06).rgb().string()
            }
            inputCount={6}
            handleTextChange={handleChange('otp')}
            textInputStyle={{ fontSize: 20, borderBottomWidth: 2 }}
            containerStyle={{ marginTop: 0, marginLeft: -5 }}
          />
          {renderErrorMessages('otp')}
          <View style={styles.fabContainer}>
            <FAB
              disabled={notAllowed || loading}
              label={`${isHindi ? 'ओटीपी फिर से भेजें' : 'Resend OTP'}${
                countdown
                  ? ` (${new Date(countdown * 1000)
                      .toISOString()
                      .substr(14, 5)})`
                  : ''
              }`}
              color={notAllowed ? theme.colors.disabled : theme.colors.primary}
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 0,
              }}
              uppercase={false}
              onPress={onResendOTP}
            />
            <View style={{ width: 16 }} />
            <FAB
              loading={loading}
              disabled={loading}
              label={isHindi ? 'ओटीपी वेरीफाई करें' : 'Verify OTP'}
              style={{
                ...(loading
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
                elevation: 0,
              }}
              uppercase={false}
              onPress={onVerifyOtp}
            />
          </View>
        </View>
      )}
      <View style={styles.footerContainer}>
        <Subheading
          style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
          {appContent.signUp.alreadyRegistered}
        </Subheading>
        <Button onPress={navigate(RouteNames.login)} uppercase={false}>
          <Title style={{ color: theme.colors.primary }}>
            {appContent.signUp.login}
          </Title>
        </Button>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Button
          contentStyle={{
            flexDirection: 'row-reverse',
          }}
          labelStyle={{ letterSpacing: 0 }}
          onPress={navigate(RouteNames.home, true)}
          uppercase={false}>
          {appContent.signUp.asGuest}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - getStatusBarHeight(),
  },
  appbar: {
    justifyContent: 'space-between',
    elevation: 0,
  },
  separator: {
    height: 16,
  },
  contentContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});

export default Signup;
