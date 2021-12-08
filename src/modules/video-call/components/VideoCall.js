// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Card,
  FAB,
  List,
  Paragraph,
  Title,
  Subheading,
  useTheme,
  Avatar,
  Badge,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  loading: boolean,
  session: Object,
  step: number,
  countdown: number,
  peers: Array<string>,
  channelName: string,
  start: Function,
  hangup: Function,
};

const VideoCall = ({
  loading,
  session,
  step,
  peers,
  channelName,
  start,
  hangup,
  countdown,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  console.log(step);

  const renderContent = useCallback(() => {
    console.log(step);

    switch (step) {
      case 2: {
        return (
          <View style={{ flex: 1 }}>
            <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
            />
            <ScrollView
              style={styles.remoteContainer}
              contentContainerStyle={{ flex: 1, paddingHorizontal: 0 }}
              horizontal={true}>
              {peers.map((value) => (
                <RtcRemoteView.SurfaceView
                  style={styles.remote}
                  uid={value}
                  channelId={channelName}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay={true}
                />
              ))}
            </ScrollView>
            <View style={styles.fabContainer}>
              {/*<Badge>{countdown}</Badge>*/}
              <FAB
                icon="close"
                onPress={hangup}
                color={theme.colors.surface}
                style={{
                  backgroundColor: theme.colors.error,
                }}
                uppercase={false}
              />
            </View>
          </View>
        );
      }

      case 3: {
        return (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Title>
              {isHindi
                ? 'आपने साक्षात्कार छोड़ दिया।'
                : 'You left the interview.'}
            </Title>
            <View style={{ height: 16 }} />
            <FAB
              icon="arrow-left"
              label={isHindi ? 'वापस जाओ' : 'Go back'}
              onPress={goBack}
              color={theme.colors.surface}
              style={{
                backgroundColor: theme.colors.primary,
              }}
              uppercase={false}
            />
          </View>
        );
      }

      default: {
        return (
          <Fragment>
            <Appbar
              style={[
                styles.appbar,
                { backgroundColor: theme.colors.surface },
              ]}>
              <Appbar.BackAction
                color={theme.colors.placeholder}
                onPress={goBack}
              />
            </Appbar>
            <View style={{ padding: 16 }}>
              <Card>
                <Card.Content>
                  {session.role === 'EMPLOYEE' ? (
                    <Fragment>
                      <Title>
                        {isHindi ? 'इंटरव्यू टिप्स' : 'Interview Tips'}
                      </Title>
                      <Paragraph>
                        1.{' '}
                        {isHindi
                          ? 'आपका फर्स्ट इम्प्रैशन अच्छा होना चाहिए।'
                          : 'Your first impression should be good.'}
                      </Paragraph>
                      <Paragraph>
                        2.{' '}
                        {isHindi
                          ? 'अपनी बॉडी लैंग्वेज पर ध्यान दें और अपनी मुद्रा को सीधा रखें।'
                          : 'Focus on your body language and keep your posture straight.'}
                      </Paragraph>
                      <Paragraph>
                        3.{' '}
                        {isHindi
                          ? 'प्रश्नों को ध्यान से सुनें।'
                          : 'Listen to the questions carefully.'}
                      </Paragraph>
                      <Paragraph>
                        4.{' '}
                        {isHindi
                          ? 'उत्तर देने से पहले सोचें।'
                          : 'Think before you answer.'}
                      </Paragraph>
                      <Paragraph>
                        5.{' '}
                        {isHindi
                          ? 'अंत में धन्यवाद कहना न भूलें।'
                          : 'Remember to say Thank You in the end.'}
                      </Paragraph>
                      <List.Item
                        title={
                          <Subheading>
                            {isHindi
                              ? 'मेरा रोज़गार की तरफ से आपको'
                              : 'Mera Rozgaar wishes you'}
                          </Subheading>
                        }
                        description={
                          <Title>
                            {isHindi ? 'ऑल दा बेस्ट!' : 'All the Best!'}
                          </Title>
                        }
                        left={(props) => (
                          <Avatar.Image
                            style={{
                              ...props.style,
                              backgroundColor: theme.colors.surface,
                            }}
                            source={require('../../../assets/images/icon.png')}
                          />
                        )}
                      />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Title>
                        {isHindi ? 'इंटरव्यू टिप्स' : 'Interview Tips'}
                      </Title>
                      <Paragraph>
                        1.{' '}
                        {isHindi
                          ? 'जल्दी भर्ती करके अपना समय, ऊर्जा और संसाधन बचाएं।'
                          : 'Save your time, energy, and resource by recruiting early.'}
                      </Paragraph>
                      <Paragraph>
                        2.{' '}
                        {isHindi
                          ? 'हम उम्मीदवारों को आपकी आवश्यकताओं के लिए सबसे उपयुक्त प्रदान करना चाहते हैं।'
                          : 'We aim to provide candidates most suitable to your requirements.'}
                      </Paragraph>
                      <Paragraph>
                        3.{' '}
                        {isHindi
                          ? 'जब आप किसी को काम पर रखते हैं, तो आप उसके पूरे परिवार का समर्थन करते हैं।'
                          : 'When you hire someone, you support his entire family.'}
                      </Paragraph>
                      <List.Item
                        title={
                          <Subheading>
                            {isHindi
                              ? 'मेरा रोज़गार की तरफ से आपको'
                              : 'Best wishes'}
                          </Subheading>
                        }
                        description={
                          <Title>
                            {isHindi ? 'शुभकामनाएँ!' : 'Team Mera Rozgaar'}
                          </Title>
                        }
                        left={(props) => (
                          <Avatar.Image
                            style={{
                              ...props.style,
                              backgroundColor: theme.colors.surface,
                            }}
                            source={require('../../../assets/images/icon.png')}
                          />
                        )}
                      />
                    </Fragment>
                  )}
                </Card.Content>
              </Card>
              <View style={{ height: 16 }} />
              <Paragraph style={{ color: theme.colors.placeholder }}>
                {isHindi
                  ? 'अस्वीकरण: यह कॉल रिकॉर्ड की जा रही है। किसी भी अश्लील हरकत/शब्दों का प्रयोग सख्त वर्जित है और इसे गंभीरता से लिया जाएगा।'
                  : 'Disclaimer: This call is being recorded. Use of any vulgar actions/ words is strictly prohibited and will be viewed seriously.'}
              </Paragraph>
            </View>
            <View style={styles.fabContainer}>
              <FAB
                icon="arrow-right"
                disabled={loading}
                // loading={loading}
                label={isHindi ? 'जॉइन नाउ' : 'Join now'}
                labelStyle={{ letterSpacing: 0 }}
                onPress={start}
                color={theme.colors.surface}
                style={{
                  backgroundColor: loading
                    ? theme.colors.placeholder
                    : theme.colors.primary,
                }}
                uppercase={false}
              />
            </View>
          </Fragment>
        );
      }
    }
  }, [
    channelName,
    countdown,
    goBack,
    hangup,
    isHindi,
    loading,
    peers,
    session.role,
    start,
    step,
    theme.colors.error,
    theme.colors.placeholder,
    theme.colors.primary,
    theme.colors.surface,
  ]);

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
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
  notificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    padding: 16,
    zIndex: 5,
  },
  max: {
    flex: 1,
  },
  remoteContainer: {
    flex: 1,
  },
  remote: {
    flex: 1,
  },
});

export default VideoCall;
