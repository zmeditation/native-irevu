import { CommonActions } from '@react-navigation/native';
import { auth, classes } from '../types';
import * as utils from './utils';
import { Post, Get } from '../../utils/api-call';
import axiosApi from '../../config/api';
import {
	CREATE_CLASS_SUCCESS,
	GET_CLASSLIST_SUCCESS,
	CLASS_ERROR,
	ENROLL_STUDENT_SUCCESS,
	ENROLL_CLASS_SUCCESS,
	ENROLLED_STUDENT_LIST_SUCCESS
} from '../constants/class.constants';
import { userType } from '../../utils/constants';

const classCreatedSuccess = (payload) => (dispatch) => {
	dispatch({
		type: CREATE_CLASS_SUCCESS,
		payload: payload
	});
};

const classError = (payload) => (dispatch) => {
	dispatch({ type: CLASS_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: CLASS_ERROR, payload: '' });
	}, 3000);
};

export const createClass = (instance, formValue) => async (dispatch, getState) => {
	axiosApi
		.post(`/class/create`, { name: formValue })
		.then((createClassRes) => {
			if (createClassRes.status === 200) {
				dispatch(classCreatedSuccess(createClassRes.data.output));

				if (instance.dropDownAlertRef) {
					instance.dropDownAlertRef.alertWithType('success', 'Success', 'Class created successfully');
				}
			} else {
				instance.dropDownAlertRef.alertWithType('error', 'Error', createClassRes.data.error);
				dispatch(classError(createClassRes.data.error));
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(utils.loading(instance, false));
			dispatch(classError(error.response.data.error));
		});
};

const enrollClassSuccess = (payload) => (dispatch) => {
	dispatch({
		type: ENROLL_CLASS_SUCCESS,
		payload
	});
};

export const enrollClassByClassId = (instance, classId) => async (dispatch) => {
	axiosApi
		.post(`/student/enrolled-class`, { class_id: classId })
		.then((enrollClassRes) => {
			if (enrollClassRes.status === 200) {
				dispatch(enrollClassSuccess(enrollClassRes.data.output));

				if (instance.dropDownAlertRef) {
					instance.dropDownAlertRef.alertWithType('success', 'Success', 'Class enrolled successfully');
				}
			} else {
				instance.dropDownAlertRef.alertWithType('error', 'Error', enrollClassRes.data.error);
				dispatch(classError(enrollClassRes.data.error));
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(classError(error.response.data.error));
			dispatch(utils.loading(instance, false));
		});
};

const getClassListSuccess = (payload) => (dispatch) => {
	dispatch({
		type: GET_CLASSLIST_SUCCESS,
		payload: payload
	});
};

export const getClassesLists = (instance) => async (dispatch, getState) => {
	const apiEndPoint = instance.props.user.user_type === userType.teacher ? `/class/list` : `/student/get-class-list`;

	axiosApi
		.get(apiEndPoint)
		.then(async (getClassRes) => {
			if (getClassRes.status === 200) {
				await dispatch(getClassListSuccess(getClassRes.data.output));
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(classError(error.response.data.error));
		});
};

const enrollStudentSuccess = (payload) => async (dispatch) => {
	dispatch({ type: ENROLL_STUDENT_SUCCESS, payload });
};

export const enrollStudentByTeacher = (instance, class_id, username) => async (dispatch) => {
	axiosApi
		.post(`/student/enroll`, { class_id: class_id, username: username })
		.then((enrollStudRes) => {
			console.log(`.then - enrollStudRes`, enrollStudRes);
			if (enrollStudRes.status === 200) {
				dispatch(enrollStudentSuccess(enrollStudRes.data.output));
			} else {
				dispatch(classError(enrollStudRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', enrollStudRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(classError(error.response.data.error));

			console.log(error.response.data);
		});
};

const getEnrolledStudentListSuccess = (payload) => async (dispatch) => {
	dispatch({ type: ENROLLED_STUDENT_LIST_SUCCESS, payload });
};

export const getEnrolledStudentList = (instance, classId) => async (dispatch) => {
	axiosApi
		.post(`/user/student-enroll-list`, { class_id: classId })
		.then((enrollStudRes) => {
			if (enrollStudRes.status === 200) {
				dispatch(getEnrolledStudentListSuccess(enrollStudRes.data.output));
			} else {
				dispatch(classError(enrollStudRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', enrollStudRes.data.error);
			}
		})
		.catch((error) => {
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(classError(error.response.data.error));

			console.log(error.response.data.error);
		});
};

// const getClassListSuccess = (payload) => (dispatch) => {
//   dispatch({
//     type: GET_CLASSLIST_SUCCESS,
//     payload: payload,
//   })
// }

// export const getClassesLists = (refVal) => async (dispatch, getState) => {

//   axiosApi.get(`/class/list`).then((getClassRes) => {

//     if (getClassRes.status === 200) {
//       dispatch(getClassListSuccess(getClassRes.data.output))
//     }

//   }).catch((error) => {
//     instance.dropDownAlertRef.alertWithType(
//       "error",
//       "Error",
//       error.response.data.error
//     );

//   })

// }

export const getUserClasses = (instance, form) => async (dispatch, getState) => {
	const user = getState().auth.user;

	Get(`/class/${user.id}`, user.token)
		.then((res) => {
			if (res.status === 200) {
				dispatch(utils.loading(instance, false));
				if (instance) {
					dispatch({
						type: classes.USER_CLASSES,
						payload: res.data.classes
					});

					dispatch({
						type: classes.CLASSES_LOADING,
						payload: false
					});
				}
			} else {
				dispatch({
					type: classes.CLASSES_LOADING,
					payload: false
				});
			}
		})
		.catch((error) => {
			console.log('GET CLASS RESPONSE ERROR', error.response.data.error);
			dispatch({
				type: classes.CLASSES_LOADING,
				payload: false
			});
			dispatch({
				type: classes.USER_CLASSES,
				payload: []
			});
			// dispatch(utils.loading(instance, false));
		});
};

export const getClassStudents = (class_id) => async (dispatch, getState) => {
	dispatch({
		type: classes.FECHING_STUDENTS,
		payload: true
	});

	const user = getState().auth.user;

	Post(`/class/students/${class_id}`, { user_id: user._id }, user.token)
		.then((res) => {
			if (res.status === 200) {
				// if (instance) {
				dispatch({
					type: classes.CLASS_STUDENTS,
					payload: res.data.students
				});

				dispatch({
					type: classes.FECHING_STUDENTS,
					payload: false
				});
				// }
			} else {
				dispatch({
					type: classes.FECHING_STUDENTS,
					payload: false
				});
			}
		})
		.catch((error) => {
			console.log('GET CLASS STUDENTS RESPONSE ERROR', error.response.data.error);
			dispatch({
				type: classes.FECHING_STUDENTS,
				payload: false
			});
			dispatch({
				type: classes.CLASS_STUDENTS,
				payload: []
			});
		});
};
