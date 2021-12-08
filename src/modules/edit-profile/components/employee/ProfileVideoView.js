// @flow
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Subheading, Surface, Title } from 'react-native-paper';
import Video from 'react-native-video';
import * as ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import theme from '../../../../styles/theme';
import { getSizeInMB } from '../../../../utils';
import type { FormProps } from '../../../../lib/useForm';

type PropTypes = {
  ...FormProps,
};

const ProfileVideoView = ({
  values: { profile_video_data_uri },
  onChange,
}: PropTypes) => {
  const ref = useRef();

  const onUploadVideo = useCallback(() => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'video', includeBase64: true },
      (response) => {
        console.log("Here i am");
        console.log({ response });

        if (response.assets && response.assets.length) {
          const video = response.assets[0];

          if (video.fileSize > getSizeInMB(5)) {
            console.log("file is too large....");
            Snackbar.show({
              text: 'Maximum file size allowed is 5MB.',
              duration: Snackbar.LENGTH_LONG,
            });
          } else {
            const dataURI = `data:${response.type};base64,${response.data}`;

            onChange('profile_video_data_uri', video.uri);
          }
        }
      },
    );
  }, [onChange]);

  return (
    <Surface style={styles.container}>
      <Title style={{ textAlign: 'center' }}>Upload Profile Video</Title>
      <Subheading
        style={{
          color: theme.colors.placeholder,
          letterSpacing: 0,
          textAlign: 'center',
        }}>
        One-two liner description about the{'\n'}profile video and its purpose.
      </Subheading>
      <View style={{ height: 16 }} />
      <Card elevation={4}>
        <Card.Content>
          <Video
            ref={ref}
            controls
            source={{
              uri:
                profile_video_data_uri ||
                'https://merarozgaarapp-assets.s3.ap-south-1.amazonaws.com/videos/profile-video.mp4',
            }}
            resizeMode="contain"
            style={{
              aspectRatio: 1920 / 1080,
            }}
          />
        </Card.Content>
      </Card>
      <View style={{ alignItems: 'center', paddingTop: 24 }}>
        <Button icon="upload" onPress={onUploadVideo} uppercase={false}>
          <Subheading style={{ color: theme.colors.primary, letterSpacing: 0 }}>
            Upload now
          </Subheading>
        </Button>
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

export default ProfileVideoView;
