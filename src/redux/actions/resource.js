import axiosApi from '../../config/api';
import {
	RESOURCE_ERROR,
	ADD_RESOURCE_SUCCESS,
	GET_OTHERS_RESOURCE_SUCCESS,
	GET_RESOURCE_SUCCESS,
	REMOVE_RESOURCE_SUCCESS,
	SEARCH_RESOURCE_SUCCESS
} from '../constants/resource.constants';

const resourcesError = (payload) => (dispatch) => {
	dispatch({ type: RESOURCE_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: RESOURCE_ERROR, payload: '' });
	}, 3000);
};

const addResourceSuccess = (payload) => (dispatch) => {
	dispatch({ type: ADD_RESOURCE_SUCCESS, payload });
};

export const addResource = (instance, resourceDetail) => async (dispatch) => {
	axiosApi
		.post(`/resource/add`, { ...resourceDetail })
		.then((addResourceRes) => {
			console.log(addResourceRes,'addResourceRes');
			if (addResourceRes.status === 200) {
				dispatch(addResourceSuccess(addResourceRes.data.output));
			} else {
				dispatch(resourcesError(addResourceRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', addResourceRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(resourcesError(error.response.data.error));
		});
};

const getOtherResourceSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_OTHERS_RESOURCE_SUCCESS, payload });
};

export const getOtherResource = (instance) => async (dispatch) => {
	axiosApi
		.get(`/resource/get-other-students-list`)
		.then((getOtherResourceRes) => {
			console.log(`.then - getOtherResourceRes`, getOtherResourceRes);
			if (getOtherResourceRes.status === 200) {
				dispatch(getOtherResourceSuccess(getOtherResourceRes.data.output));
			} else {
				dispatch(resourcesError(getOtherResourceRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', getOtherResourceRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(resourcesError(error.response.data.error));
		});
};

const getResourceSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_RESOURCE_SUCCESS, payload });
};

export const getResource = (instance) => async (dispatch) => {
	axiosApi
		.post(`/resource/get-list`)
		.then((getResourceRes) => {
			if (getResourceRes.status === 200) {
				dispatch(getResourceSuccess(getResourceRes.data.output));
			} else {
				dispatch(resourcesError(getResourceRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', getResourceRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(resourcesError(error.response.data.error));
		});
};

const removeResourceSuccess = (payload) => (dispatch) => {
	dispatch({ type: REMOVE_RESOURCE_SUCCESS, payload });
};

export const removeResource = (instance, id) => async (dispatch) => {
	axiosApi
		.post(`/resource/delete`, { id })
		.then((removeResourceRes) => {
			if (removeResourceRes.status === 200) {
				console.log('remove succeee', removeResourceRes.data.output);
				dispatch(removeResourceSuccess(removeResourceRes.data.output.id));
				instance.dropDownAlertRef.alertWithType('success', 'Success', 'Resource removed successfully');
			} else {
				dispatch(resourcesError(removeResourceRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', removeResourceRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(resourcesError(error.response.data.error));
		});
};

const searchResourceSuccess = (payload) => (dispatch) => {
	dispatch({ type: SEARCH_RESOURCE_SUCCESS, payload });
};

export const searchResource = (instance, search) => async (dispatch) => {
	axiosApi
		.get(`/resource/search?search=${search}`)
		.then((searchResourceRes) => {
			if (searchResourceRes.status === 200) {
				console.log('search result out put', searchResourceRes.data.output);
				dispatch(searchResourceSuccess(searchResourceRes.data.output));
			} else {
				dispatch(resourcesError(searchResourceRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', searchResourceRes.data.error);
			}
		})
		.catch((error) => {
			console.log('searhc resource --->>>', { error });
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(resourcesError(error.response.data.message));
		});
};
