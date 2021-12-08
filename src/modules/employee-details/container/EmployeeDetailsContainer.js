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
import EmployeeDetails from '../components/EmployeeDetails';
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

const EmployeeDetailsContainer = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(sessionLoggedInSelector);

  const session = useSelector(sessionSelector);

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const {
    params: {
      id,
      visible: visibleProp = false,
      applicantView = false,
      applicationID,
      status,
    },
  } = useRoute();

  const isScreenFocused = useIsFocused();

  const location = useSelector(locationStateSelector);

  const isSetLocation = useSelector(isSetLocationStateSelector);

  const navigation = useNavigation();

  const { getLocationByPlaceID } = useGeolocation();

  const [loading, setLoading] = useState(true);

  const [job, setJob] = useState({});

  const [application, setApplication] = useState({});

  const [visible, setVisible] = useState(false);

  const [applying, setApplying] = useState(false);

  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);

  const [contactDetails, setContactDetails] = useState({});

  const timeout = useRef();

  const fetch = useCallback(
    (loading = true, callback) => {
      if (id) {
        setLoading(loading);

        (async () => {
          try {
            if (isSetLocation) {
              const { place_id } = location;

              const place = await getLocationByPlaceID(place_id);

              const {
                coordinates: { latitude, longitude },
              } = place;

              const { data } = await apiClient.get(`/candidates/${id}`, {
                params: {
                  ...(session.role === 'EMPLOYEE'
                    ? { is_applied_by: session.id }
                    : {}),
                  latitude,
                  longitude,
                },
              });

              setJob(data);
            } else {
              const { data } = await apiClient.get(`/candidates/${id}`, {
                params: {
                  ...(session.role === 'EMPLOYEE'
                    ? { is_applied_by: session.id }
                    : {}),
                },
              });

              setJob(data);
            }
            if (callback) {
              callback();
            }
          } catch (e) {
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

  const fetchApplication = useCallback(() => {
    if (applicantView) {
      (async () => {
        try {
          const { data } = await apiClient.get(
            `/applications/${applicationID}`,
          );

          setApplication(data);
        } catch (e) {}
      })();
    }
  }, [applicantView, applicationID]);

  const onContinue = useCallback(() => {
    if (isLoggedIn) {
      setVisible(true);
    } else {
      dispatch(
        setNavigationState([RouteNames.jobDetails, { id, visible: true }]),
      );

      navigation.navigate(RouteNames.login);
    }
  }, [dispatch, id, isLoggedIn, navigation]);

  const onUpdateApplication = useCallback(
    (status) => () => {
      (async () => {
        try {
          await apiClient.put(`/applications/${applicationID}`, { status });

          setVisible(false);

          fetchApplication();

          if (status === 'HIRED') {
            await apiClient.put('/notifications', {
              title: isHindi ? 'बधाई हो' : 'Congratulations',
              body: isHindi
                ? `नमस्ते ${job.name}, ${session.name} ने आपको जॉब ऑफर की है।`
                : `Hi ${job.name}, ${session.name} has offered you a job.`,
              user_id: id,
              type: 'JOB_OFFERED',
            });
          }

          // timeout.current = setTimeout(() => {
          //   Snackbar.show({
          //     text: 'Your application is updated.',
          //     duration: Snackbar.LENGTH_LONG,
          //   });
          // }, 1000);
        } catch (e) {
          Vibration.vibrate();

          Snackbar.show({
            text: 'Unable to process application, try after sometime.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })();
    },
    [applicationID, fetchApplication, id, isHindi, job.name, session.name],
  );

  const onRequestContact = useCallback(() => {
    (async () => {
      setApplying(true);

      try {
        const { data } = await apiClient.post(
          `/candidates/${id}/request-contact`,
          { user_id: id, isHindi },
        );

        setContactDetails(data);

        if (applicantView) {
          onUpdateApplication('SCREENING')();

          await apiClient.put('/notifications', {
            title: isHindi ? 'कांटेक्ट डिटेल्स' : 'Contact details',
            body: isHindi
              ? `${job.name} का संपर्क विवरण यहां दिया गया है, मोबाइल नंबर ${data.dial_code}${data.mobile_number}।`
              : `Here's the contact details of ${job.name}, mobile number ${data.dial_code}${data.mobile_number}.`,
            user_id: session.id,
            type: 'CONTACT_DETAILS',
          });

          setVisible(false);
        }

        setShowDetailsConfirmation(true);
      } catch (e) {
      } finally {
        setApplying(false);
      }
    })();
  }, [applicantView, id, isHindi, job.name, onUpdateApplication, session.id]);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const hideDetailsConfirmation = useCallback(() => {
    setShowDetailsConfirmation(false);
  }, []);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();
    }
  }, [fetch, isScreenFocused]);

  useEffect(() => {
    if (isScreenFocused) {
      fetchApplication();
    }
  }, [fetchApplication, isScreenFocused]);

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

  console.log(job);

  return (
    <EmployeeDetails
      loading={loading}
      profile={job}
      applicantView={applicantView}
      visible={visible}
      applying={applying}
      application={application}
      status={status}
      contactDetails={contactDetails}
      showDetailsConfirmation={showDetailsConfirmation}
      onContinue={onContinue}
      onDismiss={onDismiss}
      onUpdateApplication={onUpdateApplication}
      onRequestContact={onRequestContact}
      hideDetailsConfirmation={hideDetailsConfirmation}
      setShowDetailsConfirmation={setShowDetailsConfirmation}
    />
  );
};

export default EmployeeDetailsContainer;
