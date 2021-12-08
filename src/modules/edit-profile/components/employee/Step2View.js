// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { FormProps } from '../../../../lib/useForm';
import useAppContent from '../../../../lib/useAppContent';
import SelectView from '../../../../components/SelectView';

type PropsTypes = {
  professions: Array<Object>,
  industries: Array<Object>,
  qualifications: Array<Object>,
  formProps: FormProps,
  goPrevStep: Function,
};

const AddressView = ({
  professions,
  industries,
  qualifications,
  formProps: {
    values: { preferences = [], education_id, experiences = [] },
    getErrors,
    onChange,
  },
}: PropsTypes) => {
  const theme = useTheme();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const onAddExperience = useCallback(
    (i) => () => {
      onChange(`preferences[${i + 1}]`, { industry_id: '', profession_id: '' });
    },
    [onChange],
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

  return (
    <Surface style={styles.container}>
      {preferences.map(({ profession_id, industry_id }, i) => (
        <Fragment key={i}>
          {i > 0 ? <View style={{ height: 16 }} /> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon
              name="briefcase-outline"
              color={theme.colors.placeholder}
              size={24}
            />
            <View style={{ width: 16 }} />
            <SelectView
              label={`${appContent.inputNames.profession}*`}
              value={profession_id}
              name={`preferences[${i}].profession_id`}
              options={professions}
              onChange={onChange}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <View style={{ marginLeft: 24 + 16 }}>
            {renderErrorMessages(`preferences[${i}].profession_id`)}
          </View>
          <View style={{ height: 16 }} />
          <SelectView
            label={`${appContent.inputNames.industry}*`}
            value={industry_id}
            name={`preferences[${i}].industry_id`}
            options={industries}
            onChange={onChange}
            containerStyle={{ flex: 1, marginLeft: 24 + 16 }}
          />
          <View style={{ marginLeft: 24 + 16 }}>
            {renderErrorMessages(`preferences[${i}].industry_id`)}
          </View>
          {i === 3 ? <View style={{ height: 16 }} /> : null}
          {i + 1 === preferences.length && preferences.length < 4 && (
            <View style={{ alignItems: 'flex-end', paddingVertical: 16 }}>
              <Button
                mode="outlined"
                icon="plus"
                labelStyle={{ letterSpacing: 0 }}
                style={{ borderRadius: 28 }}
                onPress={onAddExperience(i)}
                uppercase={false}>
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </View>
          )}
        </Fragment>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcon
          name="school-outline"
          color={theme.colors.placeholder}
          size={24}
        />
        <View style={{ width: 16 }} />
        <SelectView
          label={`${appContent.inputNames.education}*`}
          value={education_id}
          name={'education_id'}
          options={qualifications}
          onChange={onChange}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <View style={{ marginLeft: 24 + 16 }}>
        {renderErrorMessages('education_id')}
      </View>
      {/*<View style={{ height: 24 }} />*/}
      {/*{experiences.map(({ company }, i) => (*/}
      {/*  <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
      {/*    {i === 0 ? (*/}
      {/*      <Fragment>*/}
      {/*        <MaterialCommunityIcon*/}
      {/*          name="text"*/}
      {/*          color={theme.colors.placeholder}*/}
      {/*          size={24}*/}
      {/*        />*/}
      {/*        <View style={{ width: 16 }} />*/}
      {/*      </Fragment>*/}
      {/*    ) : (*/}
      {/*      <View style={{ width: 16, marginLeft: 24 }} />*/}
      {/*    )}*/}
      {/*    <View style={{ flex: 1 }}>*/}
      {/*      <TextInput*/}
      {/*        mode="outlined"*/}
      {/*        label={appContent.inputNames.experience}*/}
      {/*        value={company}*/}
      {/*        onChangeText={handleChange(`experiences[${i}].company`)}*/}
      {/*        theme={{*/}
      {/*          ...theme,*/}
      {/*          colors: { ...theme.colors, background: theme.colors.surface },*/}
      {/*        }}*/}
      {/*      />*/}
      {/*      <View style={{ height: 8 }} />*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*))}*/}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  separator: {
    height: 8,
  },
  dropdownContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AddressView;
