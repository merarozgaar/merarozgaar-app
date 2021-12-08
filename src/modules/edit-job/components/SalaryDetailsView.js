// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HelperText,
  Subheading,
  Surface,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import OptionsView from '../../../components/OptionsView';
import type { FormProps } from '../../../lib/useForm';
import useAppContent from '../../../lib/useAppContent';
import SelectView from '../../../components/SelectView';

type PropTypes = {
  salaryFrequencies: Array<Object>,
  formProps: FormProps,
};

const SalaryDetailsView = ({
  salaryFrequencies,
  formProps,
}: PropTypes): React$Node => {
  const {
    values: { salary, salary_frequency },
    getErrors,
    onChange,
  } = formProps;

  const theme = useTheme();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const frequencyOptions = useMemo(
    () =>
      isHindi
        ? [
            {
              label: 'दैनिक',
              value: 'DAILY',
            },
            {
              label: 'मासिक',
              value: 'MONTHLY',
            },
            {
              label: 'साप्ताहिक',
              value: 'WEEKLY',
            },
          ]
        : [
            {
              label: 'Daily',
              value: 'DAILY',
            },
            {
              label: 'Monthly',
              value: 'MONTHLY',
            },
            {
              label: 'Weekly',
              value: 'WEEKLY',
            },
          ],
    [isHindi],
  );

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

  return (
    <Surface style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'वेतन' : 'Salary'}
            value={salary}
            keyboardType="number-pad"
            onChangeText={handleChange('salary')}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: theme.colors.surface },
            }}
            style={{ flex: 1 }}
          />
          {renderErrorMessages('salary')}
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <SelectView
            label={isHindi ? 'वेतन भुगतान' : 'Frequency'}
            value={salary_frequency}
            name="salary_frequency"
            options={frequencyOptions}
            onChange={onChange}
          />
          {renderErrorMessages('salary_frequency')}
        </View>
      </View>
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

export default SalaryDetailsView;
