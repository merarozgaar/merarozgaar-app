// @flow
import React, { useCallback, useMemo } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import Settings from '../components/Settings';
import { signOut } from '../../../redux/modules/session';
import apiClient from '../../../utils/apiClient';
import useAppContent from '../../../lib/useAppContent';

const SettingsContainer = (): React$Node => {
  const dispatch = useDispatch();

  const { appContent, appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const onSwitchAccount = useCallback(() => {
    Alert.alert(
      'Switch account',
      'You need to sign out of your current account to switch.',
      [
        {
          style: 'cancel',
          text: 'No, thanks',
        },
        {
          text: 'Proceed',
          onPress: () => {
            dispatch(signOut());
          },
        },
      ],
    );
  }, [dispatch]);

  const onDeactivate = useCallback(() => {
    Alert.alert(
      isHindi ? 'डीएक्टिवेट' : 'Deactivate',
      isHindi
        ? 'क्या आप वाकई अपना खाता निष्क्रिय करना चाहते हैं? आपका खाता खोज परिणामों में नहीं दिखाई देगा। अपने खाते को पुनः सक्रिय करने के लिए आपको फिर से लॉगिन करना होगा।'
        : 'Are you sure you want to deactivate your account? Your account will not show in search results. You need to login again to reactivate your account.',
      [
        {
          style: 'cancel',
          text: isHindi ? 'जी नहीं, धन्यवाद' : 'No, thanks',
        },
        {
          text: isHindi ? 'जारी रखें' : 'Proceed',
          onPress: () => {
            console.log(1);
            (async () => {
              try {
                await apiClient.delete('/employee/profile');

                dispatch(signOut());
              } catch (e) {
                console.log(e);
              }
            })();
          },
        },
      ],
    );
  }, [dispatch, isHindi]);

  const onSignOut = useCallback(() => {
    Alert.alert(
      isHindi ? 'साइन आउट की पुष्टि करें' : 'Confirm sign out',
      isHindi
        ? 'क्या आप द्वारा साइन आउट किया जाना सुनिश्चित है?'
        : 'Are you sure you want to sign out?',
      [
        {
          style: 'cancel',
          text: isHindi ? 'ना' : 'No',
        },
        {
          text: isHindi ? 'हाँ' : 'Yes',
          onPress: () => {
            dispatch(signOut());

            // BackHandler.exitApp();
          },
        },
      ],
    );
  }, [dispatch]);

  return (
    <Settings
      onDeactivate={onDeactivate}
      onSwitchAccount={onSwitchAccount}
      onSignOut={onSignOut}
    />
  );
};

export default SettingsContainer;
