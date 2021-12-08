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
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAppContent from '../../../lib/useAppContent';
import { timeFromNow } from '../../../utils/dayjs';

type PropTypes = {
  loading: boolean,
  notifications: Array<Object>,
  fetch: Function,
};

const Notifications = ({
  notifications,
  loading,
  fetch,
}: PropTypes): React$Node => {
  const theme = useTheme();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar
        style={[styles.appbar, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction color={theme.colors.placeholder} onPress={goBack} />
        <Appbar.Content title={isHindi ? 'सूचनाएं' : 'Notifications'} />
      </Appbar>
      {console.log(notifications)}
      <FlatList
        data={notifications}
        renderItem={({ item: { title, body, created_at, type } }) => (
          <Card>
            <Card.Content>
              <List.Item
                title={<Title>{title}</Title>}
                description={
                  <Paragraph>
                    {body}
                    {'\n'}
                    <Caption>{timeFromNow(created_at)}</Caption>
                  </Paragraph>
                }
                left={(props) => {
                  switch (type) {
                    case 'INTERVIEW_SCHEDULED':
                    case 'INTERVIEW_ACCEPTED':
                    case 'INTERVIEW_REJECTED': {
                      return (
                        <Avatar.Image
                          {...props}
                          style={{
                            ...props.style,
                            backgroundColor: theme.colors.primary,
                          }}
                          source={require('../../../assets/images/icons/interview.png')}
                        />
                      );
                    }

                    case 'CALL_REQUESTED':
                    case 'CONTACT_DETAILS': {
                      return (
                        <Avatar.Image
                          {...props}
                          style={{
                            ...props.style,
                            backgroundColor: theme.colors.surface,
                          }}
                          source={require('../../../assets/images/icons/phone-call.png')}
                        />
                      );
                    }

                    case 'JOB_OFFERED': {
                      return (
                        <Avatar.Image
                          {...props}
                          style={{
                            ...props.style,
                            backgroundColor: theme.colors.surface,
                          }}
                          source={require('../../../assets/images/icons/005-congratulation.png')}
                        />
                      );
                    }

                    default:
                      return null;
                  }
                }}
                descriptionNumberOfLines={10}
                style={{ paddingHorizontal: 0 }}
              />
            </Card.Content>
          </Card>
        )}
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

export default Notifications;
