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
import { RouteNames } from '../../../navigation/Navigator';
import { useNavigation } from '@react-navigation/native';

type PropTypes = {
  editing: boolean,
  jobTypes: Array<Object>,
  professions: Array<Object>,
  formProps: FormProps,
};

const BasicDetailsView = ({
  editing,
  jobTypes,
  professions,
  formProps,
}: PropTypes): React$Node => {
  const navigation = useNavigation();

  const {
    values: {
      description,
      location_type,
      profession_id,
      title,
      type_id,
      vacancies,
      address,
    },
    getErrors,
    onChange,
  } = formProps;

  const theme = useTheme();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [showGenderModal, setShowGenderModal] = useState(false);

  const [showQualificationModal, setShowQualificationModal] = useState(false);

  const [showJobLocationModal, setShowJobLocationModal] = useState(false);

  const selectedType = useMemo(() => {
    const match = jobTypes.find(({ value }) => value === type_id);

    if (match) {
      return match.label;
    }

    return '';
  }, [type_id, jobTypes]);

  const selectedQualification = useMemo(() => {
    const match = professions.find(({ value }) => value === profession_id);

    if (match) {
      return match.label;
    }

    return '';
  }, [profession_id, professions]);

  const locationTypes = useMemo(
    () => [
      {
        label: 'Onsite',
        value: 'ONSITE_ONLY',
      },
      {
        label: 'Work from Home',
        value: 'REMOTE_ONLY',
      },
      {
        label: 'Both',
        value: 'REMOTE_ALLOWED',
      },
    ],
    [],
  );

  const selectedLocationType = useMemo(() => {
    const match = locationTypes.find(({ value }) => value === location_type);

    if (match) {
      return match.label;
    }

    return '';
  }, [locationTypes, location_type]);

  const toggleGenderModal = useCallback(() => {
    setShowGenderModal((state) => !state);
  }, []);

  const toggleQualificationModal = useCallback(() => {
    setShowQualificationModal((state) => !state);
  }, []);

  const toggleJobLocationModal = useCallback(() => {
    setShowJobLocationModal((state) => !state);
  }, []);

  const handleChange = useCallback(
    (key) => (v) => {
      onChange(key, v);
    },
    [onChange],
  );

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const onGotoLocation = useCallback(() => {
    navigation.navigate(RouteNames.location, {
      withCallback: true,
      prevRoute: RouteNames.editJob,
    });
  }, [navigation]);

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
      {/*<Subheading style={{ letterSpacing: 0 }}>Job Details</Subheading>*/}
      {/*<View style={styles.separator} />*/}
      <TouchableRipple onPress={toggleQualificationModal}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'पेशा' : 'Profession'}
            value={selectedQualification}
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background: selectedQualification
                  ? theme.colors.surface
                  : 'transparent',
              },
            }}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="chevron-down"
                forceTextInputFocus={false}
                onPress={toggleQualificationModal}
              />
            }
          />
        </View>
      </TouchableRipple>
      {renderErrorMessages('profession_id')}
      {/*<View style={{ height: 8 }} />*/}
      {/*<TextInput*/}
      {/*  mode="outlined"*/}
      {/*  label={isHindi ? 'नौकरी का नाम' : 'Job Title'}*/}
      {/*  value={title}*/}
      {/*  onChangeText={handleChange('title')}*/}
      {/*  theme={{*/}
      {/*    ...theme,*/}
      {/*    colors: { ...theme.colors, background: theme.colors.surface },*/}
      {/*  }}*/}
      {/*/>*/}
      {/*{renderErrorMessages('title')}*/}
      <View style={{ height: 8 }} />
      <TextInput
        mode="outlined"
        label={isHindi ? 'रिक्ति की संख्या' : 'Number of vacancies'}
        value={vacancies}
        keyboardType="number-pad"
        onChangeText={handleChange('vacancies')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      {renderErrorMessages('vacancies')}
      <View style={styles.separator} />
      <TouchableRipple onPress={onGotoLocation}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={isHindi ? 'नौकरी का स्थान' : 'Location of the job'}
            value={address?.formatted_address || address?.street_address}
            theme={{
              ...theme,
              colors: {
                ...theme.colors,
                background:
                  address?.formatted_address || address?.street_address
                    ? theme.colors.surface
                    : 'transparent',
              },
            }}
            right={
              <TextInput.Icon
                color={theme.colors.placeholder}
                icon="map-marker-outline"
                forceTextInputFocus={false}
                onPress={navigate(RouteNames.location)}
              />
            }
          />
        </View>
      </TouchableRipple>
      {renderErrorMessages('address')}
      <OptionsView
        isVisible={showGenderModal}
        name="type_id"
        value={type_id}
        options={jobTypes}
        onChange={onChange}
        onDismiss={toggleGenderModal}
      />
      <OptionsView
        isVisible={showQualificationModal}
        name="profession_id"
        value={profession_id}
        options={professions}
        onChange={onChange}
        onDismiss={toggleQualificationModal}
      />
      <OptionsView
        isVisible={showJobLocationModal}
        name="location_type"
        value={location_type}
        options={locationTypes}
        onChange={onChange}
        onDismiss={toggleJobLocationModal}
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

export default BasicDetailsView;
