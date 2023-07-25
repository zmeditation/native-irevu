import { filter } from "lodash";
import {
    ADD_RESOURCE_SUCCESS,
    RESOURCE_ERROR,
    GET_OTHERS_RESOURCE_SUCCESS,
    GET_RESOURCE_SUCCESS,
    REMOVE_RESOURCE_SUCCESS,
    SEARCH_RESOURCE_SUCCESS,
} from "../constants/resource.constants";

const initialState = {
    addResources: {},
    resourceError: "",
    resourceList: [],
    otherResources: [],
    removeResource: "",
};

export default function resource(state = initialState, action) {
    switch (action.type) {
        case RESOURCE_ERROR: {
            return {
                ...state,
                resourceError: action.payload,
            };
        }
        case ADD_RESOURCE_SUCCESS: {
            return {
                ...state,
                addResources: action.payload,
                resourceList: [...(state.resourceList || []), action.payload],
            };
        }
        case GET_OTHERS_RESOURCE_SUCCESS: {
            return {
                ...state,
                otherResources: action.payload,
            };
        }
        case GET_RESOURCE_SUCCESS: {
            return {
                ...state,
                resourceList: action.payload,
            };
        }
        case REMOVE_RESOURCE_SUCCESS: {
            const newResourceList = filter(
                state.resourceList,
                (item) => item.id !== action.payload
            );

            return {
                ...state,
                removeResource: action.payload,
                resourceList: newResourceList || [],
            };
        }
        case SEARCH_RESOURCE_SUCCESS: {
            return {
                ...state,
                otherResources: action.payload || [],
            };
        }
        default:
            return state;
    }
}
