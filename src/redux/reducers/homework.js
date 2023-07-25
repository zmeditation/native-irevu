import { homework } from '../types';
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
	ADD_HOMEWORK_CHAT_SUCCESS,
	HOEMWORK_LIST_SUCCESS
} from '../constants/homework.constants';

const initialState = {
	homeworks: [],
	createdHomework: {},
	submitedHomework: {},
	loading: true,
	homeworkError: '',
	savedHomework: '',
	allSubmittedHomeworkList: [],
	addHomeWorkGradeDetail: {},
	submittedHomeworkLists: [],
	homeworkChat: [],
	addHomeworkChat: {},
	resultDetails: []
};

export default function homeworkReducer(state = initialState, action) {
	switch (action.type) {
		case CREATE_HOMEWORK: {
			return {
				...state,
				createdHomework: action.payload,
				homeworks: [ ...(state.homeworks || []), action.payload ]
			};
		}
		case GET_HOMEWORK_LIST: {
			return {
				...state,
				homeworks: action.payload
			};
		}
		case HOMEWORK_ERROR: {
			return {
				...state,
				loading: false,
				homeworkError: action.payload
			};
		}
		case SUBMIT_HOMEWORK_SUCCESS: {
			return {
				...state,
				submitedHomework: action.payload
			};
		}
		case GET_SAVED_HOMEWORK_SUCCESS: {
			return {
				...state,
				savedHomework: action.payload
			};
		}
		case GET_ALL_SUBMITED_HOMEWORK_SUCCESS: {
			return {
				...state,
				allSubmittedHomeworkList: action.payload
			};
		}
		case ADD_HOMEWORK_GRADE_SUCCESS: {
			// allSubmittedHomeworkList.map((data, index) => {
			//   if (data.homework_details.homework_id === action.payload.homeWork_id) {
			//     console.log("mathc")
			//     // allSubmittedHomeworkList[index].homework_details = action.payload
			//   }
			// })

			// console.log("old homewoke", state.submittedHomeworkLists);
			// console.log("new homework detail", action.payload)

			// const newSubmitedHomeworklist = map(state.submittedHomeworkLists, (i) =>
			//   console.log("iiiii-->>", i)
			// );

			const newSubmitedHomeworklist = state.submittedHomeworkLists.map((i, index) => {
				return i.studentId !== action.payload.studentId ? i : action.payload;
			});

			console.log('new updated homework listtt====>>>', newSubmitedHomeworklist);

			return {
				...state,
				addHomeWorkGradeDetail: action.payload,
				submittedHomeworkLists: newSubmitedHomeworklist || []
			};
		}
		case GET_SUBMITED_HOMEWORK_LIST_SUCCESS: {
			return {
				...state,
				submittedHomeworkLists: action.payload || []
			};
		}
		case UPDATE_HOMEWORK_DETAILS: {
			// const newData = state.homeworks.map((c) => {
			//   console.log({ "": c.id }, { "": action.payload.homework_id });
			//   // return c.id == action.payload.homework_id ? React.addons.update(c, action.payload) : c;
			// });

			// const elementsIndex = state.homeworks.findIndex(
			//   (element) => element.id == action.payload.homework_id
			// );
			// let newArray = [...state.homeworks];

			// newArray[elementsIndex] = {
			//   ...newArray[elementsIndex],
			//   completed: !newArray[elementsIndex].completed,
			// };

			const updateHomework = state.homeworks.filter(
				(homeWork) => homeWork.id !== action.payload.submited_homeworkDetail.homework_id
			);

			// console.log("new updated data---->>>", updateHomework);
			// console.log("state homeworks---->>>", state.homeworks);
			// console.log("homework new info....---->>>", action.payload);
			return {
				...state,
				homeworks: updateHomework,
				allSubmittedHomeworkList: [ ...state.allSubmittedHomeworkList, action.payload ]
			};
		}
		case GET_RESULT_DETAILS: {
			return {
				...state,
				resultDetails: action.payload || []
			};
		}
		case homework.CURRENT_HOMEWORK: {
			return {
				...state,
				homeworks: action.payload
			};
		}
		case homework.HOMEWORK_LOADING: {
			return {
				...state,
				loading: action.payload
			};
		}
		case HOEMWORK_LIST_SUCCESS: {
			return {
				...state,
				loading: false,
				homeworkChat: action.payload
			};
		}
		case ADD_HOMEWORK_CHAT_SUCCESS: {
			action.payload.user_id = '';
			return {
				...state,
				addHomeworkChat: action.payload,
				homeworkChat: [ ...(state.homeworkChat || []), action.payload ]
			};
		}
		default:
			return state;
	}
}
