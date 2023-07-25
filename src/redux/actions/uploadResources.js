import axiosApi from '../../config/api';
import {
	IMAGE_UPLOAD_SUCCESS,
	VIDEO_UPLOAD_SUCCESS,
	UPLOAD_RESOURCES_ERROR,
	DOCUMENT_UPLOAD_SUCCESS
} from '../constants/uploadResources.constants';

const uploadResourcesError = (payload) => (dispatch) => {
	dispatch({ type: UPLOAD_RESOURCES_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: UPLOAD_RESOURCES_ERROR, payload: '' });
	}, 3000);
};

const uploadImageSuccess = (payload) => async (dispatch) => {
	dispatch({ type: IMAGE_UPLOAD_SUCCESS, payload });
};

const uploadVideoSuccess = (payload) => async (dispatch) => {
	dispatch({ type: VIDEO_UPLOAD_SUCCESS, payload });
};

const uploadDocumentSuccess = (payload) => async (dispatch) => {
	dispatch({ type: DOCUMENT_UPLOAD_SUCCESS, payload });
};

export const uploadResources = (instance, formData, resourceType) => async (dispatch) => {
	axiosApi({
		method: 'POST',
		url: 'upload/docs', // upload-files // /upload/docs // user/mobile-upload-file
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then((uploadResponse) => {
		console.log('uploadResponse', uploadResponse, '//');
		instance.setState({ isLoading: false });
		if (resourceType === 'image') {
			dispatch(uploadImageSuccess(uploadResponse.data.output));
		} else if (resourceType === 'video') {
			dispatch(uploadVideoSuccess(uploadResponse.data.output));
		} else if (resourceType === 'document') {
			dispatch(uploadDocumentSuccess(uploadResponse.data.output));
		}
	}).catch((error) => {
		console.log(error.response, 'rr');
		instance.setState({ isLoading: false });
		dispatch(uploadResourcesError(error.response.data));
		instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.message);
	});
};

export const clearUploadResources = () => (dispatch) => {
	dispatch(uploadImageSuccess(''));
	dispatch(uploadVideoSuccess(''));
};
