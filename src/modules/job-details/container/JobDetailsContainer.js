// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Alert, Vibration } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import JobDetails from '../components/JobDetails';
import apiClient from '../../../utils/apiClient';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../../../redux/selectors/session';
import { setNavigationState } from '../../../redux/modules/navigation';
import { RouteNames } from '../../../navigation/Navigator';
import {
  isSetLocationStateSelector,
  locationStateSelector,
} from '../../../redux/selectors/location';
import useGeolocation from '../../../lib/useGeolocation';
import useAppContent from '../../../lib/useAppContent';

const JobDetailsContainer = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const {
    params: {
      id,
      visible: visibleProp = false,
      isApplied = false,
      status,
      application_id,
    },
  } = useRoute();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const isScreenFocused = useIsFocused();

  const navigation = useNavigation();

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const { getLocationByPlaceID } = useGeolocation();

  const [loading, setLoading] = useState(true);

  const [job, setJob] = useState({});

  const [applications, setApplications] = useState([]);

  const [visible, setVisible] = useState(false);

  const [applying, setApplying] = useState(false);

  const timeout = useRef();

  const fetch = useCallback(
    (loading = true, callback) => {
      if (id) {
        (async () => {
          try {
            if (isSetLocation) {
              const { place_id } = location;

              const place = await getLocationByPlaceID(place_id);

              const {
                coordinates: { latitude, longitude },
              } = place;

              const { data } = await apiClient.get(`/jobs/${id}`, {
                params: {
                  ...(session.role === 'EMPLOYER'
                    ? {}
                    : { is_applied_by: session.id }),
                  // latitude,
                  // longitude,
                },
              });

              setJob(data);

              if (callback) {
                callback();
              }
            } else {
              Snackbar.show({
                text: 'Please enable location permission to find matching jobs.',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          } catch (e) {
            console.log(e);

            Vibration.vibrate();

            navigation.goBack();

            Snackbar.show({
              text: 'Something went wrong, try after sometime.',
              duration: Snackbar.LENGTH_LONG,
            });
          } finally {
            setLoading(false);
          }
        })();
      } else {
        Vibration.vibrate();

        navigation.goBack();

        Snackbar.show({
          text: 'Unable to find job, try after sometime.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    },
    [
      getLocationByPlaceID,
      id,
      isSetLocation,
      location,
      navigation,
      session.id,
      session.role,
    ],
  );

  const fetchApplications = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get(`/jobs/${id}/applications`);

        setApplications(data);
      } catch (e) {}
    })();
  }, [id]);

  const onApply = useCallback(() => {
    if (isLoggedIn) {
      setVisible(true);
    } else {
      dispatch(
        setNavigationState([RouteNames.jobDetails, { id, visible: true }]),
      );

      navigation.navigate(RouteNames.login);
    }
  }, [dispatch, id, isLoggedIn, navigation]);

  const onConfirmApply = useCallback(() => {
    (async () => {
      setApplying(true);

      try {
        await apiClient.post(`/jobs/${id}/apply`);

        fetch(false, () => {
          setVisible(false);

          timeout.current = setTimeout(() => {
            Snackbar.show({
              text: isHindi
                ? 'आपका आवेदन जमा किया गया है।'
                : 'Your application is submitted.',
              duration: Snackbar.LENGTH_LONG,
            });
          }, 1000);
        });
      } catch (e) {
        Vibration.vibrate();

        Snackbar.show({
          text: isHindi
            ? 'आवेदन जमा करने में असमर्थ, कृपया पुन: प्रयास करें।'
            : 'Unable to submit the application, please try again.',
          duration: Snackbar.LENGTH_LONG,
        });
      } finally {
        setApplying(false);
      }
    })();
  }, [fetch, id, isHindi]);

  const onWithdrawApplication = useCallback(() => {
    Alert.alert(
      isHindi ? 'प्रत्याहृत करना' : 'Withdraw',
      isHindi
        ? 'क्या आप वाकई अपना आवेदन वापस लेना चाहते हैं?'
        : 'Are you sure you want to withdraw your application?',
      [
        {
          style: 'cancel',
          text: isHindi ? 'ना' : 'No',
        },
        {
          text: isHindi ? 'हाँ' : 'Yes',
          onPress: () => {
            (async () => {
              try {
                await apiClient.put(`/applications/${application_id}`, {
                  status: 'CLOSED',
                });

                timeout.current = setTimeout(() => {
                  Snackbar.show({
                    text: isHindi
                      ? 'आपने अपना आवेदन वापस ले लिया है।'
                      : "You've withdrawn your application.",
                    duration: Snackbar.LENGTH_LONG,
                  });
                }, 1000);

                navigation.goBack();
              } catch (e) {
                Vibration.vibrate();

                Snackbar.show({
                  text: 'Unable to process application, try after sometime.',
                  duration: Snackbar.LENGTH_LONG,
                });
              }
            })();
          },
        },
      ],
    );
  }, [application_id, isHindi, navigation]);

  const onActivateDeactivateJob = useCallback(() => {
    (async () => {
      try {
        await apiClient.put(`/jobs/${id}/activate-deactivate`, {
          active: !job.active,
        });

        fetch(false, () => {
          setVisible(false);

          timeout.current = setTimeout(() => {
            Snackbar.show({
              text: `Your job is ${!job.active ? 'activated' : 'deactivated'}.`,
              duration: Snackbar.LENGTH_LONG,
            });
          }, 1000);
        });
      } catch (e) {
        Vibration.vibrate();

        Snackbar.show({
          text: 'Something went wrong, try after sometime.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    })();
  }, [fetch, id, job.active]);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();
    }
  }, [fetch, isScreenFocused]);

  useEffect(() => {
    if (isScreenFocused) {
      fetchApplications();
    }
  }, [fetchApplications, isScreenFocused]);

  useEffect(() => {
    if (isScreenFocused && visibleProp) {
      setVisible(true);
    }
  }, [isScreenFocused, visibleProp]);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [timeout]);

  return (
    <JobDetails
      loading={loading}
      session={session}
      job={job}
      applications={applications}
      visible={visible}
      applying={applying}
      isApplied={isApplied}
      status={status}
      fetchApplications={fetchApplications}
      onApply={onApply}
      onDismiss={onDismiss}
      onConfirmApply={onConfirmApply}
      onActivateDeactivateJob={onActivateDeactivateJob}
      onWithdrawApplication={onWithdrawApplication}
    />
  );
};

export default JobDetailsContainer;
