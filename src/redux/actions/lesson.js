import axiosApi from '../../config/api';
import {
	LESSON_ERROR,
	ADD_LESSON_SUCCESS,
	GET_OTHERS_LESSON_SUCCESS,
	GET_LESSON_SUCCESS,
	REMOVE_LESSON_SUCCESS,
	SEARCH_LESSON_SUCCESS
} from '../constants/lesson.constants';

const lessonsError = (payload) => (dispatch) => {
	dispatch({ type: LESSON_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: LESSON_ERROR, payload: '' });
	}, 3000);
};

const addLessonSuccess = (payload) => (dispatch) => {
	dispatch({ type: ADD_LESSON_SUCCESS, payload });
};

export const addLesson = (instance, lessonDetail) => async (dispatch) => {
	axiosApi
		.post(`/lesson/add`, { ...lessonDetail })
		.then((addLessonRes) => {
			if (addLessonRes.status === 200) {
				dispatch(addLessonSuccess(addLessonRes.data.output));
			} else {
				dispatch(lessonsError(addLessonRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', addLessonRes.data.error);
			}
		})
		.catch((error) => {
			console.log('error add plan', error);
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(lessonsError(error.response.data.error));
		});
};

const getOtherLessonSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_OTHERS_LESSON_SUCCESS, payload });
};

export const getOtherLesson = (instance) => async (dispatch) => {
	axiosApi
		.get(`/lesson/get-other-teacher-lessons`)
		.then((getOtherLessonRes) => {
			if (getOtherLessonRes.status === 200) {
				dispatch(getOtherLessonSuccess(getOtherLessonRes.data.output));
			} else {
				dispatch(lessonsError(getOtherLessonRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', getOtherLessonRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(lessonsError(error.response.data.error));
		});
};

const getLessonSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_LESSON_SUCCESS, payload });
};

export const getLesson = (instance) => async (dispatch) => {
	axiosApi
		.get(`/lesson/get-list`)
		.then((getLessonRes) => {
			if (getLessonRes.status === 200) {
				dispatch(getLessonSuccess(getLessonRes.data.output));
			} else {
				dispatch(lessonsError(getLessonRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', getLessonRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(lessonsError(error.response.data.error));
		});
};

const removeLessonSuccess = (payload) => (dispatch) => {
	dispatch({ type: REMOVE_LESSON_SUCCESS, payload });
};

export const removeLesson = (instance, id) => async (dispatch) => {
	axiosApi
		.post(`/lesson/delete`, { id })
		.then((removeLessonRes) => {
			if (removeLessonRes.status === 200) {
				dispatch(removeLessonSuccess(removeLessonRes.data.output.id));
				instance.dropDownAlertRef.alertWithType('success', 'Success', 'Lesson removed successfully');
			} else {
				dispatch(lessonsError(removeLessonRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', removeLessonRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(lessonsError(error.response.data.error));
		});
};

const searchLessonSuccess = (payload) => (dispatch) => {
	dispatch({ type: SEARCH_LESSON_SUCCESS, payload });
};

export const searchLesson = (instance, search) => async (dispatch) => {
	axiosApi
		.get(`/lesson/search?search=${search}`)
		.then((searchLessonRes) => {
			if (searchLessonRes.status === 200) {
				dispatch(searchLessonSuccess(searchLessonRes.data.output));
			} else {
				dispatch(lessonsError(searchLessonRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', searchLessonRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(lessonsError(error.response.data.error));
		});
};
