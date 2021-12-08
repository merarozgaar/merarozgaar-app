// @flow
import React, { useCallback, useMemo, useState } from 'react';
import {
  Appbar,
  Caption,
  FAB,
  Paragraph,
  Subheading,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import type { FormProps } from '../../../lib/useForm';
import { TextInputMask } from 'react-native-masked-text';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  ...FormProps,
  loading: boolean,
};

const ScheduleInterview = ({
  values: { date, time },
  onChange,
  onSubmit,
  loading,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const openTimePicker = useCallback(() => {
    setShowTimePicker(true);
  }, []);

  const selectedDateOfBirth = useMemo(() => {
    if (date) {
      return new Date(date);
    }

    return new Date();
  }, [date]);

  const selectedTimings = useMemo(() => {
    if (date && time) {
      return new Date(`${date} ${time}`);
    }

    return new Date();
  }, [date, time]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChange = useCallback(
    (key) => (v) => {
      onChange(key, v);
    },
    [onChange],
  );

  const onDateChange = useCallback(
    (e, v) => {
      setShowDatePicker(false);

      if (e?.type !== 'dismissed') {
        onChange('date', dayjs(v).format('YYYY/MM/DD'));
      }
    },
    [onChange],
  );

  const onTimeChange = useCallback(
    (_, v) => {
      onChange('time', dayjs(v).format('HH:mm:ss'));

      setShowTimePicker(false);
    },
    [onChange],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content
          title={isHindi ? 'शेड्यूल इंटरव्यू' : 'Schedule interview'}
        />
      </Appbar>
      <Surface style={styles.contentContainer}>
        <Subheading style={{ letterSpacing: 0 }}>
          {isHindi
            ? 'हम आप उम्मीदवार के बीच साक्षात्कार के लिए 15 मिनट की वीडियो कॉल की व्यवस्था करेंगे। साक्षात्कार का विवरण एसएमएस (और ईमेल) पर साझा किया जाएगा।'
            : 'We will arrange a 15 min video call for the interview between you the candidate. Interview details will be shared over SMS (and email).'}
        </Subheading>
        <Paragraph style={{ marginTop: 16 }}>
          {isHindi
            ? 'कृपया निम्नलिखित विवरण दर्ज करें।'
            : 'Please enter the following details.'}
        </Paragraph>
        <View style={{ height: 8 }} />
        <TextInput
          mode="outlined"
          label={isHindi ? 'इंटरव्यू की तिथि' : 'Date of interview'}
          placeholder="YYYY/MM/DD"
          value={date}
          theme={{
            ...theme,
            colors: { ...theme.colors, background: theme.colors.surface },
          }}
          maxLength={10}
          render={(props) => (
            <TextInputMask
              {...props}
              options={{
                format: 'YYYY/MM/DD',
              }}
              type="datetime"
            />
          )}
          right={
            <TextInput.Icon
              color={theme.colors.placeholder}
              icon="calendar"
              forceTextInputFocus={false}
              onPress={openDatePicker}
            />
          }
          style={{ paddingHorizontal: 0 }}
        />
        <View style={{ height: 8 }} />
        <TextInput
          mode="outlined"
          label={isHindi ? 'समय' : 'Timings'}
          placeholder="hh:mm"
          value={time}
          theme={{
            ...theme,
            colors: { ...theme.colors, background: theme.colors.surface },
          }}
          maxLength={10}
          render={(props) => (
            <TextInputMask
              {...props}
              options={{
                format: 'hh:mm',
              }}
              type="datetime"
            />
          )}
          right={
            <TextInput.Icon
              color={theme.colors.placeholder}
              icon="clock-outline"
              forceTextInputFocus={false}
              onPress={openTimePicker}
            />
          }
          style={{ paddingHorizontal: 0 }}
        />
        <View style={{ paddingTop: 24 }}>
          <FAB
            label={isHindi ? 'आमंत्रण भेजें' : 'Send invite'}
            style={{
              ...(loading
                ? { backgroundColor: theme.colors.disabled }
                : { backgroundColor: theme.colors.primary }),
              elevation: 0,
            }}
            onPress={onSubmit}
            uppercase={false}
          />
        </View>
        <View style={{ paddingVertical: 16 }}>
          {isHindi ? (
            <Caption
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                आमंत्रण भेजें
              </Caption>{' '}
              पर क्लिक करके आप हमारे{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                नियमों और शर्तों
              </Caption>{' '}
              और{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                गोपनीयता नीति
              </Caption>{' '}
              से सहमत होते हैं।
            </Caption>
          ) : (
            <Caption
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              By clicking{' '}
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                Schedule
              </Caption>
              , you agree to our{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                Terms & Conditions
              </Caption>
              {'\n'}
              and{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                Privacy Policy
              </Caption>
              .
            </Caption>
          )}
        </View>
      </Surface>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={selectedDateOfBirth}
          onChange={onDateChange}
          minimumDate={dayjs().toDate()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          is24Hour={false}
          value={selectedTimings}
          onChange={onTimeChange}
          maximumDate={dayjs().subtract(18, 'years').toDate()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
    elevation: 0,
  },
  contentContainer: {
    padding: 16,
  },
});

export default ScheduleInterview;
