import axiosApi from '../../config/api';
import {
	PROFILE_ERROR,
	EDIT_PROFILE_SUCCESS,
	GET_PROFILE_SUCCESS,
	GET_PERFORMANCE_DETAIL_SUCCESS,
	GET_STUDENT_PERFORMANCE_DETAIL,
	GET_TEACHER_PERFORMANCE_DETAIL
} from '../constants/profile.constants';
import { userType } from '../../utils/constants';
import { auth } from '../types';

const profileError = (payload) => (dispatch) => {
	dispatch({ type: PROFILE_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: PROFILE_ERROR, payload: '' });
	}, 3000);
};

const getProfileDetailSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_PROFILE_SUCCESS, payload });
};

export const getProfileDetail = (instance) => async (dispatch) => {
	axiosApi
		.get(`/profile`)
		.then((profileDetailRes) => {
			instance.setState({ isLoading: false });
			if (profileDetailRes.status === 200) {
				dispatch(getProfileDetailSuccess(profileDetailRes.data.output));
			} else {
				dispatch(getProfileDetailSuccess(profileDetailRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', profileDetailRes.data.error);
			}
		})
		.catch((error) => {
			instance.setState({ isLoading: false });
			dispatch(profileError(error.response.data.error));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const editProfileDetailSuccess = (payload) => (dispatch) => {
	dispatch({ type: EDIT_PROFILE_SUCCESS, payload });
};
const updateUser = (payload) => (dispatch) => {
	dispatch({ type: auth.AUTHENTICATED, payload });
};

export const editProfileDetail = (instance, profileDetails) => async (dispatch) => {
	axiosApi
		.post(`/profile/update`, { ...profileDetails })
		.then((profileDetailRes) => {
			instance.setState({ isLoading: false });
			if (profileDetailRes.status === 200) {
				dispatch(editProfileDetailSuccess(profileDetailRes.data.output));
				dispatch(updateUser(profileDetailRes.data.output));
				instance.dropDownAlertRef.alertWithType('success', 'Success', 'Profile updated successfully');
			} else {
				dispatch(editProfileDetailSuccess(profileDetailRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', profileDetailRes.data.error);
			}
		})
		.catch((error) => {
			instance.setState({ isLoading: false });
			dispatch(profileError(error.response.data.error));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const getStudentPerformanceSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_STUDENT_PERFORMANCE_DETAIL, payload });
};

const getTeacherPerformanceSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_TEACHER_PERFORMANCE_DETAIL, payload });
};

export const getOtherPerformanceDetail = (userTypes) => async (dispatch) => {
	axiosApi
		.post(`/userlist?user_type=${userTypes == '1' ? 'teacher' : 'student'}`)
		.then((performanceRes) => {
			if (performanceRes.status === 200) {
				if (userTypes === userType.teacher) {
					dispatch(getTeacherPerformanceSuccess(performanceRes.data.output));
				} else {
					dispatch(getStudentPerformanceSuccess(performanceRes.data.output));
				}
			} else {
				dispatch(getPerformanceSuccess(performanceRes.data.error));
				// instance.dropDownAlertRef.alertWithType('error', 'Error', performanceRes.data.error);
			}
		})
		.catch((error) => {
			dispatch(profileError(error.response.data.error));
			// instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};
