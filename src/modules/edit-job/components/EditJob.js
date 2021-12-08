// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Surface, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import type { FormProps } from '../../../lib/useForm';
import BasicDetailsView from './BasicDetailsView';
import RequirementsView from './RequirementsView';
import OtherDetailsView from './OtherDetailsView';
import SalaryDetailsView from './SalaryDetailsView';
import BusinessAddressView from './BusinessAddressView';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  editing: boolean,
  formProps: FormProps,
  loading: boolean,
  jobTypes: Array<Object>,
  professions: Array<Object>,
  qualifications: Array<Object>,
  salaryFrequencies: Array<Object>,
  skills: Array<Object>,
  jobLocation: Object,
};

const EditJob = ({
  editing,
  loading,
  formProps,
  jobTypes,
  professions,
  qualifications,
  salaryFrequencies,
  jobLocation,
  skills,
}: PropTypes): React$Node => {
  const { onSubmit } = formProps;

  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [scrolling, setScrolling] = useState(false);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      setScrolling(y > 0);
    },
    [],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface elevation={scrolling ? 4 : 0}>
        <Appbar
          style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
          <Appbar.BackAction
            color={theme.colors.placeholder}
            onPress={goBack}
          />
          {editing ? (
            <Appbar.Content title={isHindi ? 'जॉब संपादित करें' : 'Edit job'} />
          ) : (
            <Appbar.Content title={isHindi ? 'जॉब पोस्ट करें' : 'Post a job'} />
          )}
        </Appbar>
      </Surface>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="never"
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.separator} />
        <BasicDetailsView
          editing={editing}
          jobTypes={jobTypes}
          professions={professions}
          formProps={formProps}
        />
        <View style={styles.separator} />
        <RequirementsView
          qualifications={qualifications}
          formProps={formProps}
        />
        <View style={styles.separator} />
        <SalaryDetailsView
          salaryFrequencies={salaryFrequencies}
          formProps={formProps}
        />
        <View style={styles.separator} />
        {/*<BusinessAddressView {...formProps} jobLocation={jobLocation} />*/}
        {/*<View style={styles.separator} />*/}
        <OtherDetailsView {...formProps} />
        <View style={{ height: 56 + 16 + 8 }} />
      </KeyboardAwareScrollView>
      <View style={styles.fabContainer}>
        <FAB
          loading={loading}
          disabled={loading}
          icon="check"
          label={isHindi ? 'सेव' : 'Save'}
          onPress={onSubmit}
          style={{
            width: Dimensions.get('window').width / 2,
            backgroundColor: loading
              ? theme.colors.disabled
              : theme.colors.primary,
          }}
          uppercase={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
    elevation: 0,
  },
  contentContainer: {
    padding: 16,
  },
  separator: {
    height: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    padding: 16,
  },
});

export default EditJob;
