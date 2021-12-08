// @flow
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Caption,
  Card,
  List,
  Paragraph,
  Subheading,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAppContent from '../../../lib/useAppContent';
import { RouteNames } from '../../../Navigator-v2';
import { timeFromNow } from '../../../utils/dayjs';

type PropTypes = {
  loading: boolean,
  jobs: Array<Object>,
  fetch: Function,
};

const ViewJobs = ({ jobs, loading, fetch }: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

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

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderItem = useCallback(
    ({
      item: {
        id,
        company,
        created_at,
        company_logo_url,
        profile_score,
        number_of_applications,
      },
    }) => (
      <Card
        onPress={navigate(RouteNames.jobDetails, { id })}
        style={{ marginHorizontal: 16 }}>
        <Card.Content>
          <List.Item
            title={
              <Subheading style={{ letterSpacing: 0 }}>{company}</Subheading>
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
                  uri: company_logo_url,
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
    ),
    [isHindi, navigate, theme.colors.placeholder, theme.colors.surface],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content
          title={
            isHindi ? 'मेरे द्वारा पोस्ट की गई नौकरियां' : 'Jobs posted by me'
          }
        />
      </Appbar>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetch} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    justifyContent: 'space-between',
  },
  jobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
});

export default ViewJobs;
