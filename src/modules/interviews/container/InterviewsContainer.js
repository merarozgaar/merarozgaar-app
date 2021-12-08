// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Interviews from '../components/Interviews';
import apiClient from '../../../utils/apiClient';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { sessionSelector } from '../../../redux/selectors/session';
import Snackbar from 'react-native-snackbar';
import { Alert } from 'react-native';
import useAppContent from '../../../lib/useAppContent';

const InterviewsContainer = (): React$Node => {
  const session = useSelector(sessionSelector);

  const isScreenFocused = useIsFocused();

  const { appLanguage } = useAppContent();

  const isHindi = useMemo(() => appLanguage === 'HINDI', [appLanguage]);

  const [loading, setLoading] = useState(false);

  const [interviews, setInterviews] = useState([]);

  const fetch = useCallback(() => {
    (async () => {
      setLoading(true);

      try {
        const { data } = await apiClient.get('/interviews');

        setInterviews(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChangeStatus = useCallback(
    ({ id, ...payload }) =>
      () => {
        (async () => {
          try {
            const { status, employer_id, applicant_name, date, time } = payload;

            await apiClient.put(`/interviews/${id}`, payload);

            if (session.role === 'EMPLOYEE') {
              switch (status) {
                case 'CONFIRMED': {
                  await apiClient.put('/notifications', {
                    title: isHindi
                      ? 'इंटरव्यू आमंत्रण स्वीकार किया गया'
                      : 'Interview invitation accepted',
                    body: isHindi
                      ? `${date}, ${time} के लिए उम्मीदवार ${applicant_name} के साथ आपका इंटरव्यू कन्फर्म हो गया है। इंटरव्यू से 15 मिनट और 1 मिनट पहले आपको रिमाइंडर भेजा जाएगा।`
                      : `Your interview scheduled with candidate ${applicant_name} for ${date}, ${time} has been confirmed. Reminder will be sent to you 15 mins and 1 min prior to the interview.`,
                    user_id: employer_id,
                    type: 'INTERVIEW_ACCEPTED',
                  });

                  Snackbar.show({
                    text: isHindi
                      ? 'आपने इंटरव्यू आमंत्रण स्वीकार कर लिया है।'
                      : "You've accepted the interview invitation.",
                    duration: Snackbar.LENGTH_LONG,
                  });
                  break;
                }

                case 'REJECTED': {
                  await apiClient.put('/notifications', {
                    title: isHindi
                      ? 'इंटरव्यू आमंत्रण अस्वीकार किया गया'
                      : 'Interview invitation rejected',
                    body: isHindi
                      ? `${date}, ${time} के लिए निर्धारित आपका साक्षात्कार उम्मीदवार ${applicant_name} द्वारा अस्वीकार कर दिया गया है। कृपया किसी और को शॉर्टलिस्ट करें।`
                      : `Your interview scheduled for ${date}, ${time} has been rejected by candidate ${applicant_name}. Please shortlist someone else.`,
                    user_id: employer_id,
                    type: 'INTERVIEW_REJECTED',
                  });

                  Snackbar.show({
                    text: isHindi
                      ? 'आपने इंटरव्यू आमंत्रण को अस्वीकार कर दिया है।'
                      : "You've rejected the interview invitation.",
                    duration: Snackbar.LENGTH_LONG,
                  });
                  break;
                }

                case 'RESCHEDULE': {
                  await apiClient.put('/notifications', {
                    title: isHindi
                      ? 'इंटरव्यू पुनर्निर्धारण का अनुरोध किया गया'
                      : 'Interview reschedule requested',
                    body: isHindi
                      ? `${applicant_name} ने आपके साक्षात्कार आमंत्रण को फिर से निर्धारित करने का अनुरोध किया है।`
                      : `${applicant_name} has requested to reschedule your interview invitation.`,
                    user_id: employer_id,
                    type: 'INTERVIEW_SCHEDULED',
                  });

                  Snackbar.show({
                    text: isHindi
                      ? 'आपने इंटरव्यू को फिर से निर्धारित करने का अनुरोध किया है।'
                      : "You've requested to reschedule the interview.",
                    duration: Snackbar.LENGTH_LONG,
                  });
                  break;
                }

                default:
                  break;
              }
            }

            fetch();
          } catch (e) {
            Snackbar.show({
              text: 'Something went wrong, try after sometime.',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })();
      },
    [fetch, isHindi, session.role],
  );

  const onRequestCall = useCallback(
    (item) => () => {
      (async () => {
        try {
          const { applicant_name, employer_id } = item;

          await apiClient.put('/notifications', {
            title: isHindi ? 'कॉल करने का अनुरोध किया हैं' : 'Call requested',
            body: isHindi
              ? `उम्मीदवार ${applicant_name} ने आपको इस मोबाइल नंबर ${session.dial_code}${session.mobile_number} पर कॉल करने का अनुरोध किया है।`
              : `Job seeker ${applicant_name} has requested you to call on mobile number ${session.dial_code}${session.mobile_number}.`,
            user_id: employer_id,
            type: 'CALL_REQUESTED',
          });

          Alert.alert(
            isHindi
              ? 'कांटेक्ट डिटेल्स शेयर की गई है।'
              : 'Contact details shared',
            isHindi
              ? 'आपका मोबाइल नंबर नियोक्ता के साथ साझा किया जाता है। आपको कॉल रिसीव हो सकती है।'
              : 'Your mobile number is shared with the employer. You may receive a call.',
            [
              {
                style: 'cancel',
                text: isHindi ? 'ठीक है' : 'Ok',
              },
            ],
          );
        } catch (e) {}
      })();
    },
    [isHindi, session.dial_code, session.mobile_number],
  );

  useEffect(() => {
    if (isScreenFocused) {
      fetch();
    }
  }, [fetch, isScreenFocused]);

  return (
    <Interviews
      loading={loading}
      session={session}
      interviews={interviews}
      fetch={fetch}
      onChangeStatus={onChangeStatus}
      onRequestCall={onRequestCall}
    />
  );
};

export default InterviewsContainer;
