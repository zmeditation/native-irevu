import axiosApi from '../../config/api';
import {
	CREATE_HOMEWORK,
	GET_HOMEWORK_LIST,
	HOMEWORK_ERROR,
	SUBMIT_HOMEWORK_SUCCESS,
	GET_SAVED_HOMEWORK_SUCCESS,
	GET_ALL_SUBMITED_HOMEWORK_SUCCESS,
	ADD_HOMEWORK_GRADE_SUCCESS,
	GET_SUBMITED_HOMEWORK_LIST_SUCCESS,
	UPDATE_HOMEWORK_DETAILS,
	GET_RESULT_DETAILS,
	HOEMWORK_LIST_SUCCESS,
	ADD_HOMEWORK_CHAT_SUCCESS
} from '../constants/homework.constants';

const createHomeworkSuccess = (payload) => async (dispatch) => {
	await dispatch({
		type: CREATE_HOMEWORK,
		payload
	});
};

const homeworkError = (payload) => (dispatch) => {
	dispatch({ type: HOMEWORK_ERROR, payload });

	setTimeout(() => {
		dispatch({ type: HOMEWORK_ERROR, payload: '' });
	}, 3000);
};

export const createHomework = (instance, formValue) => async (dispatch, getState) => {
	axiosApi
		.post(`/homework/create`, { ...formValue })
		.then((createHomeworkRes) => {
			if (createHomeworkRes.status === 200) {
				if (instance.dropDownAlertRef) {
					instance.dropDownAlertRef.alertWithType('success', 'Success', 'Homework created successfully');
				}

				dispatch(createHomeworkSuccess(createHomeworkRes.data.output));
			} else {
				instance.dropDownAlertRef.alertWithType('error', 'Error', createClassRes.data.error);

				dispatch(homeworkError(createClassRes.data.error));
			}
		})
		.catch((error) => {
			console.log('create homework error ', error.response.data);
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data);

			dispatch(homeworkError(error.response.data.error));
		});
};

const updateHomeworkDetails = (payload) => (dispatch) => {
	dispatch({ type: UPDATE_HOMEWORK_DETAILS, payload });
};

const submitHomeworkSuccess = (payload) => (dispatch) => {
	dispatch({ type: SUBMIT_HOMEWORK_SUCCESS, payload });
};

