// @flow
import React, { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScheduleInterview from '../components/ScheduleInterview';
import type { FormConfig } from '../../../lib/useForm';
import useForm from '../../../lib/useForm';
import apiClient from '../../../utils/apiClient';
import Snackbar from 'react-native-snackbar';
import { Vibration } from 'react-native';
import useAppContent from '../../../lib/useAppContent';

const ScheduleInterviewContainer = () => {
  const { params } = useRoute();

  const { applicationID, interview } = params;

  const navigation = useNavigation();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const formConfig: FormConfig = {
    initialValues: {
      time: interview?.time ?? '',
      date: interview?.date ?? '',
    },
    validations: {},
    onSubmit: ({ date, time }) => {
      setLoading(true);

      (async () => {
        try {
          if (interview?.id) {
            await apiClient.put(`/interviews/${interview.id}`, {
              date,
              time,
              status: 'PENDING',
            });
          } else {
            const payload = {
              application_id: applicationID,
              date,
              time,
              isHindi,
            };

            console.log(1, payload);

            await apiClient.post(
              `/applications/${applicationID}/schedule`,
              payload,
            );
          }

          Snackbar.show({
            text: 'Your online interview is scheduled now.',
            duration: Snackbar.LENGTH_LONG,
          });

          navigation.goBack();
        } catch (e) {
          console.log(e.response);

          Vibration.vibrate();

          Snackbar.show({
            text: 'Something went wrong, try after sometime.',
            duration: Snackbar.LENGTH_LONG,
          });
        } finally {
          setLoading(false);
        }
      })();
    },
  };

  const formProps = useForm(formConfig);

  return <ScheduleInterview {...formProps} loading={loading} />;
};

export default ScheduleInterviewContainer;
