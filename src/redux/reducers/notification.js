import {
    NOTIFICATION_ERROR,
    GET_NOTIFICATION_SUCCESS,
} from "../constants/notification.constants";

const initialState = {
    notificationError: "",
    notificationDetail: {},
};

export default function notification(state = initialState, action) {
    switch (action.type) {
        case NOTIFICATION_ERROR: {
            return {
                ...state,
                notificationError: action.payload,
            };
        }
        case GET_NOTIFICATION_SUCCESS: {
            return {
                ...state,
                notificationDetail: action.payload,
            };
        }

        default:
            return state;
    }
}
