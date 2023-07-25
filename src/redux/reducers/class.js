import { classes } from "../types";
import {
  CREATE_CLASS_SUCCESS,
  GET_CLASSLIST_SUCCESS,
  CLASS_ERROR,
  ENROLL_STUDENT_SUCCESS,
  ENROLL_CLASS_SUCCESS,
  ENROLLED_STUDENT_LIST_SUCCESS,
} from "../constants/class.constants";

const initialState = {
  classesLists: [],
  newClassDetails: {},
  loading: true,
  class_students: [],
  students_loading: true,
  classError: "",
  enrollStudent: "",
  enrollStudentList: [],
};

export default function classReducer(state = initialState, action) {
  switch (action.type) {
    // state.classes.push(action.payload)
    case CREATE_CLASS_SUCCESS: {
      return {
        ...state,
        newClassDetails: action.payload,
      };
    }
    case GET_CLASSLIST_SUCCESS: {
      return {
        ...state,
        classesLists: action.payload,
      };
    }
    case CLASS_ERROR: {
      return {
        ...state,
        classError: action.payload,
      };
    }
    case ENROLL_STUDENT_SUCCESS: {
      return {
        ...state,
        enrollStudent: action.payload,
        enrollStudentList: [...state.enrollStudentList, action.payload],
      };
    }
    case ENROLL_CLASS_SUCCESS: {
      return {
        ...state,
        newClassDetails: action.payload,
      };
    }
    case ENROLLED_STUDENT_LIST_SUCCESS: {
      return {
        ...state,
        enrollStudentList: action.payload,
      };
    }
    case classes.USER_CLASSES: {
      return {
        ...state,
        classes: action.payload,
      };
    }
    case classes.CLASSES_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case classes.ADD_CLASS: {
      return {
        ...state,
        classes: [...state.classes, action.payload],
      };
    }
    case classes.CLASS_STUDENTS: {
      return {
        ...state,
        class_students: action.payload,
      };
    }
    case classes.FECHING_STUDENTS: {
      return {
        ...state,
        students_loading: action.payload,
      };
    }

    default:
      return state;
  }
}
