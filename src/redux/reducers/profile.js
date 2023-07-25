import {
    PROFILE_ERROR,
    GET_PROFILE_SUCCESS,
    EDIT_PROFILE_SUCCESS,
    GET_PERFORMANCE_DETAIL_SUCCESS,
    GET_STUDENT_PERFORMANCE_DETAIL,
    GET_TEACHER_PERFORMANCE_DETAIL,
    GET_USER_TRANSACTION_HISTORY,
    POST_PAYMENT_STATUS
} from "../constants/profile.constants";

const initialState = {
    profileError: "",
    profileDetail: {},
    editProfDetails: {},
    performanceDetail: [],
    teacherPerformace: [],
    studentPerformace: [],
    transationHistory: [],
};

export default function profile(state = initialState, action) {
    switch (action.type) {
        case PROFILE_ERROR: {
            return {
                ...state,
                profileError: action.payload,
            };
        }
        case GET_PROFILE_SUCCESS: {
            return {
                ...state,
                profileDetail: action.payload,
            };
        }
        case EDIT_PROFILE_SUCCESS: {
            return {
                ...state,
                profileDetail: action.payload,
                editProfDetails: action.payload || {},
            };
        }
        case GET_PERFORMANCE_DETAIL_SUCCESS: {
            return {
                ...state,
                performanceDetail: action.payload,
            };
        }
        case GET_STUDENT_PERFORMANCE_DETAIL: {
            return {
                ...state,
                studentPerformace: action.payload,
            };
        }
        case GET_TEACHER_PERFORMANCE_DETAIL: {
            return {
                ...state,
                teacherPerformace: action.payload,
            };
        }
        case GET_USER_TRANSACTION_HISTORY: {
            return {
                ...state,
                transationHistory: action.payload,
            };
        }
        case POST_PAYMENT_STATUS: {
            return {
                ...state,
                paymentStatusSuccess: action.payload,
            };
        }
        default:
            return state;
    }
}
