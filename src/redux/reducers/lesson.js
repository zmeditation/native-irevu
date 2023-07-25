import { filter } from "lodash";
import {
    ADD_LESSON_SUCCESS,
    LESSON_ERROR,
    GET_OTHERS_LESSON_SUCCESS,
    GET_LESSON_SUCCESS,
    REMOVE_LESSON_SUCCESS,
    SEARCH_LESSON_SUCCESS,
} from "../constants/lesson.constants";

const initialState = {
    addLessons: {},
    lessonError: "",
    lessonList: [],
    otherLessons: [],
    removeLesson: "",
};

export default function lesson(state = initialState, action) {
    switch (action.type) {
        case LESSON_ERROR: {
            return {
                ...state,
                lessonError: action.payload,
            };
        }
        case ADD_LESSON_SUCCESS: {
            return {
                ...state,
                addLessons: action.payload,
                lessonList: [...(state.lessonList || []), action.payload],
            };
        }
        case GET_OTHERS_LESSON_SUCCESS: {
            return {
                ...state,
                otherLessons: action.payload,
            };
        }
        case GET_LESSON_SUCCESS: {
            return {
                ...state,
                lessonList: action.payload,
            };
        }
        case REMOVE_LESSON_SUCCESS: {
            const newLessonList = filter(
                state.lessonList,
                (item) => item.id !== action.payload
            );

            return {
                ...state,
                removeLesson: action.payload,
                lessonList: newLessonList || [],
            };
        }
        case SEARCH_LESSON_SUCCESS: {
            return {
                ...state,
                otherLessons: action.payload,
            };
        }
        default:
            return state;
    }
}
