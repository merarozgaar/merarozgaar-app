// @flow
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { FAB, Title, Surface, useTheme, Paragraph } from 'react-native-paper';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  isVisible: boolean,
  onDismiss: Function,
  onContinue: Function,
};

const OptionsView = ({
  isVisible,
  onDismiss,
  onContinue,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const timeout = useRef();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const handleContinue = useCallback(
    (view) => () => {
      onDismiss();

      timeout.current = setTimeout(() => {
        onContinue(view)();
      }, 0);
    },
    [onContinue, onDismiss],
  );

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [timeout]);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      style={styles.modalContainer}>
      <Surface style={styles.container}>
        <View style={styles.header}>
          <Title style={{ letterSpacing: 0 }}>
            {isHindi ? 'आप क्या ढूंढ रहे हैं?' : 'What are you looking for?'}
          </Title>
          <Paragraph style={{ color: theme.colors.placeholder }}>
            {appContent.setup.optionsLabel}
          </Paragraph>
        </View>
        <View style={styles.fabContainer}>
          <FAB
            icon="magnify"
            label={appContent.setup.employeeCTA}
            style={[
              styles.fab,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            uppercase={false}
            onPress={handleContinue('EMPLOYEE')}
          />
          <View style={{ width: 16 }} />
          <FAB
            icon="account-outline"
            label={appContent.setup.employerCTA}
            style={[
              styles.fab,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            uppercase={false}
            onPress={handleContinue('EMPLOYER')}
          />
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
    alignItems: 'center',
    padding: 16,
  },
  fabContainer: {
    flexDirection: 'row',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  fab: {
    flex: 1,
    elevation: 0,
  },
});

export default OptionsView;
