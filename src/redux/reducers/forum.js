import {
	ADD_QUESTION_SUCCESS,
	QUESTION_ERROR,
	ALL_OPEN_QUESTION_LIST_SUCCESS,
	ALL_CLOSE_QUESTION_LIST_SUCCESS,
	GET_QUESTION_DETAIL,
	ADD_QUESTION_FEEDBACK_SUCCESS,
	QUESTION_FEEDBACK_LIST_SUCCESS,
	GET_REMAINING_QUESTION_COUNT,
	ACCEPT_QUESTION_SUCCESS
} from '../constants/forum.constants';

const initialState = {
	fourmErr: '',
	fourmAddQuestion: {},
	allOpenQuestionList: [],
	allCloseQuestionList: [],
	questionDetail: {},
	addQuestionFeedback: {},
	questionFeedbackList: [],
	remainingQuestionCount: -1,
	acceptQuestionRes: false
};

export default function forum(state = initialState, action) {
	switch (action.type) {
		case QUESTION_ERROR: {
			return {
				...state,
				fourmErr: action.payload
			};
		}
		case ADD_QUESTION_SUCCESS: {
			return {
				...state,
				fourmAddQuestion: action.payload,
				allOpenQuestionList: [ action.payload, ...state.allOpenQuestionList ]
			};
		}
		case ALL_OPEN_QUESTION_LIST_SUCCESS: {
			return {
				...state,
				allOpenQuestionList: action.payload
			};
		}
		case ALL_CLOSE_QUESTION_LIST_SUCCESS: {
			return {
				...state,
				allCloseQuestionList: action.payload
			};
		}
		case GET_QUESTION_DETAIL: {
			return {
				...state,
				questionDetail: action.payload
			};
		}
		case ADD_QUESTION_FEEDBACK_SUCCESS: {
			action.payload.user_id = '';
			return {
				...state,
				addQuestionFeedback: action.payload,
				questionFeedbackList: [ action.payload, ...(state.questionFeedbackList || []) ]
			};
		}
		case QUESTION_FEEDBACK_LIST_SUCCESS: {
			return {
				...state,
				questionFeedbackList: action.payload
			};
		}
		case GET_REMAINING_QUESTION_COUNT: {
			return {
				...state,
				remainingQuestionCount: action.payload
			};
		}
		case ACCEPT_QUESTION_SUCCESS: {
			return {
				...state,
				acceptQuestionRes: action.payload
			};
		}
		default:
			return state;
	}
}
