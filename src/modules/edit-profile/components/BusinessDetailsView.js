// @flow
import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  HelperText,
  List,
  Surface,
  TextInput,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import validator from 'validator/es';
import type { FormProps } from '../../../lib/useForm';
import { getSizeInMB } from '../../../utils';
import useAppContent from '../../../lib/useAppContent';
import SelectView from '../../../components/SelectView';
import { RouteNames } from '../../../navigation/Navigator';

type PropTypes = {
  isProfileSetup: boolean,
  companySizes: Array<Object>,
  industries: Array<Object>,
  formProps: FormProps,
};

const BusinessDetailsView = ({
  isProfileSetup,
  companySizes,
  industries,
  formProps,
}: PropTypes): React$Node => {
  const {
    values: {
      address,
      avatar_data_uri,
      company_size_id,
      email,
      industry_type_id,
      name,
      overview,
      website,
    },
    getErrors,
    onChange,
  } = formProps;

  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const timestamp = useRef(Date.now());

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const onGotoLocation = useCallback(() => {
    navigation.navigate(RouteNames.location, {
      withCallback: true,
      prevRoute: RouteNames.editProfile,
    });
  }, [navigation]);

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
          if (response.fileSize > getSizeInMB(5)) {
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
        title={<Title>{isHindi ? 'लोगो अपलोड करें' : 'Upload logo'}</Title>}
        description={
          isHindi
            ? 'अनुमत प्रारूप .jpeg, .jpg या .png हैं।'
            : 'Allowed formats are .jpeg, .jpg or .png.'
        }
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
      <View style={styles.separator} />
      <TextInput
        mode="outlined"
        label={isHindi ? 'नियोक्ता का नाम' : 'Name of employer'}
        value={name}
        onChangeText={handleChange('name')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      {renderErrorMessages('name')}
      <View style={{ height: 8 }} />
      <TextInput
        mode="outlined"
        label={isHindi ? 'कंपनी का नाम' : 'Name of company'}
        value={overview}
        onChangeText={handleChange('overview')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      <View style={styles.separator} />
      <SelectView
        label={isHindi ? 'कर्मचारियों की संख्या' : 'Company size'}
        value={company_size_id}
        name={'company_size_id'}
        options={companySizes}
        onChange={onChange}
        containerStyle={{ flex: 1 }}
      />
      {renderErrorMessages('company_size_id')}
      <View style={styles.separator} />
      <SelectView
        label={isHindi ? 'उद्योग' : 'Industry'}
        value={industry_type_id}
        name={'industry_type_id'}
        options={industries}
        onChange={onChange}
        containerStyle={{ flex: 1 }}
      />
      {renderErrorMessages('industry_type_id')}
      {/*{isProfileSetup && (*/}
      {/*  <Fragment>*/}
      {/*    <View style={{ height: 8 }} />*/}
      {/*    <TextInput*/}
      {/*      mode="outlined"*/}
      {/*      label={isHindi ? 'ईमेल' : 'Email'}*/}
      {/*      keyboardType="email-address"*/}
      {/*      value={email}*/}
      {/*      onChangeText={handleChange('email')}*/}
      {/*      theme={{*/}
      {/*        ...theme,*/}
      {/*        colors: { ...theme.colors, background: theme.colors.surface },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*    <View style={{ height: 8 }} />*/}
      {/*    <TextInput*/}
      {/*      mode="outlined"*/}
      {/*      label={isHindi ? 'वेबसाइट' : 'Website'}*/}
      {/*      value={website}*/}
      {/*      onChangeText={handleChange('website')}*/}
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
            label={isHindi ? 'पता' : 'Address'}
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
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    overflow: 'hidden',
  },
  separator: {
    height: 16,
  },
  dropdownContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
});

export default BusinessDetailsView;
