import axiosApi from '../../config/api';
import {
  QUESTION_ERROR,
  ADD_QUESTION_SUCCESS,
  ALL_OPEN_QUESTION_LIST_SUCCESS,
  ALL_CLOSE_QUESTION_LIST_SUCCESS,
  GET_QUESTION_DETAIL,
  ADD_QUESTION_FEEDBACK_SUCCESS,
  QUESTION_FEEDBACK_LIST_SUCCESS,
  GET_REMAINING_QUESTION_COUNT,
  ACCEPT_QUESTION_SUCCESS
} from '../constants/forum.constants';
import { start_wechat_pay, topUp } from './wechatPay';

export const loading = (instance, isLoading) => async (dispatch, getState) => {
  if (instance) {
    instance.setState({
      loading: isLoading
    });
  }
};
const questionError = (payload) => (dispatch) => {
  dispatch({ type: QUESTION_ERROR, payload });

  setTimeout(() => {
    dispatch({ type: QUESTION_ERROR, payload: '' });
  }, 3000);
};

const addQuestionSuccess = (payload) => (dispatch) => {
  dispatch({ type: ADD_QUESTION_SUCCESS, payload });
};

export const addQuestion = (instance, formValue) => async (dispatch) => {
  await dispatch(loading(instance, true));
  await axiosApi
    .post(`/forum-question/add-question`, { ...formValue })
    .then(async (addQuestionRes) => {
      await dispatch(loading(instance, false));
      if (addQuestionRes.status === 200 ){
          const { price, id,  } = addQuestionRes.data.output;
          let price1 = Number(price.replace(' RMB', ''));

          dispatch(start_wechat_pay({
            totalPayment: Number(price1 + price1 * 10 / 100),
            data: {
              order_type: 'Forum',
              product_id: id,
              payment_status: 'paid',
              buyer_id: addQuestionRes.data.output.created_by,
              is_wallet: formValue.use_wallet == false ? "0" : "1", // 0 == False && 1 == True
            },
            then: (res) => {
              if (res && res.errCode == 0) {
                if (instance.dropDownAlertRef) {
                  instance.dropDownAlertRef.alertWithType('success', 'Success', 'Question created successfully');
                }
                dispatch(addQuestionSuccess(addQuestionRes.data.output));
                instance.props.navigation.navigate('Forum');
              } else {
                alert('Try again!')
              }
            }
          })); 
      }
       
    })
    .catch(async (error) => {
      await dispatch(loading(instance, false));
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};

const getOpenQuestionListSuccess = (payload) => (dispatch) => {
  dispatch({ type: ALL_OPEN_QUESTION_LIST_SUCCESS, payload });
};

export const getOpenQuestionList = (instance, status) => async (dispatch) => {
  await dispatch(loading(instance, true));
  await axiosApi
    .post(`/forum-question/question-list`, { status })
    .then(async (openQuestionRes) => {
      await dispatch(loading(instance, false));
      if (openQuestionRes.status === 200) {
        dispatch(getOpenQuestionListSuccess(openQuestionRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', openQuestionRes.data.error);
        dispatch(questionError(openQuestionRes.data.error));
      }
    })
    .catch(async (error) => {
      await dispatch(loading(instance, false));
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};

const getCloseQuestionListSuccess = (payload) => (dispatch) => {
  dispatch({ type: ALL_CLOSE_QUESTION_LIST_SUCCESS, payload });
};

export const getCloseQuestionList = (instance, status) => async (dispatch) => {
  await dispatch(loading(instance, true));
  await axiosApi
    .post(`/forum-question/question-list`, { status })
    .then(async (closeQuestionRes) => {
      await dispatch(loading(instance, false));
      if (closeQuestionRes.status === 200) {
        dispatch(getCloseQuestionListSuccess(closeQuestionRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', closeQuestionRes.data.error);
        dispatch(questionError(closeQuestionRes.data.error));
      }
    })
    .catch(async (error) => {
      await dispatch(loading(instance, false));
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);

      dispatch(questionError(error.response.data.error));
    });
};

const getQuestionDetailSuccess = (payload) => (dispatch) => {
  dispatch({ type: GET_QUESTION_DETAIL, payload });
};

export const getQuestionDetail = (instance, questionId) => async (dispatch) => {
  await dispatch(loading(instance, true));
  await axiosApi
    .post(`/forum-question/question-detail`, { questionId })
    .then(async (questionDetailRes) => {
      await dispatch(loading(instance, false));
      if (questionDetailRes.status === 200) {
        await dispatch(getQuestionDetailSuccess(questionDetailRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', questionDetailRes.data.error);
        dispatch(questionError(questionDetailRes.data.error));
      }
    })
    .catch(async (error) => {
      await dispatch(loading(instance, false));
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};

const addQuestionFeedbackSuccess = (payload) => (dispatch) => {
  dispatch({ type: ADD_QUESTION_FEEDBACK_SUCCESS, payload });
};

export const submitQuestionFeedback = (instance, formValue) => (dispatch) => {
  axiosApi
    .post(`/forum-feedback/add-feedback`, { ...formValue })
    .then(async (questionFeedbackRes) => {
      await dispatch(loading(instance, false));
      if (questionFeedbackRes.status === 200) {
        dispatch(addQuestionFeedbackSuccess(questionFeedbackRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', questionFeedbackRes.data.error);
        dispatch(questionError(questionFeedbackRes.data.error));
      }
    })
    .catch(async (error) => {
      await dispatch(loading(instance, false));
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};

const getQuestionFeedbackListSuccess = (payload) => (dispatch) => {
  dispatch({ type: QUESTION_FEEDBACK_LIST_SUCCESS, payload });
};

export const getQuestionFeedbackList = (instance, questionId) => (dispatch) => {
  axiosApi
    .post(`/forum-feedback/get-feedback-list`, { question_id: questionId })
    .then((questionFeedbackListRes) => {
      if (questionFeedbackListRes.status === 200) {
        dispatch(getQuestionFeedbackListSuccess(questionFeedbackListRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', questionFeedbackListRes.data.error);
        dispatch(questionError(questionFeedbackListRes.data.error));
      }
    })
    .catch((error) => {
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);

      dispatch(questionError(error.response.data.error));
    });
};

const getRemainingQuestionSuccess = (payload) => (dispatch) => {
  dispatch({ type: GET_REMAINING_QUESTION_COUNT, payload });
};

export const getRemainigQuestionCount = (instance) => (dispatch) => {
  axiosApi
    .get(`/forum-question/remaining-question`)
    .then((remainingQuestionRes) => {
      if (remainingQuestionRes.status === 200) {
        dispatch(getRemainingQuestionSuccess(remainingQuestionRes.data.output));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', remainingQuestionRes.data.error);
        dispatch(questionError(remainingQuestionRes.data.error));
      }
    })
    .catch((error) => {
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};

const acceptQuestionSuccess = (payload) => (dispatch) => {
  dispatch({ type: ACCEPT_QUESTION_SUCCESS, payload });

  setTimeout(() => {
    dispatch({ type: ACCEPT_QUESTION_SUCCESS, payload: false });
  }, 3000);
};

export const acceptQuestion = (instance, questionId, notification_id) => (dispatch) => {
  axiosApi
    .post(`/forum-question/accept-question`, { questionId, notification_id: `${notification_id}` })
    .then(async (acceptQuestionRes) => {
      if (acceptQuestionRes.status === 200) {
        await dispatch(acceptQuestionSuccess(acceptQuestionRes.data.output.accepted));
        await instance.props.getQuestionDetail(instance, questionId);
      } else {
        await instance.dropDownAlertRef.alertWithType('error', 'Error', acceptQuestionRes.data.output);
        await dispatch(questionError(acceptQuestionRes.data.error));
      }
    })
    .catch((error) => {
      console.log(error.response);
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.output);
      dispatch(questionError(error.response.data.output));
    });
};

export const deleteQuestion = (instance, id) => (dispatch) => {
  axiosApi
    .post(`/forum-question/delete`, { id })
    .then((deleteQuestionRes) => {
      if (deleteQuestionRes.status === 200) {
        getOpenQuestionList(instance, 'open');
        instance.dropDownAlertRef.alertWithType('success', 'Success', 'Question deleted successfully');
        setTimeout(() => {
          instance.props.navigation.goBack();
        }, 500);
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', deleteQuestionRes.data.output);
        dispatch(questionError(deleteQuestionRes.data.error));
      }
    })
    .catch((error) => {
      console.log(`deleteQuestion - error`, error);
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);

      dispatch(questionError(error.response.data.error));
    });
};

export const repostQuestion = (instance, formValue) => (dispatch) => {
  axiosApi
    .post(`/forum-question/add-question`, { ...formValue })
    .then((repostQuestionRes) => {
      console.log(`.then - repostQuestionRes`, repostQuestionRes);
      if (repostQuestionRes.status === 200) {
        getOpenQuestionList(instance, 'open');
        instance.dropDownAlertRef.alertWithType('success', 'Success', 'Question repost successfully');
        setTimeout(() => {
          instance.props.navigation.goBack();
        }, 500);
        // dispatch(repostQuestionSuccess(repostQuestionRes.data.output.accepted));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', repostQuestionRes.data.output);
        dispatch(questionError(repostQuestionRes.data.error));
      }
    })
    .catch((error) => {
      console.log(`repostQuestion - error`, error.response);
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};
export const editQuestion = (instance, formValue) => (dispatch) => {
  axiosApi
    .post(`/forum-question/edit-question`, { ...formValue })
    .then((editQuestionRes) => {
      if (editQuestionRes.status === 200) {
        getOpenQuestionList(instance, 'open');
        instance.dropDownAlertRef.alertWithType('success', 'Success', 'Question edit successfully');

        setTimeout(() => {
          instance.props.navigation.goBack();
        }, 500);
        // dispatch(editQuestionSuccess(editQuestionRes.data.output.accepted));
      } else {
        instance.dropDownAlertRef.alertWithType('error', 'Error', editQuestionRes.data.output);
        dispatch(questionError(editQuestionRes.data.error));
      }
    })
    .catch((error) => {
      console.log(`editQuestion - error`, error.response);
      instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
      dispatch(questionError(error.response.data.error));
    });
};
