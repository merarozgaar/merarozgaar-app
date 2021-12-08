// @flow
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  Card,
  Colors,
  Divider,
  FAB,
  Headline,
  IconButton,
  List,
  Paragraph,
  Searchbar,
  Subheading,
  Surface,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import withLoginView from '../../../containers/withLoginView';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import JobsView from './JobsView';
import ActivityView from './ActivityView';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  isLoggedIn: boolean,
  session: Object,
  location: Object,
  loading: boolean,
  data: Array<Object>,
  applications: Array<Object>,
  jobs: Array<Object>,
  fetch: Function,
  fetchApplications: Function,
  fetchJobs: Function,
  onContinueWithLogin: Function,
};

const Candidates = ({
  isLoggedIn,
  session,
  location,
  loading,
  data,
  jobs,
  applications,
  fetch,
  fetchJobs,
  fetchApplications,
  onContinueWithLogin,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'jobs', title: isHindi ? 'शीर्ष सुझाव' : 'Top matches' },
    {
      key: 'categories',
      title: isHindi ? 'प्रकाशित नौकरियां' : 'Published jobs',
    },
  ]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderListHeader = useCallback(
    () => (
      <List.Item
        title={
          <Title>{isHindi ? 'आस-पास के उम्मीदवार' : 'Nearby candidates'}</Title>
        }
        right={(props) => (
          <IconButton
            {...props}
            icon="map-marker-outline"
            onPress={navigate(RouteNames.location)}
          />
        )}
      />
    ),
    [isHindi, navigate],
  );

  const renderItem = useCallback(
    ({
      item: {
        id,
        name,
        experiences,
        profile_picture_url,
        profile_score,
        distance,
      },
    }) => (
      <Card
        onPress={navigate(RouteNames.employeeDetails, { id })}
        style={{ marginHorizontal: 16 }}>
        <Card.Content>
          <List.Item
            title={<Subheading style={{ letterSpacing: 0 }}>{name}</Subheading>}
            titleNumberOfLines={2}
            description={
              isHindi ? (
                <Paragraph style={{ color: theme.colors.placeholder }}>
                  {(experiences || []).length} पिछला अनुभव{'\n'}
                  <Caption style={{ letterSpacing: 0 }}>
                    {`${Number(distance).toFixed(0)} ${
                      parseInt(distance) === 1 ? 'km' : 'kms'
                    } दूर`}
                  </Caption>
                </Paragraph>
              ) : (
                <Paragraph style={{ color: theme.colors.placeholder }}>
                  {(experiences || []).length} Previous experience
                  {(experiences || []).length === 1 ? '' : 's'}
                  {'\n'}
                  <Caption style={{ letterSpacing: 0 }}>
                    {`${Number(distance).toFixed(0)} ${
                      parseInt(distance) === 1 ? 'km' : 'kms'
                    } away`}
                  </Caption>
                </Paragraph>
              )
            }
            descriptionNumberOfLines={10}
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{
                  uri: profile_picture_url,
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
                  style={{ ...props.style, backgroundColor: 'transparent' }}
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
    ),
    [isHindi, navigate, theme.colors.placeholder, theme.colors.surface],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderCandidatesView = useCallback(
    () => (
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderSeparator}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetch} />
        }
      />
    ),
    [
      data,
      fetch,
      keyExtractor,
      loading,
      renderItem,
      renderListHeader,
      renderSeparator,
    ],
  );

  const renderJobsView = useCallback(
    () => <JobsView jobs={jobs} fetchJobs={fetchJobs} />,
    [fetchJobs, jobs],
  );

  const renderActivityView = useCallback(
    () => (
      <ActivityView
        applications={applications}
        fetchApplications={fetchApplications}
      />
    ),
    [applications, fetchApplications],
  );

  const renderHeader = useCallback(
    () => (
      <Surface>
        <Appbar
          style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
          {isLoggedIn ? (
            <Fragment>
              <Appbar.Action
                icon="bell-outline"
                color={theme.colors.placeholder}
                onPress={navigate(RouteNames.notifications)}
              />
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
            {isHindi
              ? 'अपना आदर्श उम्मीदवार खोजें'
              : 'Find your Ideal Candidate'}
          </Title>
        </View>
        <View
          // pointerEvents="none"
          style={[styles.searchContainer]}>
          <Searchbar
            onChangeText={onChangeSearch}
            value={searchQuery}
            placeholder={
              isHindi ? 'उम्मीदवारों के लिए खोजें' : 'Search for candidates'
            }
            onFocus={navigate(RouteNames.search)}
            style={[
              styles.searchInput,
              { backgroundColor: theme.colors.background },
            ]}
          />
        </View>
        {/*<Surface*/}
        {/*  style={{*/}
        {/*    justifyContent: 'center',*/}
        {/*    backgroundColor: theme.colors.surface,*/}
        {/*  }}>*/}
        {/*  <IconButton*/}
        {/*    color={theme.colors.placeholder}*/}
        {/*    icon="tune"*/}
        {/*    onPress={() => {}}*/}
        {/*  />*/}
        {/*</Surface>*/}
      </Surface>
    ),
    [
      isHindi,
      isLoggedIn,
      navigate,
      searchQuery,
      session.name,
      theme.colors.background,
      theme.colors.placeholder,
      theme.colors.surface,
    ],
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
            backgroundColor: theme.colors.surface,
          }}
        />
      </Fragment>
    ),
    [theme],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {/*<TabView*/}
      {/*  navigationState={{ index, routes }}*/}
      {/*  renderScene={SceneMap({*/}
      {/*    jobs: renderCandidatesView,*/}
      {/*    categories: renderJobsView,*/}
      {/*  })}*/}
      {/*  onIndexChange={setIndex}*/}
      {/*  initialLayout={{ width: layout.width }}*/}
      {/*  renderTabBar={renderTabBar}*/}
      {/*/>*/}
      {/*{renderCandidatesView()}*/}
      <View style={styles.fabContainer}>
        <View>
          <FAB
            icon="plus"
            label={isHindi ? 'जॉब पोस्ट करें' : 'Post a job'}
            style={{ backgroundColor: theme.colors.primary }}
            uppercase={false}
            onPress={onContinueWithLogin(RouteNames.editJob)}
            // onPress={navigate(RouteNames.profile)}
          />
        </View>
        <View style={{ width: 16 }} />
        <View>
          <FAB
            icon="account-circle-outline"
            // label="My Profile"
            style={{ backgroundColor: theme.colors.primary }}
            uppercase={false}
            onPress={onContinueWithLogin(RouteNames.profile)}
            // onPress={navigate(RouteNames.profile)}
          />
        </View>
      </View>
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
    marginBottom: 16,
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
