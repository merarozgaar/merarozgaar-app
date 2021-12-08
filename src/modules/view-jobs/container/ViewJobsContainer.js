// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import apiClient from '../../../utils/apiClient';
import ViewJobs from '../components/ViewJobs';

const ViewJobsContainer = () => {
  const isScreenFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState([]);

  const fetch = useCallback(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/employer/jobs');

        setJobs(data.reverse());
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    if (isScreenFocused) {
      fetch();
    }
  }, [fetch, isScreenFocused]);

  return <ViewJobs jobs={jobs} fetch={fetch} loading={loading} />;
};

export default ViewJobsContainer;
