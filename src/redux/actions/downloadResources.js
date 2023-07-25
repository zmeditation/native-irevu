import axiosApi from '../../config/api';
import { DOWNLOAD_RESULT_SUCCESS, DOWNLOAD_RESULT_ERROR } from '../constants/downloadResources.constants';

const downloadResourcesError = (payload) => (dispatch) => {
	dispatch({ type: DOWNLOAD_RESULT_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: DOWNLOAD_RESULT_ERROR, payload: '' });
	}, 3000);
};

const downloadResultSuccess = (payload) => (dispatch) => {
	dispatch({ type: DOWNLOAD_RESULT_SUCCESS, payload });

	// setTimeout(() => {
	//     dispatch({ type: DOWNLOAD_RESULT_SUCCESS, payload: [] });
	// }, 8000);
};

export const getCheckedHomeworkPDF = (instance, paramValue) => async (dispatch) => {
	axiosApi
		.post(`/homework/download-checked-homework`, { ...paramValue })
		.then((downloadRes) => {
			if (downloadRes.status === 200) {
				dispatch(downloadResultSuccess(downloadRes.data.output));
			} else {
				dispatch(downloadResourcesError(downloadRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', downloadRes.data.error);
			}
		})
		.catch((error) => {
			console.log(`getCheckedHomeworkPDF - error.response`, error.response);
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.message);
			dispatch(downloadResourcesError(error.response.data.error));
		});
};
