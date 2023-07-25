import { auth, products, order } from '../types';
import { UNIVERSITY_LIST_SUCCESS, COURSE_LIST_SUCCESS, GET_ERROR } from '../constants/auth.constants';
import JPush from 'jpush-react-native';

const initialState = {
	user: false,
	wechat_auth: false,
	universityList: {},
	courseList: {},
	errorInfo: ''
};

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case auth.AUTHENTICATED: {
			// set jpush alias https://github.com/jpush/jpush-react-native/blob/dev/example/App.js#L118
			if (action.payload) {
				const alias = action.payload.id.toString();
				JPush.setAlias({ sequence: 6, alias: alias });
				console.log('set jpush alias:', alias);
			}

			return {
				...state,
				user: action.payload
			};
		}
		case auth.WECHATAUTH: {
			return {
				...state,
				wechat_auth: action.payload
			};
		}
		case UNIVERSITY_LIST_SUCCESS: {
			return {
				...state,
				universityList: action.payload
			};
		}
		case COURSE_LIST_SUCCESS: {
			return {
				...state,
				courseList: action.payload
			};
		}
		case GET_ERROR: {
			return {
				...state,
				errorInfo: action.payload
			};
		}
		default:
			return state;
	}
}
