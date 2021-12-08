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
import orderBy from 'lodash.orderby';
import useAppContent from '../../../lib/useAppContent';
import { RouteNames } from '../../../Navigator-v2';
import {
  formatCurrency,
  parseSalary,
  parseSalaryFrequency,
} from '../../../utils';

type PropTypes = {
  session: Object,
  results: Array<Object>,
};

const SearchResults = ({ results, session }: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const navigate = useCallback(
    (route, params = {}) =>
      () => {
        console.log(params);
        navigation.navigate(route, params);
      },
    [navigation],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  console.log(results);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content title={isHindi ? 'रिजल्ट्स' : 'Results'} />
      </Appbar>
      <FlatList
        data={orderBy(results, 'distance', 'asc')}
        renderItem={({
          item: {
            name,
            job_id,
            profile_picture_url,
            id,
            profession,
            employer_name,
            salary,
            salary_frequency,
            distance,
            avatar_url,
            locality,
            experiences = [],
            state,
            city,
          },
        }) => (
          <List.Item
            title={session.role === 'EMPLOYEE' ? profession : name}
            onPress={navigate(
              session.role === 'EMPLOYEE'
                ? RouteNames.jobDetails
                : RouteNames.employeeDetails,
              { id },
            )}
            description={
              session.role === 'EMPLOYER' ? (
                <>
                  {isHindi ? (
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
                  )}
                </>
              ) : (
                <Paragraph style={{ color: theme.colors.placeholder }}>
                  {employer_name},{' '}
                  {[locality, state].filter((c) => c).join(', ')}
                  {'\n'}
                  <Caption style={{ letterSpacing: 0 }}>
                    {formatCurrency(parseSalary(salary))}{' '}
                    {parseSalaryFrequency(salary_frequency, isHindi)}
                  </Caption>
                </Paragraph>
              )
            }
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{
                  uri:
                    session.role === 'EMPLOYEE'
                      ? avatar_url
                      : profile_picture_url,
                }}
                style={{
                  ...props.style,
                  backgroundColor: theme.colors.surface,
                }}
              />
            )}
            style={{ paddingHorizontal: 16 }}
          />
        )}
        keyExtractor={keyExtractor}
        // contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
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
});

export default SearchResults;
