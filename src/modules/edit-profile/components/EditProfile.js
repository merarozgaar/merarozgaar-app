// @flow
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  FAB,
  Headline,
  List,
  Surface,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import type { FormProps } from '../../../lib/useForm';
import Step1View from './employee/Step1View';
import WorkExperienceView from './employee/Step2View';
import BusinessDetailsView from './BusinessDetailsView';
import BusinessAddressView from './BusinessAddressView';
import ProfileVideoView from './employee/ProfileVideoView';
import useAppContent from '../../../lib/useAppContent';
import EducationView from './employee/Step3View';

type PropTypes = {
  isProfileSetup: boolean,
  loading: boolean,
  session: Object,
  location: Object,
  companySizes: Array<Object>,
  genders: Array<Object>,
  industries: Array<Object>,
  professions: Array<Object>,
  qualifications: Array<Object>,
  skills: Array<Object>,
  formProps: FormProps,
  step: number,
  onSubmit: Function,
  setLoading: Function,
  goBack: Function,
};

const EditProfile = ({
  isProfileSetup,
  loading,
  session,
  location,
  companySizes,
  genders,
  industries,
  professions,
  qualifications,
  skills,
  formProps,
  step,
  onSubmit,
  setLoading,
  goBack: goPrevStep,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

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

  const renderHeader = useCallback(
    () =>
      isProfileSetup ? (
        <Appbar
          style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
          {isProfileSetup && (
            <Appbar.BackAction
              color={theme.colors.placeholder}
              onPress={goBack}
            />
          )}
          <Appbar.Content
            title={isHindi ? 'प्रोफ़ाइल संपादित करें' : 'Edit profile'}
          />
        </Appbar>
      ) : session.role === 'EMPLOYEE' ? (
        <List.Item
          title={<Title>{appContent.editProfile.appbarTitle}</Title>}
          description={appContent.editProfile.steps(step)}
        />
      ) : (
        <List.Item
          title={<Title>{appContent.editProfile.appbarTitle}</Title>}
        />
      ),
    [
      appContent.editProfile,
      goBack,
      isHindi,
      isProfileSetup,
      session.role,
      step,
      theme.colors.placeholder,
      theme.colors.surface,
    ],
  );

  const renderEmployeeView = useCallback(() => {
    switch (step) {
      case 1: {
        return (
          <Step1View
            isProfileSetup={isProfileSetup}
            genders={genders}
            qualifications={qualifications}
            formProps={formProps}
          />
        );
      }

      case 2: {
        return (
          <WorkExperienceView
            industries={industries}
            professions={professions}
            qualifications={qualifications}
            formProps={formProps}
          />
        );
      }

      case 3: {
        return (
          <EducationView
            {...formProps}
            session={session}
            skills={skills}
            loading={loading}
            setLoading={setLoading}
          />
        );
      }

      default:
        return null;
    }
  }, [
    step,
    isProfileSetup,
    genders,
    qualifications,
    formProps,
    industries,
    professions,
    session,
    skills,
    loading,
    setLoading,
  ]);

  const renderContent = useCallback(() => {
    switch (session.role) {
      case 'EMPLOYEE': {
        return <Fragment>{renderEmployeeView()}</Fragment>;
      }

      case 'EMPLOYER': {
        return (
          <BusinessDetailsView
            isProfileSetup={isProfileSetup}
            companySizes={companySizes}
            industries={industries}
            formProps={formProps}
          />
        );
      }

      default:
        return null;
    }
  }, [
    session.role,
    renderEmployeeView,
    step,
    goPrevStep,
    isProfileSetup,
    companySizes,
    industries,
    formProps,
  ]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Surface elevation={scrolling ? 4 : 0}>{renderHeader()}</Surface>
      <KeyboardAwareScrollView
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="never">
        <View style={styles.separator} />
        {renderContent()}
        <View style={styles.separator} />
      </KeyboardAwareScrollView>
      <View style={styles.fabContainer}>
        <View style={{ alignItems: 'center' }}>
          {step > 1 && (
            <Button
              icon="arrow-left"
              uppercase={false}
              labelStyle={{ letterSpacing: 0 }}
              onPress={goPrevStep}>
              {isHindi ? 'वापस जाओ' : 'Go back'}
            </Button>
          )}
        </View>
        <FAB
          icon="check"
          loading={loading}
          disabled={loading}
          label={appContent.editProfile.save}
          onPress={onSubmit}
          style={{
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
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  detailsContainer: {
    flex: 1,
  },
});

export default EditProfile;
