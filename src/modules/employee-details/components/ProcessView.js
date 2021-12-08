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
  onUpdateApplication: Function,
  onRequestContact: Function,
};

const ProcessView = ({
  isVisible,
  profile,
  applying,
  onDismiss,
  onUpdateApplication,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      style={styles.modalContainer}>
      <Surface style={styles.container}>
        <List.Item
          title={
            <Title>
              {isHindi ? 'आप क्या करना चाहते हैं?' : 'What do you want to do?'}
            </Title>
          }
          style={{ paddingTop: 0 }}
        />
        <List.Item
          left={(props) => (
            <Avatar.Image
              {...props}
              size={48}
              source={{
                uri: `https://dummyimage.com/64x64/${theme.colors.primary}/000000`,
              }}
              style={{
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
            icon="check"
            color={theme.colors.surface}
            label={isHindi ? 'शॉर्टलिस्ट' : 'Shortlist'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: Colors.green500 }),
              },
            ]}
            uppercase={false}
            onPress={onUpdateApplication('SHORTLISTED')}
          />
          <View style={{ width: 16 }} />
          <FAB
            loading={applying}
            disabled={applying}
            icon="minus-circle-outline"
            label={isHindi ? 'रिजेक्ट' : 'Reject'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: Colors.red500 }),
              },
            ]}
            uppercase={false}
            onPress={onUpdateApplication('CLOSED')}
          />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          {isHindi ? (
            <Caption
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                शॉर्टलिस्ट
              </Caption>{' '}
              पर क्लिक करके या{' '}
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                रिजेक्ट
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

export default ProcessView;
