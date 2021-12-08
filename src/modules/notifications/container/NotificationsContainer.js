// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import Notifications from '../components/Notifications';
import apiClient from '../../../utils/apiClient';
import { setNotificationCount } from '../../../redux/modules/app';

const NotificationsContainer = (): React$Node => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const fetch = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/notifications');

        setNotifications(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    dispatch(setNotificationCount(0));

    PushNotification.removeAllDeliveredNotifications();

    PushNotification.setApplicationIconBadgeNumber(0);
  }, [dispatch]);

  return (
    <Notifications
      loading={loading}
      notifications={notifications}
      fetch={fetch}
    />
  );
};

export default NotificationsContainer;
