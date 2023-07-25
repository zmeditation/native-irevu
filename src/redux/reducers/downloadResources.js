import {
    DOWNLOAD_RESULT_SUCCESS,
    DOWNLOAD_RESULT_ERROR,
} from "../constants/downloadResources.constants";

const initialState = {
    downloadResult: [],
    downloadErr: "",
};

export default function downloadResources(state = initialState, action) {
    switch (action.type) {
        case DOWNLOAD_RESULT_SUCCESS: {
            return {
                ...state,
                downloadResult: action.payload,
            };
        }
        case DOWNLOAD_RESULT_ERROR: {
            return {
                ...state,
                downloadErr: action.payload,
            };
        }
        default:
            return state;
    }
}
