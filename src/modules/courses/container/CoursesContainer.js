// @flow
import React, { useCallback, useEffect, useState } from 'react';
import Courses from '../components/Courses';
import apiClient from '../../../utils/apiClient';

const CoursesContainer = (): React$Node => {
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState([]);

  const fetch = useCallback(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/courses');

        setCourses(data);

        console.log(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return <Courses loading={loading} courses={courses} fetch={fetch} />;
};

export default CoursesContainer;
