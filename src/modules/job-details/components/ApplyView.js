// @flow
import React, { useMemo, useRef } from 'react';
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
} from 'react-native-paper';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  isVisible: boolean,
  job: Object,
  applying: boolean,
  onDismiss: Function,
  onConfirmApply: Function,
};

const ApplyView = ({
  isVisible,
  job,
  applying,
  onDismiss,
  onConfirmApply,
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
              {isHindi
                ? 'अपना आवेदन शुरू करने के लिए तैयार?'
                : 'Ready to start your application?'}
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
                uri: job.avatar_url,
              }}
              style={{
                backgroundColor: theme.colors.surface,
              }}
            />
          )}
          title={
            <Subheading style={{ letterSpacing: 0 }}>
              {job.profession}
            </Subheading>
          }
          description={job.employer_name}
          descriptionNumberOfLines={2}
          style={{ paddingHorizontal: 16 }}
        />
        <View style={styles.fabContainer}>
          <FAB
            loading={applying}
            disabled={applying}
            icon="send"
            label={isHindi ? 'आवेदन' : 'Apply'}
            style={[
              styles.fab,
              {
                ...(applying
                  ? { backgroundColor: theme.colors.disabled }
                  : { backgroundColor: theme.colors.primary }),
              },
            ]}
            uppercase={false}
            onPress={onConfirmApply}
          />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          {isHindi ? (
            <Caption
              style={{ color: theme.colors.placeholder, letterSpacing: 0 }}>
              <Caption style={{ color: theme.colors.text, letterSpacing: 0 }}>
                आवेदन
              </Caption>{' '}
              पर क्लिक करके आप हमारे{' '}
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
                Apply
              </Caption>
              , you agree to our{' '}
              <Caption
                style={{ color: theme.colors.primary, letterSpacing: 0 }}>
                Terms & Conditions
              </Caption>
              {'\n'}
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

export default ApplyView;
