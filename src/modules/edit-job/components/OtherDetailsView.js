// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HelperText,
  Paragraph,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import OptionsView from '../../../components/OptionsView';
import type { FormProps } from '../../../lib/useForm';
import { TextInputMask } from 'react-native-masked-text';
import useAppContent from '../../../lib/useAppContent';
import SelectView from '../../../components/SelectView';

type PropTypes = {
  ...FormProps,
};

const OtherDetailsView = ({
  values: {
    benefits,
    end_time,
    start_time,
    start_time_meridian,
    end_time_meridian,
    start_day,
    end_day,
  },
  getErrors,
  onChange,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [showStartDayModal, seSetStartDayModal] = useState(false);

  const [showEndDayModal, seSetEndDayModal] = useState(false);

  const [startMeridian, setStartMeridian] = useState('AM');

  const [endMeridian, setEndMeridian] = useState('PM');

  const [showStartMeridian, setShowStartMeridian] = useState(false);

  const [showEndMeridian, setShowEndMeridian] = useState(false);

  const days = useMemo(
    () =>
      (isHindi
        ? [
            'सोमवार',
            'मंगलवार',
            'बुधवार',
            'गुरुवार',
            'शुक्रवार',
            'शनिवार',
            'रविवार',
          ]
        : [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ]
      ).map((v) => ({ value: v, label: v })),
    [isHindi],
  );

  const meridians = useMemo(
    () => ['AM', 'PM'].map((v) => ({ value: v, label: v })),
    [],
  );

  const toggleStartMeridian = useCallback(() => {
    setShowStartMeridian((state) => !state);
  }, []);

  const toggleEndMeridian = useCallback(() => {
    setShowEndMeridian((state) => !state);
  }, []);

  const toggleStartDayModal = useCallback(() => {
    seSetStartDayModal((state) => !state);
  }, []);

  const toggleEndDayModal = useCallback(() => {
    seSetEndDayModal((state) => !state);
  }, []);

  const handleChange = useCallback(
    (key) => (v) => {
      onChange(key, v);
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
    if (start_time) {
      setStartMeridian(start_time?.slice(6, 8));
    }
  }, [start_time]);

  useEffect(() => {
    if (end_time) {
      setEndMeridian(end_time?.slice(6, 8));
    }
  }, [end_time]);

  return (
    <Surface style={styles.container}>
      <TextInput
        mode="outlined"
        label={isHindi ? 'लाभ' : 'Benefits'}
        placeholder={
          isHindi
            ? 'उदाहरण के लिए, पीएफ, वर्क फ्रॉम होम, इंसेंटिव आदि (वैकल्पिक)'
            : 'For e.g., PF, Work from Home, incentives, etc. (Optional)'
        }
        value={benefits}
        multiline={true}
        numberOfLines={5}
        maxLength={500}
        onChangeText={handleChange('benefits')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      <View style={{ height: 16 }} />
      <Paragraph>{isHindi ? 'कार्य दिवस' : 'Working days'}</Paragraph>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <SelectView
            label={isHindi ? 'शुरू दिवस' : 'Start day'}
            value={start_day}
            name={'start_day'}
            options={days}
            onChange={onChange}
            containerStyle={{ flex: 1 }}
          />
          {renderErrorMessages('start_day')}
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <SelectView
            label={isHindi ? 'अंत दिवस' : 'End day'}
            value={end_day}
            name={'end_day'}
            options={days}
            onChange={onChange}
            containerStyle={{ flex: 1 }}
          />
          {renderErrorMessages('end_day')}
        </View>
      </View>
      <View style={{ height: 8 }} />
      <Paragraph>{isHindi ? 'टाइमिंग' : 'Timings'}</Paragraph>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'शुरू समय' : 'Start time'}
            placeholder="HH:MM"
            value={start_time}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: theme.colors.surface },
            }}
            maxLength={5}
            render={(props) => (
              <TextInputMask
                {...props}
                options={{
                  format: 'HH:mm',
                }}
                type="datetime"
              />
            )}
            onChangeText={handleChange('start_time')}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="chevron-down"
                forceTextInputFocus={false}
                onPress={toggleStartMeridian}
              />
            }
            style={{ flex: 1, paddingHorizontal: 0 }}
          />
          {renderErrorMessages('start_time')}
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'अंत समय' : 'End time'}
            placeholder="HH:MM"
            value={end_time}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: theme.colors.surface },
            }}
            maxLength={5}
            render={(props) => (
              <TextInputMask
                {...props}
                options={{
                  format: 'HH:mm',
                }}
                type="datetime"
              />
            )}
            onChangeText={handleChange('end_time')}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="chevron-down"
                forceTextInputFocus={false}
                onPress={toggleEndMeridian}
              />
            }
            style={{ flex: 1, paddingHorizontal: 0 }}
          />
          {renderErrorMessages('end_time')}
        </View>
      </View>
      <OptionsView
        isVisible={showStartDayModal}
        name="start_day"
        value={start_day}
        options={days}
        onChange={onChange}
        onDismiss={toggleStartDayModal}
      />
      <OptionsView
        isVisible={showEndDayModal}
        name="end_day"
        value={end_day}
        options={days}
        onChange={onChange}
        onDismiss={toggleEndDayModal}
      />
      <OptionsView
        isVisible={showStartMeridian}
        name="start_time_meridian"
        value={start_time_meridian}
        options={meridians}
        onChange={onChange}
        onDismiss={toggleStartMeridian}
      />
      <OptionsView
        isVisible={showEndMeridian}
        name="end_time_meridian"
        value={end_time_meridian}
        options={meridians}
        onChange={onChange}
        onDismiss={toggleEndMeridian}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  dropdownContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
});

export default OtherDetailsView;
