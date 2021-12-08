import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import store from '../redux/createStore';
import {
  sessionLoggedInSelector,
  sessionSelector,
} from '../redux/selectors/session';
//export const baseURL = 'http://3.109.116.29:3000/api/';
export const baseURL = 'https://api.merarozgaar.app/api';

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();

  const isLoggedIn = sessionLoggedInSelector(state);

  if (isLoggedIn) {
    const { token } = sessionSelector(state);

     //console.log(token);

    // console.log(config);

    return {
      ...config,
      headers: {
        Authorization: token,
      },
    };
  }
  return config;
}, Promise.reject);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    crashlytics().recordError(error);

    console.log(error);

    return Promise.reject(error);
  },
);

export default apiClient;
