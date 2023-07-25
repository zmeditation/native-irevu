import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const axiosApi = axios.create({
  baseURL: 'http://api.irevu.org/'
});

export const setAuthHeader = async (token = false) => {
  const localToken =
    token || ((await AsyncStorage.getItem('token')) ? `${JSON.parse(await AsyncStorage.getItem('token'))}` : '');

  console.log(localToken);

  axiosApi.defaults.headers.Authorization = localToken;
};
setAuthHeader();
// if a 401 happens, the user will be logged out
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error && error.response && error.response.status === 401) {
      // eslint-disable-next-line no-console
      console.log('error -=-=-=-', error.response);
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }]
      });
      // useDispatch(authTokenExpired());
    }
    return Promise.reject(error);
  }
);
// Set the initial header from storage or something (should surround with try catch in actual app)

export default axiosApi;
