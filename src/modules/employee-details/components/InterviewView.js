// @flow
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
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
  Colors,
} from 'react-native-paper';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  isVisible: boolean,
  profile: Object,
  applying: boolean,
  onDismiss: Function,
  onScheduleInterview: Function,
  onRequestDetails: Function,
  onCloseInterviewView: Function,
};

const InterviewView = ({
  isVisible,
  profile,
  applying,
  onDismiss,
  onScheduleInterview,
  onRequestDetails,
  onCloseInterviewView,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      onModalHide={onCloseInterviewView}
      style={styles.modalContainer}>
      <Surface style={styles.container}>
        <List.Item
          title={
            <Title>
              {isHindi
                ? 'क्या आप ऑनलाइन इंटरव्यू शेड्यूल करना चाहते हैं?'
                : 'Do you want to schedule online interview?'}
            </Title>
          }
          titleNumberOfLines={2}
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
            <Subheading style={{ letterSpacing: 0 }}>{profile.name}</Subheading>
          }
          description={
            isHindi
              ? `${(profile.experiences || []).length} ${
                  isHindi ? 'पिछला अनुभव' : 'Previous experience'
                }`
              : `${(profile.experiences || []).length} Previous experience${
                  (profile.experiences || []).length === 1 ? '' : 's'
                }`
          }
          descriptionNumberOfLines={2}
          style={{ paddingHorizontal: 16 }}
        />
        <View style={styles.fabContainer}>
          <FAB
            loading={applying}
            disabled={applying}
            icon="calendar-outline"
            color={theme.colors.surface}
            label={isHindi ? 'शेड्यूल' : 'Schedule'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
              },
            ]}
            uppercase={false}
            onPress={onScheduleInterview}
          />
          <View style={{ width: 16 }} />
          <FAB
            loading={applying}
            disabled={applying}
            icon="card-account-phone-outline"
            label={isHindi ? 'संपर्क करें' : 'Get details'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
              },
            ]}
            uppercase={false}
            onPress={onRequestDetails}
          />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          {isHindi ? (
            <Caption
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                शेड्यूल
              </Caption>{' '}
              पर क्लिक करके या{' '}
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                विवरण प्राप्त
              </Caption>{' '}
              करके आप हमारे{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                नियमों और शर्तों
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
                Shortlist
              </Caption>{' '}
              or{' '}
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                Reject
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

export default InterviewView;
