// @flow
import React, { Fragment, useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, Button, Card, Paragraph, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../navigation/Navigator';
import dayjs from 'dayjs';
import useAppContent from '../../../lib/useAppContent';

type PropTypes = {
  interviews: Array<Object>,
  session: Object,
  loading: boolean,
  fetch: Function,
  onChangeStatus: Function,
  onRequestCall: Function,
};

const Interviews = ({
  interviews,
  session,
  loading,
  fetch,
  onChangeStatus,
  onRequestCall,
}: PropTypes): React$Node => {
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

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  console.log(interviews);

  const renderContent = useCallback(
    ({ applicant_name, profession, employer_name, date, time, job_id }) => {
      switch (session.role) {
        case 'EMPLOYEE':
          return isHindi ? (
            <Fragment>
              <Paragraph>
                <Paragraph style={{ color: theme.colors.primary }}>
                  {employer_name}
                </Paragraph>{' '}
                में{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {profession}
                </Paragraph>{' '}
                के लिए आपका ऑनलाइन इंटरव्यू{' '}
                {dayjs(`${date} ${time}`).format('DD/MM/YYYY, hh:mm A')} को
                निर्धारित किया गया है।
              </Paragraph>
              <View style={{}}>
                <Button
                  uppercase={false}
                  onPress={navigate(RouteNames.jobDetails, { id: job_id })}
                  style={{ marginVertical: 16, style: theme.colors.primary }}
                  labelStyle={{ letterSpacing: 0 }}>
                  {isHindi
                    ? 'नौकरी विवरण देखने के लिए क्लिक करें'
                    : 'Click to view job details'}
                </Button>
              </View>
            </Fragment>
          ) : (
            <Fragment>
              <Paragraph>
                Your online interview for{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {profession}
                </Paragraph>{' '}
                at{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {employer_name}
                </Paragraph>{' '}
                has been scheduled at{' '}
                {dayjs(`${date} ${time}`).format('DD/MM/YYYY, hh:mm A')}.
              </Paragraph>
              <View style={{}}>
                <Button
                  uppercase={false}
                  onPress={navigate(RouteNames.jobDetails, { id: job_id })}
                  style={{ marginVertical: 16, style: theme.colors.primary }}
                  labelStyle={{ letterSpacing: 0 }}>
                  Click to view job details
                </Button>
              </View>
            </Fragment>
          );

        case 'EMPLOYER':
          return isHindi ? (
            <Fragment>
              <Paragraph>
                <Paragraph style={{ color: theme.colors.primary }}>
                  {applicant_name}
                </Paragraph>{' '}
                के साथ इंटरव्यू{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {dayjs(`${date} ${time}`).format('DD MMMM YYYY, hh:mm A')}
                </Paragraph>{' '}
                पर निर्धारित है।
              </Paragraph>
            </Fragment>
          ) : (
            <Fragment>
              <Paragraph>
                Interview with{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {applicant_name}
                </Paragraph>
                is scheduled at{' '}
                <Paragraph style={{ color: theme.colors.primary }}>
                  {dayjs(`${date} ${time}`).format('DD MMMM YYYY, hh:mm A')}
                </Paragraph>
                .
              </Paragraph>
            </Fragment>
          );

        default:
          return null;
      }
    },
    [isHindi, navigate, session.role, theme.colors.primary],
  );

  const renderActions = useCallback(
    (item) => {
      const { status, id, date, time } = item;

      if (session.role === 'EMPLOYEE') {
        switch (status) {
          case 'PENDING': {
            return (
              <Card.Actions
                style={{ paddingBottom: 16, paddingHorizontal: 16 }}>
                <Button
                  mode="outlined"
                  onPress={onChangeStatus({
                    ...item,
                    status: 'CONFIRMED',
                  })}
                  style={{ flex: 1 }}
                  labelStyle={{ letterSpacing: 0 }}
                  uppercase={false}>
                  {isHindi ? 'एक्सेप्ट' : 'Accept'}
                </Button>
                <View style={{ width: 8 }} />
                <Button
                  mode="outlined"
                  onPress={onRequestCall(item)}
                  labelStyle={{ letterSpacing: 0 }}
                  style={{ flex: 1 }}
                  uppercase={false}>
                  {isHindi ? 'कॉल का अनुरोध' : 'Request Call'}
                </Button>
                <View style={{ width: 8 }} />
                <Button
                  mode="outlined"
                  onPress={onChangeStatus({
                    ...item,
                    status: 'REJECTED',
                  })}
                  labelStyle={{ letterSpacing: 0 }}
                  style={{ flex: 1 }}
                  uppercase={false}>
                  {isHindi ? 'रिजेक्ट' : 'Reject'}
                </Button>
              </Card.Actions>
            );
          }

          case 'CONFIRMED': {
            return (
              <Card.Actions
                style={{ paddingBottom: 16, paddingHorizontal: 16 }}>
                <Button
                  mode="outlined"
                  onPress={navigate(RouteNames.videoCall, { id })}
                  labelStyle={{ letterSpacing: 0 }}
                  uppercase={false}
                  disabled={
                    !(
                      dayjs(`${date} ${time}`).isSame(dayjs(), 'date') &&
                      dayjs(`${date} ${time}`).isSame(dayjs(), 'hour')
                    )
                  }
                  style={{ flex: 1 }}>
                  {isHindi ? 'जॉइन नाउ' : 'Join now'}
                </Button>
                <View style={{ width: 8 }} />
                <Button
                  mode="outlined"
                  onPress={navigate(RouteNames.courses)}
                  labelStyle={{ letterSpacing: 0 }}
                  uppercase={false}
                  style={{ flex: 1 }}>
                  {isHindi ? 'इंटरव्यू टिप्स' : 'Interview Tips'}
                </Button>
              </Card.Actions>
            );
          }

          default:
            return <Card.Actions />;
        }
      } else {
        switch (status) {
          case 'PENDING':
          case 'RESCHEDULE': {
            return <Card.Actions />;
          }

          case 'CONFIRMED': {
            return (
              <Card.Actions>
                <Button
                  onPress={navigate(RouteNames.videoCall, { id })}
                  labelStyle={{ letterSpacing: 0 }}
                  uppercase={false}>
                  {isHindi ? 'जॉइन नाउ' : 'Join now'}
                </Button>
              </Card.Actions>
            );
          }

          default:
            return <Card.Actions />;
        }
      }
    },
    [isHindi, navigate, onChangeStatus, onRequestCall, session.role],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Card onPress={navigate(RouteNames.jobDetails, { id: item.job_id })}>
        <Card.Content>{renderContent(item)}</Card.Content>
        {renderActions(item)}
      </Card>
    ),
    [navigate, renderActions, renderContent],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content title={isHindi ? 'इंटरव्यू' : 'Interviews'} />
      </Appbar>
      <FlatList
        data={interviews}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingHorizontal: 16 }}
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
    elevation: 0,
  },
  separator: {
    height: 16,
  },
});

export default Interviews;
