// @flow
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, FAB, Paragraph, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import { RouteNames } from '../../../navigation/Navigator';
import { formatCurrency, parseSalary } from '../../../utils';
import useAppContent from '../../../lib/useAppContent';
import Video from 'react-native-video';
import axios from 'axios';

type PropTypes = {
  profile: Object,
  session: Object,
  fetchProfile: Function,
};

const ProfileView = ({
  profile,
  session,
  fetchProfile,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appContent, appLanguage } = useAppContent();

  const [profileVideo, setProfileVideo] = useState(false);

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  console.log(profile);

  const basicDetails = useMemo(
    () =>
      session.role === 'EMPLOYEE'
        ? [
            {
              label: isHindi ? 'जन्म की तारीख' : 'Date of Birth',
              value: dayjs(profile?.date_of_birth).format('DD MMMM YYYY'),
            },
            {
              label: isHindi ? 'लिंग' : 'Gender',
              value: profile?.gender,
            },
            {
              label: isHindi ? 'शिक्षा' : 'Education',
              value: profile?.education,
            },
            {
              label: isHindi ? 'ईमेल' : 'Email',
              value: profile?.email,
            },
            {
              label: isHindi ? 'पता' : 'Address',
              value: profile?.address?.street_address,
            },
          ]
            .filter(({ value }) => value)
            .map((c, index) => ({ ...c, index }))
        : [
            {
              label: isHindi ? 'कर्मचारियों की संख्या' : 'Company Size',
              value: profile?.company_size,
            },
            {
              label: isHindi ? 'उद्योग' : 'Industry',
              value: profile?.industry_type,
            },
            {
              label: isHindi ? 'ईमेल' : 'Email',
              value: profile?.email,
            },
            {
              label: isHindi ? 'पता' : 'Address',
              value: profile?.address?.street_address,
            },
            {
              label: isHindi ? 'वेबसाइट' : 'Website',
              value: profile?.website,
            },
          ]
            .filter(({ value }) => value)
            .map((c, index) => ({ ...c, index })),
    [
      isHindi,
      profile?.address?.street_address,
      profile?.company_size,
      profile?.date_of_birth,
      profile?.education,
      profile?.email,
      profile?.gender,
      profile?.industry_type,
      profile?.website,
      session.role,
    ],
  );

  const contactDetails = useMemo(
    () =>
      [
        {
          label: isHindi ? 'ईमेल' : 'Email',
          value: profile?.email,
        },
        {
          label: isHindi ? 'पता' : 'Address',
          value: profile?.address?.street_address,
        },
      ]
        .filter(({ value }) => value)
        .map((c, index) => ({ ...c, index })),
    [isHindi, profile?.address?.street_address, profile?.email],
  );

  const educationWorkDetails = useMemo(
    () =>
      (profile?.experiences || [])
        .map(({ company }) => ({
          label: isHindi ? 'कंपनी का नाम' : 'Company',
          value: company,
        }))
        .filter(({ value }) => value)
        .map((c, index) => ({ ...c, index })),
    [isHindi, profile?.experiences],
  );

  const skillsDetails = useMemo(
    () =>
      (profile?.skills || [])
        .map(({ skill }) => ({
          label: isHindi ? 'नाम' : 'Name',
          value: skill,
        }))
        .filter(({ value }) => value)
        .map((c, index) => ({ ...c, index })),
    [isHindi, profile?.skills],
  );

  const navigate = useCallback(
    (route) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ label, value, index }) => (
      <View key={index} style={styles.itemContainer}>
        <Paragraph style={{ flex: 1, color: theme.colors.placeholder }}>
          {label}
        </Paragraph>
        <Paragraph style={{ flex: 2, textAlign: 'right' }}>{value}</Paragraph>
      </View>
    ),
    [theme.colors.placeholder],
  );

  const renderContent = useCallback(() => {
    switch (session.role) {
      case 'EMPLOYEE': {
        return (
          <Fragment>
            <Card style={styles.cardContainer}>
              <Card.Title title={isHindi ? 'बेसिक जानकारी' : 'Basic Details'} />
              <Card.Content style={{ paddingBottom: 0 }}>
                {basicDetails.map(renderItem)}
              </Card.Content>
            </Card>
            {/*<View style={styles.separator} />*/}
            {/*<Card style={styles.cardContainer}>*/}
            {/*  <Card.Title*/}
            {/*    title={isHindi ? 'काम का अनुभव' : 'Work Experiences'}*/}
            {/*  />*/}
            {/*  <Card.Content style={{ paddingBottom: 0 }}>*/}
            {/*    {educationWorkDetails.map(renderItem)}*/}
            {/*  </Card.Content>*/}
            {/*</Card>*/}
            <View style={styles.separator} />
            <Card style={styles.cardContainer}>
              <Card.Title title={isHindi ? 'कौशल' : 'Skills'} />
              <Card.Content style={{ paddingBottom: 0 }}>
                {skillsDetails.map(renderItem)}
              </Card.Content>
            </Card>
            <View style={styles.separator} />
            {profileVideo ? (
              <Card style={styles.cardContainer}>
                <Card.Title
                  title={isHindi ? 'प्रोफ़ाइल वीडियो' : 'Profile Video'}
                />
                <Card.Content style={{ paddingBottom: 8 }}>
                  <Video
                    // ref={ref}
                    controls
                    paused
                    poster="https://merarozgaarapp-assets.s3.ap-south-1.amazonaws.com/profile-video.png"
                    source={{
                      uri: `https://merarozgaarapp.s3.ap-south-1.amazonaws.com/${session.id}/profile.mp4`,
                    }}
                    resizeMode="contain"
                    // onEnd={onAllowProceed}
                    style={{
                      aspectRatio: 1920 / 1080,
                    }}
                  />
                </Card.Content>
              </Card>
            ) : null}
            {/*<View style={styles.separator} />*/}
            {/*<Card*/}
            {/*  style={[styles.cardContainer, { elevation: 0, borderWidth: 1 }]}>*/}
            {/*  <Card.Title title="Documents" />*/}
            {/*  <Card.Content>*/}
            {/*    <Paragraph*/}
            {/*      style={{*/}
            {/*        color: theme.colors.placeholder,*/}
            {/*      }}>*/}
            {/*      Uploaded documents will appear here.*/}
            {/*    </Paragraph>*/}
            {/*  </Card.Content>*/}
            {/*</Card>*/}
          </Fragment>
        );
      }

      case 'EMPLOYER': {
        return (
          <Fragment>
            <Card style={[styles.cardContainer]}>
              <Card.Title title={isHindi ? 'विवरण' : 'Overview'} />
              <Card.Content>
                <Paragraph
                  style={{
                    color: theme.colors.placeholder,
                  }}>
                  {profile?.overview}
                </Paragraph>
              </Card.Content>
            </Card>
            <View style={styles.separator} />
            <Card style={[styles.cardContainer]}>
              <Card.Title title={isHindi ? 'बेसिक जानकारी' : 'Basic Details'} />
              <Card.Content style={{ paddingBottom: 0 }}>
                {basicDetails.map(renderItem)}
              </Card.Content>
            </Card>
            <View style={styles.separator} />
            <Card style={[styles.cardContainer]}>
              <Card.Title title={isHindi ? 'पता' : 'Address'} />
              <Card.Content>
                <Paragraph
                  style={{
                    color: theme.colors.placeholder,
                  }}>
                  {[
                    profile?.address?.street_address,
                    profile?.address?.city,
                    profile?.address?.state,
                    profile?.address?.country,
                    profile?.address?.pin_code,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Paragraph>
              </Card.Content>
            </Card>
            {/*<View style={styles.separator} />*/}
            {/*<Card*/}
            {/*  style={[styles.cardContainer, { elevation: 0, borderWidth: 1 }]}>*/}
            {/*  <Card.Title title="Documents" />*/}
            {/*  <Card.Content>*/}
            {/*    <Paragraph*/}
            {/*      style={{*/}
            {/*        color: theme.colors.placeholder,*/}
            {/*      }}>*/}
            {/*      Uploaded documents will appear here.*/}
            {/*    </Paragraph>*/}
            {/*  </Card.Content>*/}
            {/*</Card>*/}
          </Fragment>
        );
      }

      default:
        return null;
    }
  }, [
    basicDetails,
    isHindi,
    profile?.address?.city,
    profile?.address?.country,
    profile?.address?.pin_code,
    profile?.address?.state,
    profile?.address?.street_address,
    profile?.overview,
    profileVideo,
    renderItem,
    session.id,
    session.role,
    skillsDetails,
    theme.colors.placeholder,
  ]);

  useLayoutEffect(() => {
    (async () => {
      try {
        await axios.get(
          `https://merarozgaarapp.s3.ap-south-1.amazonaws.com/${session.id}/profile.mp4`,
        );

        console.log(1);

        setProfileVideo(true);
      } catch (e) {
        console.log(e);
        setProfileVideo(false);
      }
    })();
  }, [session.id]);

  if (isEmpty(profile)) {
    return null;
  }

  return (
    <Fragment>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchProfile} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.separator} />
        {renderContent()}
        <View style={styles.separator} />
      </ScrollView>
      <View style={styles.fabContainer}>
        <FAB
          icon="square-edit-outline"
          label={isHindi ? 'संपादित करें' : 'Edit'}
          onPress={navigate(RouteNames.editProfile)}
          style={{
            backgroundColor: theme.colors.primary,
          }}
          uppercase={false}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    minHeight: 100,
    marginHorizontal: 16,
  },
  separator: {
    height: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default ProfileView;
