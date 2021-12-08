// @flow
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Avatar,
  HelperText,
  List,
  Surface,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import type { FormProps } from '../../../../lib/useForm';
import { getSizeInMB } from '../../../../utils';
import { RouteNames } from '../../../../navigation/Navigator';
import useAppContent from '../../../../lib/useAppContent';
import SelectView from '../../../../components/SelectView';
import validator from 'validator/es';

type PropTypes = {
  isProfileSetup: boolean,
  genders: Array<Object>,
  qualifications: Array<Object>,
  formProps: FormProps,
};

const Step1View = ({
  isProfileSetup,
  genders,
  qualifications,
  formProps,
}: PropTypes): React$Node => {
  const {
    values: { address, avatar_data_uri, date_of_birth, email, gender_id, name },
    getErrors,
    onChange,
  } = formProps;

  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent } = useAppContent();

  const timestamp = useRef(Date.now());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedDateOfBirth = useMemo(() => {
    if (date_of_birth) {
      return new Date(date_of_birth);
    }

    return new Date();
  }, [date_of_birth]);

  const onGotoLocation = useCallback(() => {
    navigation.navigate(RouteNames.location, {
      withCallback: true,
      prevRoute: RouteNames.editProfile,
    });
  }, [navigation]);

  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const onChangeAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        customButtons: [],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      (response) => {
        if (response.data) {
          console.log(response);

          if (response.fileSize > getSizeInMB(50)) {
            Snackbar.show({
              text: 'Maximum file size allowed is 5MB.',
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            const dataURI = `data:${response.type};base64,${response.data}`;

            onChange('avatar_data_uri', dataURI);
          }
        }
      },
    );
  }, [onChange]);

  const onDateChange = useCallback(
    (e, v) => {
      setShowDatePicker(Platform.OS === 'ios');

      if (e?.type !== 'dismissed') {
        onChange('date_of_birth', dayjs(v).format('YYYY/MM/DD'));
      }
    },
    [onChange],
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
      <List.Item
        title={`${appContent.inputNames.avatar}*`}
        description={appContent.editProfile.format}
        left={({ style }) => (
          <View style={[style, styles.avatar]}>
            <TouchableRipple onPress={onChangeAvatar}>
              {avatar_data_uri ? (
                <Avatar.Image
                  source={{
                    uri: validator.isDataURI(avatar_data_uri)
                      ? avatar_data_uri
                      : `${avatar_data_uri}?timestamp=${timestamp.current}`,
                  }}
                  style={{ backgroundColor: theme.colors.placeholder }}
                />
              ) : (
                <Avatar.Icon
                  icon="account-outline"
                  style={{ backgroundColor: theme.colors.placeholder }}
                />
              )}
            </TouchableRipple>
          </View>
        )}
        style={{ paddingHorizontal: 16 }}
      />
      {renderErrorMessages('avatar_data_uri')}
      <View style={{ height: 24 }} />
      <TextInput
        mode="outlined"
        label={`${appContent.inputNames.name}*`}
        value={name}
        onChangeText={handleChange('name')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      {renderErrorMessages('name')}
      <View style={{ marginTop: 8 }} />
      <TextInput
        mode="outlined"
        label={`${appContent.inputNames.dob}*`}
        placeholder="YYYY/MM/DD"
        value={date_of_birth}
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
      {renderErrorMessages('date_of_birth')}
      <View style={styles.separator} />
      <SelectView
        label={`${appContent.inputNames.gender}*`}
        value={gender_id}
        name="gender_id"
        options={genders}
        onChange={onChange}
      />
      {renderErrorMessages('gender_id')}
      {/*{isProfileSetup && (*/}
      {/*  <Fragment>*/}
      {/*    <View style={{ marginTop: 8 }} />*/}
      {/*    <TextInput*/}
      {/*      mode="outlined"*/}
      {/*      label={appContent.inputNames.email}*/}
      {/*      keyboardType="email-address"*/}
      {/*      value={email}*/}
      {/*      onChangeText={handleChange('email')}*/}
      {/*      theme={{*/}
      {/*        ...theme,*/}
      {/*        colors: { ...theme.colors, background: theme.colors.surface },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Fragment>*/}
      {/*)}*/}
      <View style={styles.separator} />
      <TouchableRipple onPress={onGotoLocation}>
        <View pointerEvents="none" style={{ marginTop: -8 }}>
          <TextInput
            mode="outlined"
            label={`${appContent.inputNames.address}*`}
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
                onPress={onGotoLocation}
              />
            }
          />
        </View>
      </TouchableRipple>
      {renderErrorMessages('address')}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={selectedDateOfBirth}
          onChange={onDateChange}
          maximumDate={dayjs().subtract(18, 'years').toDate()}
          minimumDate={dayjs().subtract(75, 'years').toDate()}
        />
      )}
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    overflow: 'hidden',
  },
  dropdownContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
});

export default Step1View;
