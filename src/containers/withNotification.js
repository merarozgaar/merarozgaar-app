// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { sessionLoggedInSelector } from '../redux/selectors/session';
import apiClient from '../utils/apiClient';
import {
  setNotificationCount,
  toggleNotificationRedirect,
} from '../redux/modules/app';
import { appNotificationCountSelector } from '../redux/selectors/app';

PushNotification.configure({
  popInitialNotification: true,
  requestPermissions: true,
});

const withNotification =
  (WrappedComponent: React$ComponentType<any>): React$ComponentType<any> =>
  (props: any) => {
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(sessionLoggedInSelector);

    const notificationCount = useSelector(appNotificationCountSelector);

    const [enabled, setEnabled] = useState(false);

    const subscribe = useCallback(
      (token) => {
        if (isLoggedIn) {
          (async () => {
            try {
              // console.log(token);

              await apiClient.put('/notifications/register', { token });
            } catch (e) {}
          })();
        }
      },
      [isLoggedIn],
    );

    useEffect(() => {
      (async () => {
        try {
          const authStatus = await messaging().requestPermission();

          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          PushNotification.createChannel({
            channelId: 'merarozgaar', // (required)
            channelName: 'Mera Rozgaar', // (required)/ (optional) default: undefined.
          });

          setEnabled(enabled);
        } catch (e) {}
      })();
    }, []);

    useEffect(() => {
      messaging().getToken().then(subscribe);

      return messaging().onTokenRefresh(subscribe);
    }, [subscribe]);

    useEffect(() => {
      if (enabled) {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          const {
            notification: { title, body },
            data = { id: 0 },
            messageId,
          } = remoteMessage;

          const details = {
            channelId: 'merarozgaar',
            messageId,
            title,
            id: data.id ?? 0,
            message: body,
            userInfo: data,
            priority: 'high',
          };

          dispatch(setNotificationCount(notificationCount + 1));

          PushNotification.localNotification(details);
        });

        return unsubscribe;
      }

      return () => {};
    }, [dispatch, enabled, notificationCount]);

    useEffect(() => {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        if (isLoggedIn) {
          dispatch(toggleNotificationRedirect(true));

          PushNotification.setApplicationIconBadgeNumber(0);

          PushNotification.removeAllDeliveredNotifications();

          dispatch(setNotificationCount(notificationCount + 1));
        }
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            if (isLoggedIn) {
              dispatch(toggleNotificationRedirect(true));

              dispatch(setNotificationCount(notificationCount + 1));

              PushNotification.setApplicationIconBadgeNumber(0);

              PushNotification.removeAllDeliveredNotifications();
            }
          }
        });
    }, [dispatch, isLoggedIn]);

    return <WrappedComponent {...props} />;
  };

export default withNotification;
