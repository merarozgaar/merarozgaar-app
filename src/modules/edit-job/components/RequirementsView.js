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
  qualifications: Array<Object>,
  formProps: FormProps,
};

const RequirementsView = ({
  qualifications,
  formProps,
}: PropTypes): React$Node => {
  const {
    values: { education_id, gender, min_age, min_experience },
    getErrors,
    onChange,
  } = formProps;

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const theme = useTheme();

  const [showQualificationModal, setShowQualificationModal] = useState(false);

  const [showAgeModal, setShowAgeModal] = useState(false);

  const selectedQualification = useMemo(() => {
    const match = qualifications.find(({ value }) => value === education_id);

    if (match) {
      return match.label;
    }

    return '';
  }, [education_id, qualifications]);

  const ageOptions = useMemo(
    () => [
      {
        label: '18-30 years',
        value: '18-30 years',
      },
      {
        label: '31-45 years',
        value: '31-45 years',
      },
      {
        label: '45-60 years',
        value: '46-60 years',
      },
      {
        label: '61-above years',
        value: '61-above years',
      },
      {
        label: 'No age criteria',
        value: 'No age criteria',
      },
    ],
    [],
  );

  const genderOptions = useMemo(
    () =>
      isHindi
        ? [
            {
              label: 'पुस्र्ष',
              value: 'पुस्र्ष',
            },
            {
              label: 'महिला',
              value: 'महिला',
            },
            {
              label: 'अन्य',
              value: 'अन्य',
            },
            {
              label: 'कोई प्राथमिकता नहीं',
              value: 'कोई प्राथमिकता नहीं',
            },
          ]
        : [
            {
              label: 'Male',
              value: 'Male',
            },
            {
              label: 'Female',
              value: 'Female',
            },
            {
              label: 'Other',
              value: 'Other',
            },
            {
              label: 'No preference',
              value: 'No preference',
            },
          ],
    [isHindi],
  );

  const selectedAge = useMemo(() => {
    const match = ageOptions.find(({ value }) => value === min_age);

    if (match) {
      return match.label;
    }

    return '';
  }, [ageOptions, min_age]);

  const toggleQualificationModal = useCallback(() => {
    setShowQualificationModal((state) => !state);
  }, []);

  const toggleAgeModal = useCallback(() => {
    setShowAgeModal((state) => !state);
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

  return (
    <Surface style={styles.container}>
      <SelectView
        label={isHindi ? 'लिंग प्राथमिकता' : 'Gender'}
        name="gender"
        value={gender}
        options={genderOptions}
        onChange={onChange}
      />
      {renderErrorMessages('gender')}
      <View style={{ height: 16 }} />
      <View style={{ flexDirection: 'row', marginTop: -8 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            mode="outlined"
            label={
              isHindi
                ? 'वर्षों में अनुभव (यदि कोई हो)'
                : 'Experience (if any) in years'
            }
            value={min_experience}
            multiline={false}
            keyboardType="number-pad"
            onChangeText={handleChange('min_experience')}
            theme={{
              ...theme,
              colors: { ...theme.colors, background: theme.colors.surface },
            }}
            style={{ flex: 1 }}
          />
          {renderErrorMessages('min_experience')}
        </View>
      </View>
      <OptionsView
        isVisible={showQualificationModal}
        name="education_id"
        value={education_id}
        options={qualifications}
        onChange={onChange}
        onDismiss={toggleQualificationModal}
      />
      <OptionsView
        isVisible={showAgeModal}
        name="min_age"
        value={min_age}
        options={ageOptions}
        onChange={onChange}
        onDismiss={toggleAgeModal}
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

export default RequirementsView;