export const submitHomework = (instance, formvalue, homeworkDetails) => (dispatch) => {
	formvalue.checked = false;
	console.log(formvalue, homeworkDetails);
	axiosApi
		.post(`/student/submit-homework`, { ...formvalue })
		.then((homeWork) => {
			if (homeWork.status === 200) {
				dispatch(submitHomeworkSuccess(homeWork.data.output));

				if (formvalue.submitted === 'true') {
					homeWork.data.output.class_name = homeworkDetails.class_id || '';
					homeWork.data.output.submitted = true;
					homeWork.data.output.grade = '';

					const homeworkInfo = {
						homeworkDetail: {
							title: homeworkDetails.title || '',
							description: homeworkDetails.description || '',
							status: homeworkDetails.status || '',
							class_id: homeworkDetails.class_id || ''
						},
						submited_homeworkDetail: { ...homeWork.data.output }
					};

					dispatch(updateHomeworkDetails(homeworkInfo));
				}

				instance.dropDownAlertRef.alertWithType(
					'success',
					'Success',
					`Homework ${homeWork.data.output.submitted ? 'submited' : 'saved'} successfully`
				);
			} else {
				dispatch(homeworkError(homeWork.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', homeWork.data.error);
			}
		})
		.catch((error) => {
			dispatch(homeworkError(error.response));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const getSubmitedHomeworkSuccess = (payload) => (dispatch) => {};

export const getSubmitedHomework = (homeworkId) => async (dispatch) => {
	axiosApi
		.get(`/homework/get/${homeworkId}`)
		.then((homeWorkDetail) => {
			if (homeWorkDetail.status === 200) {
				dispatch(getSubmitedHomeworkSuccess(homeWorkDetail.data.output));
			} else {
				dispatch(getSubmitedHomeworkSuccess(homeWorkDetail.data.error));
			}
		})
		.catch((error) => {
			console.log('get single homework error', error.response.data);
			dispatch(homeworkError(error.response.data.error));
		});
};

const getSavedHomeworkDetailsSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_SAVED_HOMEWORK_SUCCESS, payload });
};

export const getSavedHomeworkDetails = (homeworkParams) => (dispatch) => {
	return axiosApi
		.post(`/student/homework-detail`, { ...homeworkParams })
		.then((homeWorkDetail) => {
			return homeWorkDetail;
			// if (homeWorkDetail.status === 200) {
			//   console.log(
			//     "get saved homework details--->>>>",
			//     homeWorkDetail.data.output
			//   );
			//   dispatch(
			//     getSavedHomeworkDetailsSuccess(
			//       homeWorkDetail.data.output.homework_details.homework_details
			//     )
			//   );

			//   return homeWorkDetail;
			// } else {
			//   console.log("get homework list error", homeWorkDetail.data.error);
			//   dispatch(homeworkError(homeWorkDetail.data.error));

			// }
		})
		.catch((error) => {
			console.log(error.response);
			dispatch(homeworkError(error.response.data.error));
		});
};

const getHomewrokListsSuccess = (payload) => async (dispatch) => {
	dispatch({ type: GET_HOMEWORK_LIST, payload });
};

export const getHomeworkLists = (instance, classId) => (dispatch) => {
	axiosApi
		.post(`/homework/get-class-list`, { classId })
		.then((homeWorkList) => {
			if (homeWorkList.status === 200) {
				dispatch(getHomewrokListsSuccess(homeWorkList.data.output));
			} else {
				console.log('get homework list error', homeWorkList.data.error);
				dispatch(homeworkError(homeWorkList.data.error));
			}
		})
		.catch((error) => {
			dispatch(homeworkError(error.response.data.error));
		});
};

export const getHomeworkAllList = (instance, formValue) => async (dispatch, getState) => {
	axiosApi.get(`/homework/list`).then((homeworkListRes) => {}).catch((error) => {
		console.log('get all homework list error', error);
	});
};

const getAllSubmittedHomeworkSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_ALL_SUBMITED_HOMEWORK_SUCCESS, payload });
};

export const getAllSubmittedHomeWork = (classId) => async (dispatch) => {
	await axiosApi
		.post(`/student/all-submitted-homework`, { class_id: classId })
		.then((submitedHomeWorkDetail) => {
			if (submitedHomeWorkDetail.status === 200) {
				dispatch(getAllSubmittedHomeworkSuccess(submitedHomeWorkDetail.data.output));
			} else {
				dispatch(homeworkError(submitedHomeWorkDetail.data.error));
			}
		})
		.catch((error) => {
			dispatch(homeworkError(error.response.data.error));
		});
};

const addHomeWorkGradeSuccess = (payload) => (dispatch) => {
	dispatch({ type: ADD_HOMEWORK_GRADE_SUCCESS, payload });
};

export const addHomeWorkGrade = (instance, formValue) => async (dispatch) => {
	// dispatch(addHomeWorkGradeSuccess(formValue));

	// dispatch(addHomeWorkGradeSuccess({
	//   "studentFirstName": "Sanju",
	//   "studentLastName": null,
	//   "studentId": 3,
	//   "homework_details": {
	//     "student_id": 3,
	//     "homework_id": 39,
	//     "class_id": 3,
	//     "homework_details": "<div>ssubmit second homework</div><div><br></div><div>sssjsjjs urjebs&nbsp; jsjs e</div><div>jsjs urubee&nbsp;</div><div><br></div><div>kskek jsjs jsjs s</div><div><b><i><u><br></u></i></b></div><div><b><i><u>jdkdkd jsjjsjsj</u></i></b></div><div><b><i><u><br></u></i></b></div><div><ul><li>skks jsj</li><li>sskks checked</li></ul></div><div></div>",
	//     "grade": "34",
	//     "checked": true,
	//     "created_at": "2021-02-21 10:53:08"
	//   }
	// }));

	await axiosApi
		.post(`/teacher/add-grade-homework`, { ...formValue })
		.then(async (addGradeSuccess) => {
			if (addGradeSuccess.status === 200) {
				dispatch(addHomeWorkGradeSuccess(addGradeSuccess.data.output));
			} else {
				dispatch(homeworkError(addGradeSuccess.data.error));
			}
		})
		.catch((error) => {
			console.log('error add grade', error.response);
			dispatch(homeworkError(error.response.data.error));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const getSubmittedHomeworkListSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_SUBMITED_HOMEWORK_LIST_SUCCESS, payload });
};

