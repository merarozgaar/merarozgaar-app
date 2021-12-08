// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Vibration } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import ViewCourse from '../components/ViewCourse';
import apiClient, { baseURL } from '../../../utils/apiClient';
import type { FormConfig } from '../../../lib/useForm';
import useForm from '../../../lib/useForm';
import { setProfile } from '../../../redux/modules/profile';
import { sessionSelector } from '../../../redux/selectors/session';

const ViewCourseContainer = () => {
  const dispatch = useDispatch();

  const {
    params: { id, badge_id },
  } = useRoute();

  const session = useSelector(sessionSelector);

  const isScreenFocused = useIsFocused();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState({});

  const [currentStep, setCurrentStep] = useState(1);

  const [calculating, setCalculating] = useState(false);

  const [isPassed, setIsPassed] = useState(false);

  const formConfig: FormConfig = {
    initialValues: {
      answers: [],
    },
    validations: {},
    onSubmit: ({ answers }) => {
      (async () => {
        try {
          setCalculating(true);

          const total = answers.filter(({ correct }) => correct).length;

          const cutoff = Math.ceil((course.questions || []).length / 2);

          const passed = total >= cutoff;

          setIsPassed(passed);

          if (passed) {
            await apiClient.put('/courses/update_score', {
              score: badge_id,
            });

            const { data } = await apiClient.get('/employee/profile');

            dispatch(setProfile(data));
          }

          setCurrentStep(3);
        } catch (e) {
          Vibration.vibrate();

          Snackbar.show({
            text: 'Something went wrong, try after sometime.',
            duration: Snackbar.LENGTH_LONG,
          });
        } finally {
          setCalculating(false);
        }
      })();
    },
  };

  const formProps = useForm(formConfig);

  const fetchCourse = useCallback(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/courses/${id}`);

          setCourse(data);

          setLoading(false);
        } catch (e) {
          Vibration.vibrate();

          navigation.goBack();

          Snackbar.show({
            text: 'Something went wrong, try after sometime.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })();
    }
  }, [id, navigation]);

  const onContinue = useCallback(() => {
    setCurrentStep((state) => (state !== 3 ? state + 1 : state));
  }, []);

  const downloadCertificate = useCallback(() => {
    (async () => {
      try {
        if (Platform.OS == 'ios'){
        let dirs = RNFetchBlob.fs.dirs.PictureDir
        console.log(dirs, 'document path');
        RNFetchBlob.config({    
          fileCache: true,
          path: dirs + `/${Date.now()}.jpeg`,
        })
          .fetch(
            'GET',
            `${baseURL}/media/certificate`,
            {
              Authorization: session.token ?? '',
            },
          )
          .then(res => {

            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log(`The file saved to ${JSON.stringify(res)}--->>>${session.token}`);
          })
          .catch ((errorMessage, statusCode) => {
            console.log(`The file saved to ${errorMessage}--->>>${statusCode}`);
          });
        }else{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const res = await RNFetchBlob.config({
            path: `${RNFetchBlob.fs.dirs.DownloadDir}/${Date.now()}`,
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              title: `${Date.now()}`,
              description: 'Downloaded!',
              mime: 'image/jpeg',
              mediaScannable: true,
            },
          }).fetch('GET', `${baseURL}/media/certificate`, {
            Authorization: session.token ?? '',
          });

          console.log(res.path());
        }
      }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [session.token]);

  useEffect(() => {
    if (isScreenFocused) {
      fetchCourse();
    }
  }, [fetchCourse, isScreenFocused]);

  return (
    <ViewCourse
      {...formProps}
      loading={loading}
      course={course}
      calculating={calculating}
      badgeCount={badge_id}
      currentStep={currentStep}
      isPassed={isPassed}
      onContinue={onContinue}
      downloadCertificate={downloadCertificate}
    />
  );
};

export default ViewCourseContainer;
