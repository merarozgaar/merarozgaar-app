// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import RtcEngine from 'react-native-agora';
import { AGORA_APP_ID } from '@env';
import { useNavigation, useRoute } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import VideoCall from '../components/VideoCall';
import apiClient from '../../../utils/apiClient';
import { useSelector } from 'react-redux';
import { sessionSelector } from '../../../redux/selectors/session';
import useAppContent from '../../../lib/useAppContent';
//
// const channelName = 'hello-world';

const VideoCallContainer = () => {
  const {
    params: { id },
  } = useRoute();

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const session = useSelector(sessionSelector);

  const engine = useRef();

  const [step, setStep] = useState(1);

  const [peers, setPeers] = useState([]);

  const [config, setConfig] = useState({});

  const [countdown, setCountdown] = useState(900);

  const [loading, setLoading] = useState(false);

  const init = useCallback(() => {
    (async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          engine.current = await RtcEngine.create(AGORA_APP_ID);

          await engine.current.enableVideo();

          if (engine.current) {
            engine.current.addListener('Warning', (err) => {
              console.log(err);
            });

            engine.current.addListener('Error', (err) => {
              console.log(1, err);
            });

            engine.current.addListener('UserJoined', (uid) => {
              setPeers((state) =>
                state.includes(uid) ? state : [...state, uid],
              );
            });

            engine.current.addListener('JoinChannelSuccess', (channel) => {
              setStep(2);
            });
          }
        }
      } catch (e) {}
    })();
  }, []);

  const start = useCallback(() => {
    (async () => {
      setLoading(true);

      try {
        const {
          data: { token, channel_name, uid },
        } = await apiClient.post(`/interviews/${id}/request_to_join`);

        if (engine.current) {
          await engine.current.joinChannel(token, channel_name, null, uid);

          const {
            data: { resourceId, sid },
          } = await apiClient.post(`/interviews/${id}/start`, {
            token,
          });

          setConfig({ channel_name, uid, resource_id: resourceId, sid });

          setStep(2);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const end = useCallback(() => {
    (async () => {
      try {
        if (engine.current) {
          await engine.current.leaveChannel();

          setStep(3);

          const { data } = await apiClient.post(
            `/interviews/${id}/stop`,
            config,
          );

          setPeers([]);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [config, id]);

  const hangup = useCallback(() => {
    Alert.alert(
      isHindi ? 'साक्षात्कार छोड़ें?' : 'Leave interview?',
      isHindi
        ? 'क्या आप इस साक्षात्कार को छोड़ना चाहते हैं?'
        : 'Do you want to leave this interview?',
      [
        {
          text: isHindi ? 'मत छोड़ो' : "Don't leave",
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: isHindi ? 'छोड़ो' : 'Leave',
          style: 'destructive',
          onPress: () => {
            end();
          },
        },
      ],
    );
  }, [end, isHindi]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (step !== 2) {
        return;
      }

      e.preventDefault();

      console.log(step);

      // Prompt the user before leaving the screen
      Alert.alert(
        isHindi ? 'साक्षात्कार छोड़ें?' : 'Leave interview?',
        isHindi
          ? 'क्या आप इस साक्षात्कार को छोड़ना चाहते हैं?'
          : 'Do you want to leave this interview?',
        [
          {
            text: isHindi ? 'मत छोड़ो' : "Don't leave",
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: isHindi ? 'छोड़ो' : 'Leave',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      );
    });
  }, [isHindi, navigation, step]);

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setCountdown((state) => (state === 0 ? 0 : state - 1));
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    return () => {};
  }, [step]);

  useEffect(() => {
    if (countdown === 60) {
      Snackbar.show({
        text: isHindi
          ? 'यह इंटरव्यू 1 मिनट में खत्म हो जाएगा।'
          : 'This interview will end in 1 minute.',
        duration: Snackbar.LENGTH_LONG,
      });
    }

    if (countdown === 0) {
      end();
    }
  }, [countdown, end, isHindi]);

  return (
    <VideoCall
      session={session}
      step={step}
      peers={peers}
      countdown={countdown}
      loading={loading}
      channelName={config.channel_name}
      start={start}
      hangup={hangup}
    />
  );
};

export default VideoCallContainer;
