// @flow
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Colors,
  Appbar,
  FAB,
  Headline,
  IconButton,
  List,
  Subheading,
  Title,
  useTheme,
  Avatar,
  Text,
  Paragraph,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import WithProgressBar from '../../../components/WithProgressBar';
import type { FormProps } from '../../../lib/useForm';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  ...FormProps,
  loading: boolean,
  calculating: boolean,
  course: Object,
  badgeCount: number,
  currentStep: number,
  isPassed: boolean,
  onContinue: Function,
  downloadCertificate: Function,
};

const ViewCourse = ({
  values: { answers },
  onChange,
  onSubmit,
  loading,
  course,
  calculating,
  badgeCount,
  currentStep,
  isPassed,
  onContinue,
  downloadCertificate,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const ref = useRef();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [allowProceed, setAllowProceed] = useState(false);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onAllowProceed = useCallback(() => {
    setAllowProceed(true);
  }, []);

  const renderVideoView = useCallback(
    () => (
      <Fragment>
        <Video
          ref={ref}
          controls
          poster={course.thumbnail_url}
          source={{
            uri: course.video_url,
          }}
          resizeMode="contain"
          onEnd={onAllowProceed}
          style={{
            aspectRatio: 1920 / 1080,
          }}
        />
        <List.Item
          title={<Title>{course.name}</Title>}
          description={
            isHindi
              ? 'वीडियो को अंत तक देखें और अपना बैज अर्जित करने के लिए प्रश्नों के उत्तर दें।'
              : 'Watch the video till the end and answer the questions to earn your badge.'
          }
          descriptionNumberOfLines={2}
        />
        <View style={{ alignItems: 'flex-start', padding: 16 }}>
          <FAB
            label={isHindi ? 'जारी रखें' : 'Continue'}
            onPress={onContinue}
            disabled={!allowProceed}
            style={{
              backgroundColor: !allowProceed
                ? theme.colors.disabled
                : theme.colors.primary,
            }}
            uppercase={false}
          />
        </View>
      </Fragment>
    ),
    [
      allowProceed,
      course.name,
      course.thumbnail_url,
      course.video_url,
      isHindi,
      onAllowProceed,
      onContinue,
      theme.colors.disabled,
      theme.colors.primary,
    ],
  );

  const renderQuestionsView = useCallback(
    () => (
      <Fragment>
        <FlatList
          data={course.questions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: { question, options }, index }) => (
            <Fragment key={index}>
              <Subheading style={{ color: '#800000', fontWeight: 'bold' }}>
                {index + 1}. {question}
              </Subheading>
              {options.map(({ option, correct }, i) => (
                <List.Item
                  key={i}
                  title={option}
                  titleNumberOfLines={3}
                  left={(props) => (
                    <IconButton
                      {...props}
                      color={theme.colors.primary}
                      icon={
                        answers?.[index]?.selected === i
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                      onPress={() => {
                        onChange(`answers[${index}]`, {
                          option,
                          correct,
                          selected: i,
                        });
                      }}
                    />
                  )}
                />
              ))}
            </Fragment>
          )}
          contentContainerStyle={{ padding: 16 }}
          ListFooterComponent={() => (
            <View style={{ paddingTop: 16, paddingBottom: 100 }}>
              <FAB
                loading={calculating}
                disabled={calculating}
                icon="check"
                label={isHindi ? 'जमा करे' : 'Submit'}
                onPress={onSubmit}
                style={{
                  width: Dimensions.get('window').width / 2,
                  backgroundColor: calculating
                    ? theme.colors.disabled
                    : theme.colors.primary,
                }}
                uppercase={false}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </Fragment>
    ),
    [
      answers,
      calculating,
      course.questions,
      isHindi,
      onChange,
      onSubmit,
      theme.colors.disabled,
      theme.colors.primary,
    ],
  );

  const renderSuccessView = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <Headline style={{ color: theme.colors.text }}>
            {appContent.courses.congratulations}
          </Headline>
          <Avatar.Image
            size={128}
            source={require('../../../assets/images/icons/star.png')}
            style={{ marginVertical: 24, backgroundColor: 'transparent' }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 62, color: Colors.blue700 }}>
              {badgeCount}/6
            </Text>
            <Title
              style={{
                color: theme.colors.placeholder,
              }}>
              {appContent.courses.stars}
            </Title>
            <Paragraph
              style={[styles.disclaimer, { color: theme.colors.placeholder }]}>
              {appContent.courses.disclaimerSuccess}
            </Paragraph>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            width: '100%',
            padding: 16,
          }}>
          <FAB
            label={
              isHindi
                ? badgeCount === 6
                  ? 'अपना प्रमाणपत्र डाउनलोड करें'
                  : 'अगले वीडियो के लिए जारी रखें'
                : badgeCount === 6
                ? 'Download your certificate'
                : 'Continue to next video'
            }
            style={{ backgroundColor: Colors.blue700, elevation: 0 }}
            onPress={badgeCount === 6 ? downloadCertificate : goBack}
            uppercase={false}
          />
        </View>
      </View>
    ),
    [
      appContent.courses.congratulations,
      appContent.courses.disclaimerSuccess,
      appContent.courses.stars,
      badgeCount,
      downloadCertificate,
      goBack,
      isHindi,
      theme.colors.placeholder,
      theme.colors.text,
    ],
  );

  const renderFailureView = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <Headline style={{ color: theme.colors.text }}>
            {appContent.courses.oops}
          </Headline>
          <Avatar.Image
            size={128}
            source={require('../../../assets/images/icons/embarrassed.png')}
            style={{ marginVertical: 24, backgroundColor: 'transparent' }}
          />
          <View style={{ alignItems: 'center' }}>
            {/*<Title*/}
            {/*  style={{*/}
            {/*    color: theme.colors.placeholder,*/}
            {/*  }}>*/}
            {/*  {appContent.courses.betterLuck}*/}
            {/*</Title>*/}
            <Title
              style={[
                styles.disclaimer,
                { color: theme.colors.placeholder, paddingHorizontal: 16 },
              ]}>
              {appContent.courses.disclaimerFailure}
            </Title>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            width: '100%',
            padding: 16,
          }}>
          <FAB
            label={appContent.courses.retry}
            style={{ backgroundColor: Colors.blue700, elevation: 0 }}
            onPress={goBack}
            uppercase={false}
          />
        </View>
      </View>
    ),
    [
      appContent.courses.disclaimerFailure,
      appContent.courses.oops,
      appContent.courses.retry,
      goBack,
      theme.colors.placeholder,
      theme.colors.text,
    ],
  );

  const renderContent = useCallback(() => {
    switch (currentStep) {
      case 3:
        return isPassed ? renderSuccessView() : renderFailureView();

      case 2:
        return renderQuestionsView();

      default:
        return renderVideoView();
    }
  }, [
    currentStep,
    isPassed,
    renderFailureView,
    renderQuestionsView,
    renderSuccessView,
    renderVideoView,
  ]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
      </Appbar>
      <WithProgressBar loading={loading}>{renderContent()}</WithProgressBar>
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
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  disclaimer: {
    marginBottom: 16,
    letterSpacing: 0,
    textAlign: 'center',
  },
});

export default ViewCourse;
