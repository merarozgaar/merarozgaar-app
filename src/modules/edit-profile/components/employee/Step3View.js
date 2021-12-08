// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Paragraph,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'rn-fetch-blob';
import type { FormProps } from '../../../../lib/useForm';
import SelectView from '../../../../components/SelectView';
import useAppContent from '../../../../lib/useAppContent';
import { getSizeInMB } from '../../../../utils';
import apiClient, { baseURL } from '../../../../utils/apiClient';

type PropTypes = {
  ...FormProps,
  skills: Array<Object>,
  session: Object,
  loading: boolean,
  setLoading: Function,
};

const EmployeeDetailsView = ({
  values: { languages, skills, reference },
  getErrors,
  onChange,
  skills: skillsOptions,
  session,
  loading,
  setLoading,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const onAddSkill = useCallback(
    (i) => () => {
      onChange(`skills[${i + 1}]`, { skill_id: '' });
    },
    [onChange],
  );

  const onUploadVideo = useCallback(() => {
    ImagePicker.showImagePicker(
      { title: 'Select a Video', mediaType: 'video' },
      (response) => {
        console.log({ response });

        const formData = new FormData();

        try {
          setLoading(true);

          formData.append('file', {
            name: `${session.id}/profile.mp4`,
            uri: `file:///${response.path}`,
            type: 'video/mp4',
          });

          (async () => {
            try {
              console.log(1);

              Snackbar.show({
                text: isHindi
                  ? 'प्रोफ़ाइल वीडियो अपलोड प्रारंभ हो गया है, इसमें कुछ समय लग सकता है।'
                  : 'Profile video upload started, this may take some time.',
                duration: Snackbar.LENGTH_LONG,
              });

              const { data } = await apiClient.post('/media/video', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              console.log("video problems.");
              Snackbar.show({
                text: isHindi
                  ? 'प्रोफ़ाइल वीडियो सफलतापूर्वक अपलोड किया गया।'
                  : 'Profile video uploaded successfully.',
                duration: Snackbar.LENGTH_LONG,
              });

              // onChange('profile_video_data_uri', );
            } catch (e) {
            } finally {
              setLoading(false);
            }
          })();
        } catch (e) {
          console.log(e);
        }

        // apiClient
        //   .post('/media', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   })
        //   .then((response) => {
        //     console.log(response);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });

        //
        // if (response.uri) {
        //   (async () => {
        //     try {
        //       const r = await RNFetchBlob.fetch(
        //         'POST',
        //         `${baseURL}/media`,
        //         {
        //           Authorization: session.token ?? '',
        //           'Content-Type': 'multipart/form-data',
        //         },
        //         [
        //           {
        //             name: 'profile_video',
        //             filename: 'profile_video.mp4',
        //             data: RNFetchBlob.wrap(response.uri),
        //           },
        //         ],
        //       );
        //
        //       console.log(r.json());
        //     } catch (e) {
        //       console.log(e);
        //     }
        //   })();
        // if (video.fileSize > getSizeInMB(5)) {
        //   Snackbar.show({
        //     text: 'Maximum file size allowed is 5MB.',
        //     duration: Snackbar.LENGTH_LONG,
        //   });
        // } else {
        //   const dataURI = `data:${response.type};base64,${response.data}`;
        //
        //   onChange('profile_video_data_uri', video.uri);
        // }
        // }
      },
    );
  }, [isHindi, session.id, setLoading]);

  const handleChange = useCallback(
    (key) => (value) => {
      onChange(key, value);
    },
    [onChange],
  );

  const openVideo = useCallback(
    () =>
      Linking.openURL(
        'https://merarozgaarapp-assets.s3.ap-south-1.amazonaws.com/videos/profile-video.mp4',
      ),
    [],
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
      <TextInput
        mode="outlined"
        label={isHindi ? 'ज्ञात भाषाएँ' : 'Languages known'}
        value={languages}
        onChangeText={handleChange('languages')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
      />
      <View style={{ height: 16 }} />
      {skills.map(({ skill_id }, i) => (
        <Fragment key={i}>
          {i > 0 ? <View style={{ height: 16 }} /> : null}
          <SelectView
            label={isHindi ? 'विशेष कौशल' : 'Special skills'}
            value={skill_id}
            name={`skills[${i}].skill_id`}
            options={skillsOptions}
            onChange={onChange}
          />
          <View style={{ marginLeft: 24 + 16 }}>
            {renderErrorMessages(`preferences[${i}].industry_id`)}
          </View>
          {i + 1 === skills.length && skills.length < 5 && (
            <View style={{ alignItems: 'flex-end', paddingVertical: 16 }}>
              <Button
                mode="outlined"
                icon="plus"
                labelStyle={{ letterSpacing: 0 }}
                style={{ borderRadius: 28 }}
                onPress={onAddSkill(i)}
                uppercase={false}>
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </View>
          )}
        </Fragment>
      ))}
      <View style={{ height: 16 }} />
      <Paragraph>
        {isHindi
          ? 'अपना 1 मिनट का परिचय वीडियो अपलोड करें'
          : 'Upload your 1-minute introduction video'}
      </Paragraph>
      <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
        <Button
          mode="outlined"
          labelStyle={{ letterSpacing: 0 }}
          style={{ flex: 1, borderRadius: 28 }}
          uppercase={false}
          loading={loading}
          disabled={loading}
          onPress={onUploadVideo}>
          {isHindi ? 'प्रोफ़ाइल वीडियो अपलोड करें' : 'Upload profile video'}
        </Button>
        <View style={{ width: 16 }} />
        <Button
          mode="outlined"
          labelStyle={{ letterSpacing: 0 }}
          style={{ flex: 1, borderRadius: 28 }}
          uppercase={false}
          onPress={openVideo}>
          {isHindi ? 'सैंपल वीडियो देखें' : 'Watch sample video'}
        </Button>
      </View>
      <View style={{ height: 8 }} />
      <TextInput
        mode="outlined"
        label={isHindi ? 'अनुशंसा' : 'References'}
        placeholder={
          isHindi
            ? 'पेशेवर सिफारिशों के साथ अपनी विश्वसनीयता स्थापित करें।'
            : 'Establish your credibility with professional recommendations.'
        }
        value={reference}
        multiline
        numberOfLines={5}
        onChangeText={handleChange('reference')}
        theme={{
          ...theme,
          colors: { ...theme.colors, background: theme.colors.surface },
        }}
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

export default EmployeeDetailsView;
