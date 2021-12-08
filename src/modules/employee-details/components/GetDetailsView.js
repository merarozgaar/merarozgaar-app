// @flow
import React, { useCallback, useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  FAB,
  Title,
  Surface,
  useTheme,
  List,
  Avatar,
  Subheading,
  Caption,
} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  isVisible: boolean,
  profile: Object,
  applying: boolean,
  contactDetails: Object,
  onDismiss: Function,
  onUpdateApplication: Function,
  onRequestContact: Function,
};

const GetDetailsView = ({
  isVisible,
  profile,
  applying,
  contactDetails,
  onDismiss,
  onUpdateApplication,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(
      `${contactDetails.dial_code}${contactDetails.mobile_number}`,
    );

    Snackbar.show({ text: 'Copied to clipboard.' });
  }, [contactDetails.dial_code, contactDetails.mobile_number]);

  const onCall = useCallback(
    () =>
      Linking.openURL(
        `tel:${contactDetails.dial_code}${contactDetails.mobile_number}`,
      ),
    [contactDetails],
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      style={styles.modalContainer}>
      <Surface style={styles.container}>
        <List.Item
          title={
            isHindi ? (
              <Title>{profile.name} के साथ बात करो</Title>
            ) : (
              <Title>Speak with {profile.name}</Title>
            )
          }
          style={{ paddingTop: 0 }}
        />
        <List.Item
          left={(props) => (
            <Avatar.Image
              {...props}
              size={48}
              source={{
                uri: profile.profile_picture_url,
              }}
              style={{
                ...props.style,
                backgroundColor: theme.colors.surface,
              }}
            />
          )}
          title={
            <Subheading style={{ letterSpacing: 0 }}>
              {contactDetails.dial_code}
              {contactDetails.mobile_number}
            </Subheading>
          }
          description={
            isHindi
              ? 'क्लिपबोर्ड पर कॉपी करने के लिए क्लिक करें'
              : 'Click to copy to clipboard'
          }
          descriptionNumberOfLines={2}
          style={{ marginHorizontal: -16, paddingHorizontal: 16 + 16 }}
          onPress={copyToClipboard}
        />
        <View style={styles.fabContainer}>
          <FAB
            loading={applying}
            disabled={applying}
            icon="phone"
            color={theme.colors.surface}
            label={isHindi ? 'कॉल' : 'Call'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
              },
            ]}
            uppercase={false}
            onPress={onCall}
          />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          {isHindi ? (
            <Caption>
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                कॉल
              </Caption>{' '}
              पर क्लिक करके, आप हमारे{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                नियम और शर्तों
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
                Call
              </Caption>
              , you agree to our{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                Terms & Conditions
              </Caption>{' '}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  header: {
    paddingHorizontal: 16,
  },
  fabContainer: {
    flexDirection: 'row',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  fab: {
    flex: 1,
    elevation: 0,
  },
});

export default GetDetailsView;
