// @flow
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Badge,
  Banner,
  Button,
  Caption,
  Card,
  Chip,
  FAB,
  IconButton,
  List,
  Paragraph,
  Searchbar,
  Subheading,
  Surface,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { RouteNames } from '../../../navigation/Navigator';
import withLoginView from '../../../containers/withLoginView';
import {
  formatCurrency,
  parseSalary,
  parseSalaryFrequency,
} from '../../../utils';
import ApplicationsView from './ApplicationsView';
import CategoriesView from './CategoriesView';
import useAppContent from '../../../lib/useAppContent';
import OptionsView from '../../../components/OptionsView';

type PropTypes = {
  isLoggedIn: boolean,
  session: Object,
  loading: boolean,
  notificationCount: number,
  jobs: Array<Object>,
  applications: Array<Object>,
  professions: Array<Object>,
  fetch: Function,
  fetchApplications: Function,
  onContinueWithLogin: Function,
};

const Jobs = ({
  isLoggedIn,
  session,
  loading,
  jobs,
  applications,
  professions,
  interviews,
  notificationCount,
  fetch,
  fetchApplications,
  onContinueWithLogin,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const [index, setIndex] = useState(0);

  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const [professionID, setProfessionID] = useState(null);

  const [routes] = useState(() =>
    isHindi
      ? [
          { key: 'jobs', title: 'आपके लिए' },
          { key: 'categories', title: 'पॉपुलर नौकरियां' },
          { key: 'applications', title: 'आवेदन' },
        ]
      : [
          { key: 'jobs', title: 'For you' },
          { key: 'categories', title: 'Top categories' },
          { key: 'applications', title: 'Applications' },
        ],
  );

  const jobsContent = useMemo(
    () =>
      professionID
        ? jobs.filter(({ profession_id: p }) => p === professionID)
        : jobs,
    [jobs, professionID],
  );

  const selectedProfession = useMemo(() => {
    if (professionID) {
      const m = professions.find(({ value }) => value === professionID);

      return m ? m.label : '';
    }

    return '';
  }, [professionID, professions]);

  const onChangeSearch = (query) => setSearchQuery(query);

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

  const handleScroll = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      // setScrolling(y > 0);
    },
    [],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderItem = useCallback(
    ({
      item: {
        id,
        profession,
        employer_name,
        salary,
        salary_frequency,
        distance,
        avatar_url,
        locality,
        state,
        city,
      },
    }) => (
      <List.Item
        onPress={navigate(RouteNames.jobDetails, { id })}
        title={
          <Subheading style={{ letterSpacing: 0 }}>{profession}</Subheading>
        }
        titleNumberOfLines={2}
        description={
          <Paragraph style={{ color: theme.colors.placeholder }}>
            {employer_name},{' '}
            {[locality, distance >= 150 ? city : '']
              .filter((c) => c)
              .join(', ')}
            ,{' '}
            {distance <= 150 ? (
              <>{`${Number(distance).toFixed(0)} ${
                parseInt(distance) === 1 ? 'km' : 'kms'
              } ${isHindi ? 'दूर' : 'away'}`}</>
            ) : null}
            {'\n'}
            <Caption style={{ letterSpacing: 0 }}>
              {formatCurrency(parseSalary(salary))}{' '}
              {parseSalaryFrequency(salary_frequency, isHindi)}
            </Caption>
          </Paragraph>
        }
        descriptionNumberOfLines={10}
        left={(props) => (
          <Avatar.Image
            {...props}
            source={{
              uri: avatar_url,
            }}
            style={{
              ...props.style,
              backgroundColor: theme.colors.surface,
            }}
          />
        )}
        style={{ paddingHorizontal: 16 }}
      />
    ),
    [isHindi, navigate, theme.colors.placeholder, theme.colors.surface],
  );

  const renderAppbar = useCallback(
    () => (
      <Fragment>
        <Appbar style={[styles.appbar, { backgroundColor: '#DCF8C6' }]}>
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
      </Fragment>
    ),
    [isLoggedIn, navigate, theme.colors.placeholder, notificationCount],
  );

  const renderSearch = useCallback(
    () => (
      <View style={styles.searchContainer}>
        <Searchbar
          onChangeText={onChangeSearch}
          value={searchQuery}
          placeholder={isHindi ? 'जॉब के लिए खोजें' : 'Search for jobs'}
          style={[
            styles.searchInput,
            { backgroundColor: theme.colors.background },
          ]}
          onFocus={navigate(RouteNames.search)}
        />
      </View>
    ),
    [isHindi, navigate, searchQuery, theme.colors.background],
  );

  const renderHighlights = useCallback(
    () => (
      <View style={{ padding: 16 }}>
        {interviews.length ? (
          <Card
            style={{ marginBottom: 16, backgroundColor: theme.colors.surface }}>
            <Card.Content
              style={{ paddingTop: 8, paddingHorizontal: 0, paddingBottom: 0 }}>
              <List.Item
                title={
                  <Subheading style={{ letterSpacing: 0 }}>
                    {isHindi
                      ? 'ऑनलाइन इंटरव्यू अनुरोध'
                      : `Online interview request${
                          interviews.length === 1 ? '' : 's'
                        }`}
                  </Subheading>
                }
                description={
                  <Caption style={{ letterSpacing: 0 }}>
                    {isHindi
                      ? `आपके पास ${interviews.length} लंबित ऑनलाइन इंटरव्यू अनुरोध हैं।`
                      : `You have ${
                          interviews.length
                        } pending interview request${
                          interviews.length === 1 ? '' : 's'
                        }.`}
                  </Caption>
                }
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={require('../../../assets/images/71613-sprinkles.gif')}
                    style={{
                      ...props.style,
                      backgroundColor: theme.colors.surface,
                    }}
                  />
                )}
                descriptionNumberOfLines={3}
                style={{ paddingVertical: 0 }}
              />
            </Card.Content>
            <Card.Actions style={{ paddingTop: 0, justifyContent: 'flex-end' }}>
              <Button
                icon="arrow-right"
                contentStyle={{ flexDirection: 'row-reverse' }}
                labelStyle={{ letterSpacing: 0 }}
                uppercase={false}
                onPress={navigate(RouteNames.interviews)}>
                {isHindi ? 'सभी देखें' : 'View all'}
              </Button>
            </Card.Actions>
          </Card>
        ) : null}
        <Card style={{ backgroundColor: theme.colors.surface }}>
          <Card.Content
            style={{ paddingTop: 8, paddingHorizontal: 0, paddingBottom: 0 }}>
            <List.Item
              title={
                <Subheading style={{ letterSpacing: 0 }}>
                  {isHindi
                    ? 'ऑनलाइन इंटरव्यू के लिए खुद को तैयार करें'
                    : 'Groom Yourself for Online Interviews'}
                </Subheading>
              }
              description={
                <Caption style={{ letterSpacing: 0 }}>
                  {isHindi
                    ? 'ऑनलाइन कोर्स पूरा करें और अपनी प्रोफाइल और कोर्स कंप्लीशन सर्टिफिकेट पर तुरंत स्टार्स पाएं।'
                    : 'Complete online courses and get stars on your profile and course completion certificates instantly.'}
                </Caption>
              }
              descriptionNumberOfLines={3}
              style={{ paddingVertical: 0 }}
            />
          </Card.Content>
          <Card.Actions style={{ paddingTop: 0, justifyContent: 'flex-end' }}>
            <Button
              icon="arrow-right"
              contentStyle={{ flexDirection: 'row-reverse' }}
              labelStyle={{ letterSpacing: 0 }}
              uppercase={false}
              onPress={navigate(RouteNames.courses)}>
              {isHindi ? 'पाठ्यक्रम देखें' : 'View courses'}
            </Button>
          </Card.Actions>
        </Card>
      </View>
    ),
    [interviews.length, isHindi, navigate, theme.colors.surface],
  );

  const renderListHeader = useCallback(
    () => (
      <Fragment>
        <Appbar
          style={{
            backgroundColor: theme.colors.background,
            elevation: 0,
          }}>
          <Appbar.Content
            title={
              <Title>{isHindi ? 'आस-पास की नौकरियां' : 'Nearby jobs'}</Title>
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
    ),
    [
      isHindi,
      navigate,
      onReset,
      selectedProfession,
      theme.colors.placeholder,
      theme.colors.surface,
      toggleShowSearchOptions,
    ],
  );

  const renderJobsView = useCallback(
    () => (
      <FlatList
        onScroll={handleScroll}
        contentContainerStyle={styles.listContainer}
        data={jobsContent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetch} />
        }
      />
    ),
    [
      jobsContent,
      fetch,
      handleScroll,
      keyExtractor,
      loading,
      renderItem,
      renderListHeader,
    ],
  );

  const renderApplicationsView = useCallback(
    () => (
      <ApplicationsView
        applications={applications}
        fetchApplications={fetchApplications}
      />
    ),
    [applications, fetchApplications],
  );

  const renderTabBar = useCallback(
    (props) => (
      <Fragment>
        <TabBar
          {...props}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.placeholder}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          renderLabel={({ color, route }) => (
            <Paragraph style={{ color }}>{route.title}</Paragraph>
          )}
          style={{
            backgroundColor: '#DCF8C6', //theme.colors.surface,
          }}
        />
      </Fragment>
    ),
    [theme],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={{ backgroundColor: '#DCF8C6' }}>
        {renderAppbar()}
        <View style={styles.header}>
          <Paragraph>
            {isHindi ? 'नमस्ते' : 'Hi'} {isLoggedIn ? session.name : 'Guest'}
          </Paragraph>
          <Title>
            {isHindi ? 'अपने सपनों की नौकरी खोजें' : 'Find Your Dream Job'}
          </Title>
        </View>
        {renderSearch()}
        {renderHighlights()}
      </Surface>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          jobs: renderJobsView,
          categories: CategoriesView,
          applications: renderApplicationsView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      <Fragment>
        <View style={styles.fabContainer}>
          <FAB
            icon="account-circle-outline"
            label={isHindi ? 'मेरी प्रोफाइल' : 'My profile'}
            color={theme.colors.surface}
            onPress={onContinueWithLogin(RouteNames.profile)}
            style={{
              backgroundColor: theme.colors.primary,
            }}
            uppercase={false}
          />
        </View>
      </Fragment>
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
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    // elevation: 0,
  },
  listContainer: {},
  listItemContainer: {
    padding: 0,
    elevation: 0,
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
    zIndex: 5,
  },
});

export default withLoginView(Jobs);