export const getSubmittedHomeworkList = (instance, formValue) => async (dispatch) => {
	await axiosApi
		.post(`/teacher/submitted-homework-list`, { ...formValue })
		.then((getSubHomeworkLst) => {
			if (getSubHomeworkLst.status === 200) {
				dispatch(getSubmittedHomeworkListSuccess(getSubHomeworkLst.data.output));
			} else {
				dispatch(homeworkError(getSubHomeworkLst.data.error));
			}
		})
		.catch((error) => {
			console.log('get sub home wor klist error --->>>', error);
			dispatch(homeworkError(error.response.data.error));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const getResultListSuccess = (payload) => (dispatch) => {
	dispatch({ type: GET_RESULT_DETAILS, payload });
};

export const getResultList = (instance) => async (dispatch) => {
	await axiosApi
		.post(`/student/submit-homework-list`)
		.then((resultLstRes) => {
			if (resultLstRes.status === 200) {
				dispatch(getResultListSuccess(resultLstRes.data.output));
			} else {
				dispatch(homeworkError(resultLstRes.data.error));
				instance.dropDownAlertRef.alertWithType('error', 'Error', resultLstRes.data.error);
			}
		})
		.catch((error) => {
			dispatch(homeworkError(error.response.data.error));
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
		});
};

const addHomeworkChatSuccess = (payload) => (dispatch) => {
	dispatch({ type: ADD_HOMEWORK_CHAT_SUCCESS, payload });
};

export const submitHomeworkChat = (instance, formValue) => (dispatch) => {
	try {
		axiosApi
			.post(`/homework-feedback/add-feedback`, { ...formValue })
			.then(async (questionFeedbackRes) => {
				instance.setState({ isLoading: false });
				if (questionFeedbackRes.status === 200) {
					dispatch(addHomeworkChatSuccess(questionFeedbackRes.data.output));
				} else {
					console.log('error data -->>', questionFeedbackRes.data);
					instance.dropDownAlertRef.alertWithType('error', 'Error', questionFeedbackRes.data.error);
					dispatch(questionError(questionFeedbackRes.data.error));
				}
			})
			.catch((error) => {
				instance.setState({ isLoading: false });
				console.log('get submitted feedback error details....', error.response);
				instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);

				dispatch(questionError(error.response.data.error));
			});
	} catch (e) {
		instance.setState({ isLoading: false });
		instance.dropDownAlertRef.alertWithType('error', 'Error', e);
		dispatch(questionError(e));
	}
};

const getHomeworkListSuccess = (payload) => (dispatch) => {
	dispatch({ type: HOEMWORK_LIST_SUCCESS, payload });
};

export const getHomeworkChatList = (instance, question_id) => (dispatch) => {
	axiosApi
		.post(`/homework-feedback/get-feedback-list`, { question_id })
		.then((questionFeedbackListRes) => {
			if (questionFeedbackListRes.status === 200) {
				dispatch(getHomeworkListSuccess(questionFeedbackListRes.data.output));
			} else {
				instance.dropDownAlertRef.alertWithType('error', 'Error', questionFeedbackListRes.data.error);
				dispatch(questionError(questionFeedbackListRes.data.error));
			}
		})
		.catch((error) => {
			console.log('getHomeworkChatList error....', error.response);
			instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			dispatch(questionError(error.response.data.error));
		});
};
