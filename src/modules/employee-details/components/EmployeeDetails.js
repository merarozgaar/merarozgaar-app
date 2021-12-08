// @flow
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Caption,
  Card,
  Chip,
  Colors,
  Divider,
  FAB,
  Headline,
  List,
  Menu,
  Paragraph,
  Subheading,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import isEmpty from 'lodash.isempty';
import WithProgressBar from '../../../components/WithProgressBar';
import {
  formatCurrency,
  parseApplicationStatus,
  parseSalary,
} from '../../../utils';
import { timeFromNow } from '../../../utils/dayjs';
import ProcessView from './ProcessView';
import InterviewView from './InterviewView';
import GetDetailsView from './GetDetailsView';
import { RouteNames } from '../../../navigation/Navigator';
import HireView from './HireView';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  loading: boolean,
  profile: Object,
  visible: boolean,
  applicantView: boolean,
  applying: boolean,
  application: Object,
  status?: string,
  contactDetails: Object,
  showDetailsConfirmation: boolean,
  onContinue: Function,
  onDismiss: Function,
  onUpdateApplication: Function,
  onRequestContact: Function,
  hideDetailsConfirmation: Function,
  setShowDetailsConfirmation: Function,
};

const EmployeeDetails = ({
  loading,
  profile,
  visible,
  applicantView,
  applying,
  application,
  status,
  contactDetails,
  showDetailsConfirmation,
  onContinue,
  onDismiss,
  onUpdateApplication,
  onRequestContact,
  hideDetailsConfirmation,
  setShowDetailsConfirmation,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const [show, setShow] = useState(false);

  const { appContent, appLanguage } = useAppContent();

  const timestamp = useRef(Date.now());

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [interviewOpted, setInterviewOpted] = useState(false);

  const [detailsRequested, setDetailsRequested] = useState(false);

  const profileOverview = useMemo(
    () =>
      [
        {
          label: isHindi ? 'नाम' : 'Name',
          value: profile.name,
        },
        {
          label: isHindi ? 'शिक्षा' : 'Education',
          value: profile.education,
        },
        {
          label: isHindi ? 'लिंग' : 'Gender',
          value: profile.gender,
        },
      ].filter(({ value }) => value),
    [isHindi, profile.education, profile.gender, profile.name],
  );

  const previousExperiences = useMemo(
    () =>
      (profile.experiences || [])
        .map(({ company }, i) => [
          {
            label: `${isHindi ? 'अनुभव' : 'Experience'} # ${i + 1}`,
            value: company,
            props: {
              left: (props) => (
                <List.Icon {...props} icon="briefcase-outline" />
              ),
            },
          },
          // {
          //   label: 'Salary',
          //   value: formatCurrency(parseSalary(salary)),
          //   props: {
          //     left: (props) => <List.Icon {...props} icon="currency-inr" />,
          //   },
          // },
        ])
        .reduce((a, c) => [...a, ...c], [])
        .filter(({ value }) => value),
    [isHindi, profile.experiences],
  );

  const addressDetails = useMemo(
    () =>
      [
        {
          label: isHindi ? 'पता' : 'Address',
          value: profile?.address?.street_address,
        },
      ].filter(({ value }) => value),
    [isHindi, profile?.address?.street_address],
  );

  const toggleShow = useCallback(() => {
    setShow((state) => !state);
  }, []);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case 'OPEN':
        case 'SHORTLISTED':
        case 'HIRED': {
          return { color: theme.colors.surface };
        }

        default:
          return { color: theme.colors.surface };
      }
    },
    [theme.colors.primary, theme.colors.surface],
  );

  const getStatusBackgroundColor = useCallback(
    (status) => {
      switch (status) {
        case 'HIRED': {
          return { backgroundColor: Colors.orange700 };
        }

        case 'OPEN': {
          return { backgroundColor: Colors.green500 };
        }

        default:
          return { backgroundColor: theme.colors.primary };
      }
    },
    [theme.colors.primary],
  );

  const onScheduleInterview = useCallback(() => {
    setInterviewOpted(true);

    onDismiss();
  }, [onDismiss]);

  const onRequestDetails = useCallback(() => {
    setDetailsRequested(true);

    onDismiss();
  }, [onDismiss]);

  const onCloseInterviewView = useCallback(() => {
    if (interviewOpted) {
      navigation.navigate(RouteNames.scheduleInterview, {
        applicationID: application.id,
      });
    } else if (detailsRequested) {
      setShowDetailsConfirmation(true);
    }
  }, [
    application.id,
    detailsRequested,
    interviewOpted,
    navigation,
    setShowDetailsConfirmation,
  ]);

  const renderAction = useCallback(() => {
    if (applicantView) {
      return (
        <FAB
          icon="arrow-right"
          label={
            status === 'SCREENING'
              ? isHindi
                ? 'स्क्रीनिंग'
                : 'Screening'
              : isHindi
              ? 'प्रोसेस'
              : 'Process'
          }
          onPress={onContinue}
          style={{
            backgroundColor: theme.colors.primary,
          }}
          uppercase={false}
        />
      );
    }

    return null;
  }, [applicantView, isHindi, onContinue, status, theme.colors.primary]);

  const renderItem = useCallback(
    ({ label, value, props = {} }, i) => (
      <List.Item
        {...props}
        key={i}
        title={<Subheading style={{ letterSpacing: 0 }}>{label}</Subheading>}
        description={
          <Paragraph style={{ color: theme.colors.placeholder }}>
            {value}
          </Paragraph>
        }
        descriptionNumberOfLines={100}
        style={{ padding: 0 }}
      />
    ),
    [theme.colors.placeholder],
  );

  const renderStatus = useCallback(
    () =>
      isEmpty(application) ? null : (
        <View>
          <Chip
            style={getStatusBackgroundColor(application.status ?? status)}
            textStyle={getStatusColor(application.status ?? status)}>
            {parseApplicationStatus(application.status ?? status ?? 'Open')}
          </Chip>
        </View>
      ),
    [application, getStatusBackgroundColor, getStatusColor, status],
  );

  const renderProcessView = useCallback(() => {
    switch (application.status ?? status) {
      case 'OPEN':
        return (
          <ProcessView
            isVisible={visible}
            profile={profile}
            applying={applying}
            onDismiss={onDismiss}
            onUpdateApplication={onUpdateApplication}
            onRequestContact={onRequestContact}
          />
        );

      case 'SHORTLISTED':
        return (
          <InterviewView
            isVisible={visible}
            profile={profile}
            applying={applying}
            onDismiss={onDismiss}
            onScheduleInterview={onScheduleInterview}
            onRequestDetails={onRequestContact}
            onCloseInterviewView={onCloseInterviewView}
          />
        );

      case 'SCREENING':
        return (
          <HireView
            isVisible={visible}
            profile={profile}
            applying={applying}
            onDismiss={onDismiss}
            onUpdateApplication={onUpdateApplication}
            onRequestContact={onRequestContact}
          />
        );

      default:
        return null;
    }
  }, [
    application.status,
    applying,
    onCloseInterviewView,
    onDismiss,
    onRequestContact,
    onScheduleInterview,
    onUpdateApplication,
    profile,
    status,
    visible,
  ]);

  useEffect(() => {
    if (visible) {
      setDetailsRequested(false);
    }
  }, [visible]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface elevation={loading ? 0 : 4}>
        <Appbar.Header
          style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
          <Appbar.BackAction
            color={theme.colors.placeholder}
            onPress={goBack}
          />
          {/*<Appbar.Action*/}
          {/*  icon="bookmark-outline"*/}
          {/*  color={theme.colors.placeholder}*/}
          {/*  onPress={() => {}}*/}
          {/*  style={{ marginLeft: 'auto' }}*/}
          {/*/>*/}
          {/*<Menu*/}
          {/*  visible={show}*/}
          {/*  onDismiss={toggleShow}*/}
          {/*  anchor={*/}
          {/*    <Appbar.Action*/}
          {/*      icon="dots-vertical"*/}
          {/*      color={theme.colors.placeholder}*/}
          {/*      onPress={toggleShow}*/}
          {/*    />*/}
          {/*  }>*/}
          {/*  <Menu.Item*/}
          {/*    icon="alert-octagon-outline"*/}
          {/*    title="Report this job"*/}
          {/*    titleStyle={{ marginLeft: -16 }}*/}
          {/*    onPress={() => {}}*/}
          {/*  />*/}
          {/*</Menu>*/}
        </Appbar.Header>
      </Surface>
      <WithProgressBar loading={loading}>
        <Fragment>
          <Surface elevation={4}>
            <List.Item
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{
                    uri: `${profile.profile_picture_url}?timestamp=${timestamp.current}`,
                  }}
                  style={{
                    ...props.style,
                    backgroundColor: theme.colors.surface,
                  }}
                />
              )}
              right={(props) =>
                profile?.profile_score >= 6 ? (
                  <Avatar.Image
                    {...props}
                    size={24}
                    style={{
                      ...props.style,
                      backgroundColor: 'transparent',
                    }}
                    source={require('../../../assets/images/icons/reward.png')}
                  />
                ) : null
              }
              description={
                isHindi ? (
                  <Paragraph style={{ color: theme.colors.placeholder }}>
                    {(profile.experiences || []).length}{' '}
                    {isHindi ? 'पिछला अनुभव' : 'Previous experience'}
                  </Paragraph>
                ) : (
                  <Paragraph style={{ color: theme.colors.placeholder }}>
                    {(profile.experiences || []).length} Previous experience
                    {(profile.experiences || []).length === 1 ? '' : 's'}
                  </Paragraph>
                )
              }
              title={<Headline>{profile.name}</Headline>}
              descriptionNumberOfLines={2}
              style={styles.headerContainer}
            />
            <View style={styles.headerMetaContainer}>
              <Caption style={{ letterSpacing: 0 }}>
                {/*Last active {timeFromNow(profile.updated_at)}*/}
                {`${Number(profile.distance).toFixed(0)} ${
                  parseInt(profile.distance) === 1 ? 'km' : 'kms'
                } ${isHindi ? 'दूर' : 'away'}`}
              </Caption>
              {renderStatus()}
            </View>
          </Surface>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.separator} />
            <Card style={styles.cardContainer}>
              <Card.Content style={{ paddingVertical: 8 }}>
                {profileOverview.map(renderItem)}
              </Card.Content>
            </Card>
            {/*<View style={styles.separator} />*/}
            {/*<Card style={styles.cardContainer}>*/}
            {/*  <Card.Content style={{ paddingVertical: 8 }}>*/}
            {/*    {previousExperiences.map(renderItem)}*/}
            {/*  </Card.Content>*/}
            {/*</Card>*/}
            <View style={styles.separator} />
            <Card style={styles.cardContainer}>
              <Card.Content style={{ paddingVertical: 8 }}>
                {addressDetails.map(renderItem)}
              </Card.Content>
            </Card>
            <View style={styles.separator} />
          </ScrollView>
          {renderProcessView()}
          {(application.status ?? status) !== 'HIRED' && (
            <View style={styles.fabContainer}>{renderAction()}</View>
          )}
          <GetDetailsView
            profile={profile}
            applying={false}
            contactDetails={contactDetails}
            isVisible={showDetailsConfirmation}
            onDismiss={hideDetailsConfirmation}
            onRequestContact={onRequestContact}
            onUpdateApplication={() => {}}
          />
          {applicantView === false && (
            <View style={styles.fabContainer}>
              <FAB
                icon="phone"
                uppercase={false}
                label={isHindi ? 'संपर्क करें' : 'Get contact'}
                onPress={onRequestContact}
                style={{ backgroundColor: theme.colors.primary }}
              />
            </View>
          )}
        </Fragment>
      </WithProgressBar>
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
  headerContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  cardContainer: {
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    height: 16,
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

export default EmployeeDetails;
