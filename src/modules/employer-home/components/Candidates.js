// @flow
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Badge,
  Caption,
  Card,
  Chip,
  FAB,
  List,
  Paragraph,
  Subheading,
  Surface,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../Navigator-v2';
import withLoginView from '../../../containers/withLoginView';
import useAppContent from '../../../lib/useAppContent';
import { timeFromNow } from '../../../utils/dayjs';
import OptionsView from '../../../components/OptionsView';

type PropTypes = {
  isLoggedIn: boolean,
  session: Object,
  location: Object,
  loading: boolean,
  candidates: Array<Object>,
  jobs: Array<Object>,
  professions: Array<Object>,
  professionID: any,
  notificationCount: number,
  setProfessionID: Function,
  fetch: Function,
  fetchJobs: Function,
  onContinueWithLogin: Function,
  fetchContent: Function,
};

const Candidates = ({
  isLoggedIn,
  session,
  candidates,
  jobs,
  professions,
  professionID,
  setProfessionID,
  notificationCount,
  onContinueWithLogin,
  fetchContent,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const timestamp = useRef(Date.now());

  const selectedProfession = useMemo(() => {
    if (professionID) {
      const m = professions.find(({ value }) => value === professionID);

      return m ? m.label : '';
    }

    return '';
  }, [professionID, professions]);

  const sections = useMemo(
    () =>
      [
        {
          title: 'My jobs',
          data: jobs.slice(0, 3),
        },
        {
          title: 'Candidates',
          data: candidates,
        },
      ].map((section, index) => ({ ...section, index })),
    [jobs, candidates],
  );

  const toggleShowSearchOptions = useCallback(() => {
    setShowSearchOptions((state) => !state);
  }, []);

  const onChange = useCallback(
    (_, v) => {
      setProfessionID(v);
    },
    [setProfessionID],
  );

  const onReset = useCallback(() => {
    setProfessionID(null);
  }, [setProfessionID]);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const renderItem = useCallback(
    (props) => {
      const {
        section: { index },
      } = props;

      switch (index) {
        case 0: {
          const {
            item: {
              id,
              profession,
              created_at,
              company_logo_url,
              profile_score,
              number_of_applications,
            },
          } = props;

          return (
            <Card
              onPress={navigate(RouteNames.jobDetails, { id })}
              style={{ marginHorizontal: 16 }}>
              <Card.Content>
                <List.Item
                  title={
                    <Subheading style={{ letterSpacing: 0 }}>
                      {profession}
                    </Subheading>
                  }
                  titleNumberOfLines={2}
                  description={
                    isHindi ? (
                      <Paragraph style={{ color: theme.colors.placeholder }}>
                        आवेदकों की संख्या {number_of_applications}
                        {'\n'}
                        <Caption style={{ letterSpacing: 0 }}>
                          {timeFromNow(created_at)}
                        </Caption>
                      </Paragraph>
                    ) : (
                      <Paragraph style={{ color: theme.colors.placeholder }}>
                        {number_of_applications} applicants
                        {'\n'}
                        <Caption style={{ letterSpacing: 0 }}>
                          Posted {timeFromNow(created_at)}
                        </Caption>
                      </Paragraph>
                    )
                  }
                  descriptionNumberOfLines={10}
                  left={(props) => (
                    <Avatar.Image
                      {...props}
                      source={{
                        uri: `${company_logo_url}?timestamp=${timestamp.current}`,
                      }}
                      style={{
                        ...props.style,
                        backgroundColor: theme.colors.surface,
                      }}
                    />
                  )}
                  right={(props) =>
                    profile_score >= 6 ? (
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
                  style={{
                    padding: 0,
                  }}
                />
              </Card.Content>
            </Card>
          );
        }

        default: {
          const {
            item: {
              id,
              name,
              experiences,
              profile_picture_url,
              profile_score,
              distance,
              city,
            },
          } = props;

          return (
            <Card
              onPress={navigate(RouteNames.employeeDetails, { id })}
              style={{ marginHorizontal: 16 }}>
              <Card.Content>
                <List.Item
                  title={
                    <Subheading style={{ letterSpacing: 0 }}>{name}</Subheading>
                  }
                  titleNumberOfLines={2}
                  description={
                    isHindi ? (
                      <Paragraph style={{ color: theme.colors.placeholder }}>
                        {(experiences || []).length} पिछला अनुभव{'\n'}
                        {distance <= 150 ? (
                          <Caption style={{ letterSpacing: 0 }}>
                            {`${Number(distance).toFixed(0)} ${
                              parseInt(distance) === 1 ? 'km' : 'kms'
                            } दूर`}
                          </Caption>
                        ) : (
                          <Caption style={{ letterSpacing: 0 }}>{city}</Caption>
                        )}
                      </Paragraph>
                    ) : (
                      <Paragraph style={{ color: theme.colors.placeholder }}>
                        {(experiences || []).length} Previous experience
                        {(experiences || []).length === 1 ? '' : 's'}
                        {'\n'}
                        {distance <= 150 ? (
                          <Caption style={{ letterSpacing: 0 }}>
                            {`${Number(distance).toFixed(0)} ${
                              parseInt(distance) === 1 ? 'km' : 'kms'
                            } away`}
                          </Caption>
                        ) : (
                          <Caption style={{ letterSpacing: 0 }}>{city}</Caption>
                        )}
                      </Paragraph>
                    )
                  }
                  descriptionNumberOfLines={10}
                  left={(props) => (
                    <Avatar.Image
                      {...props}
                      source={{
                        uri: `${profile_picture_url}?timestamp=${timestamp.current}`,
                      }}
                      style={{
                        ...props.style,
                        backgroundColor: theme.colors.surface,
                      }}
                    />
                  )}
                  right={(props) =>
                    profile_score >= 6 ? (
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
                  style={{
                    padding: 0,
                  }}
                />
              </Card.Content>
            </Card>
          );
        }
      }
    },
    [isHindi, navigate, theme.colors.placeholder, theme.colors.surface],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderHeader = useCallback(
    () => (
      <Surface elevation={4} style={{ backgroundColor: theme.colors.accent }}>
        <Appbar
          style={[styles.appbar, { backgroundColor: theme.colors.accent }]}>
          {isLoggedIn ? (
            <Fragment>
              <View>
                <Appbar.Action
                  icon="bell-outline"
                  color={theme.colors.placeholder}
                  onPress={navigate(RouteNames.notifications)}
                />
              </View>
              <Appbar.Action
                icon="calendar-outline"
                color={theme.colors.placeholder}
                onPress={navigate(RouteNames.interviews)}
              />
            </Fragment>
          ) : null}
        </Appbar>
        <View style={styles.header}>
          <Paragraph>
            {isHindi ? 'नमस्ते' : 'Hi'} {isLoggedIn ? session.name : 'Guest'}
          </Paragraph>
          <Title>
            {isHindi ? 'आप क्या करना चाहेंगे?' : 'What would you like to do?'}
          </Title>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}>
          <TouchableWithoutFeedback onPress={navigate(RouteNames.editJob)}>
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon icon="briefcase-outline" />
              <Subheading>
                {isHindi ? 'जॉब पोस्ट करें' : 'Post a job'}
              </Subheading>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon icon="account-outline" />
              <Subheading>
                {isHindi ? 'उम्मीदवार खोजें' : 'Find candidates'}
              </Subheading>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Surface>
    ),
    [
      isHindi,
      isLoggedIn,
      navigate,
      session.name,
      theme.colors.accent,
      theme.colors.placeholder,
    ],
  );

  const renderSectionHeader = useCallback(
    ({ section: { index } }) => {
      switch (index) {
        case 0: {
          return (
            <List.Item
              title={
                <Title>
                  {isHindi
                    ? 'मेरे द्वारा पोस्ट की गई नौकरियां'
                    : 'Jobs posted by me'}
                </Title>
              }
              style={{backgroundColor: theme.colors.background}}
              right={() => (
                <View style={{ marginRight: 8 }}>
                  <Chip
                    icon="arrow-right"
                    mode="outlined"
                    onPress={onContinueWithLogin(RouteNames.viewJobs)}>
                    {isHindi ? 'सभी देखें' : 'View all'}
                  </Chip>
                </View>
              )}
            />
          );
        }

        case 1: {
          return (
            <Fragment>
              {/* {renderSeparator()} */}
              <Appbar
                style={{
                  backgroundColor: theme.colors.background,
                  elevation: 0,
                  paddingTop: 16,
                }}>
                <Appbar.Content
                  title={
                    <Title>
                      {isHindi ? 'आस-पास के उम्मीदवार' : 'Nearby candidates'}
                    </Title>
                  }
                />
                <Appbar.Action
                  icon="filter-outline"
                  color={theme.colors.placeholder}
                  onPress={toggleShowSearchOptions}
                />
                <Appbar.Action
                  icon="map-marker-outline"
                  color={theme.colors.placeholder}
                  onPress={navigate(RouteNames.location)}
                />
              </Appbar>
              <View
                style={{
                  alignItems: 'flex-end',
                  paddingBottom: 16,
                  paddingHorizontal: 16,
                }}>
                {selectedProfession ? (
                  <Chip mode="outlined" icon="close" onPress={onReset}>
                    {selectedProfession}
                  </Chip>
                ) : null}
              </View>
            </Fragment>
          );
        }

        default:
          return null;
      }
    },
    [
      isHindi,
      navigate,
      onContinueWithLogin,
      renderSeparator,
      selectedProfession,
      theme.colors.background,
      theme.colors.placeholder,
      toggleShowSearchOptions,
      onReset,
    ],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/*{renderHeader()}*/}
      <Surface elevation={4} style={{ backgroundColor: theme.colors.accent }}>
        <Appbar
          style={[styles.appbar, { backgroundColor: theme.colors.accent }]}>
          {isLoggedIn ? (
            <Fragment>
              <View style={{ position: 'relative' }}>
                <Appbar.Action
                  icon="bell-outline"
                  color={theme.colors.placeholder}
                  onPress={navigate(RouteNames.notifications)}
                />
                {notificationCount ? (
                  <Badge style={{ position: 'absolute', top: 4 }}>
                    {notificationCount}
                  </Badge>
                ) : null}
              </View>
              <Appbar.Action
                icon="calendar-outline"
                color={theme.colors.placeholder}
                onPress={navigate(RouteNames.interviews)}
              />
            </Fragment>
          ) : null}
        </Appbar>
        {/*<View style={styles.header}>*/}
        {/*  <Paragraph>*/}
        {/*    {isHindi ? 'नमस्ते' : 'Hi'} {isLoggedIn ? session.name : 'Guest'}*/}
        {/*  </Paragraph>*/}
        {/*  <Title>*/}
        {/*    {isHindi ? 'आप क्या करना चाहेंगे?' : 'What would you like to do?'}*/}
        {/*  </Title>*/}
        {/*</View>*/}
        <List.Item
          title={
            <Paragraph>
              {isHindi ? 'नमस्ते' : 'Hi'} {isLoggedIn ? session.name : 'Guest'}
            </Paragraph>
          }
          description={
            <Title>
              {isHindi ? 'आप क्या करना चाहेंगे?' : 'What would you like to do?'}
            </Title>
          }
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}>
          <FAB
            label={isHindi ? 'जॉब पोस्ट करें' : 'Post a job'}
            style={{
              flex: 1,
              backgroundColor: theme.colors.primary,
              elevation: 0,
            }}
            uppercase={false}
            onPress={onContinueWithLogin(RouteNames.editJob)}
          />
          <View style={{ width: 16 }} />
          <FAB
            label={isHindi ? 'उम्मीदवार खोजें' : 'Find candidates'}
            style={{
              flex: 1,
              backgroundColor: theme.colors.primary,
              elevation: 0,
            }}
            uppercase={false}
            onPress={navigate(RouteNames.search)}
          />
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Paragraph>
            {isHindi
              ? 'आप कई नौकरियां पोस्ट कर सकते हैं।'
              : 'You can post multiple jobs.'}
          </Paragraph>
        </View>
      </Surface>
      {renderSeparator()}
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        // ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchContent} />
        }
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.fabContainer}>
        <View>
          <FAB
            icon="account-circle-outline"
            label={isHindi ? 'मेरी प्रोफाइल' : 'My profile'}
            style={{ backgroundColor: theme.colors.primary }}
            uppercase={false}
            onPress={onContinueWithLogin(RouteNames.profile)}
          />
        </View>
      </View>
      <OptionsView
        isVisible={showSearchOptions}
        name={'professionID'}
        value={professionID}
        options={professions}
        onChange={onChange}
        onDismiss={toggleShowSearchOptions}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'flex-end',
    elevation: 0,
  },
  header: {
    // paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    // marginBottom: 16,
  },
  searchInput: {
    flex: 1,
  },
  listContainer: {},
  listItemContainer: {
    padding: 0,
  },
  separator: {
    height: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
});

export default withLoginView(Candidates);
