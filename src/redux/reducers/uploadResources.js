import {
    VIDEO_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_SUCCESS,
    DOCUMENT_UPLOAD_SUCCESS,
    UPLOAD_RESOURCES_ERROR,
} from "../constants/uploadResources.constants";

const initialState = {
    imageUploadDetail: {},
    videoUploadDetail: {},
    documentUploadDetail: {},
    uploadResourcesErr: "",
};

export default function uploadeResources(state = initialState, action) {
    switch (action.type) {
        case IMAGE_UPLOAD_SUCCESS: {
            return {
                ...state,
                imageUploadDetail: action.payload,
            };
        }
        case VIDEO_UPLOAD_SUCCESS: {
            return {
                ...state,
                videoUploadDetail: action.payload,
            };
        }
        case DOCUMENT_UPLOAD_SUCCESS: {
            return {
                ...state,
                documentUploadDetail: action.payload,
            };
        }
        case UPLOAD_RESOURCES_ERROR: {
            return {
                ...state,
                uploadResourcesErr: action.payload,
            };
        }

        default:
            return state;
    }
}
