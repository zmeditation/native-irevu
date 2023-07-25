import axios from 'axios';
import axiosApi from '../../config/api';
import { NOTIFICATION_ERROR, GET_NOTIFICATION_SUCCESS } from '../constants/notification.constants';

const profileError = (payload) => (dispatch) => {
	dispatch({ type: NOTIFICATION_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: NOTIFICATION_ERROR, payload: '' });
	}, 3000);
};

const getNotificationsSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_NOTIFICATION_SUCCESS, payload });
};

export const getNotification = (instance) => async (dispatch) => {
	instance.setState({ isLoading: true });
	axiosApi
		.post(`/notification/list`)
		.then((notificationRes) => {
			// console.log(`.then - notificationRes`, notificationRes);
			instance.setState({ isLoading: false });
			if (notificationRes.status === 200) {
				dispatch(getNotificationsSuccess(notificationRes.data.output));
			} else {
				dispatch(getNotificationsSuccess(notificationRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', notificationRes.data.error);
			}
		})
		.catch((error) => {
			console.log(`getNotification - error`, ...error);
			instance.setState({ isLoading: false });
			dispatch(profileError(error.message));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.message);
		});
};
export const sendNotification = (datas) => async () => {
	var config = {
		method: 'post',
		url: 'https://api.jpush.cn/v3/push',
		headers: {
			Authorization: 'Basic N2ZhOWFhNjRiNzhmYmFlZTFjODMwMzdjOmQ0NmUwYTdjNmVjNThkNGNkYjVmMGFmMQ==',
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(datas)
	};

	axios(config)
		.then(function(response) {
			console.log(JSON.stringify(response.data));
		})
		.catch(function(error) {
			console.log(error);
		});
};
