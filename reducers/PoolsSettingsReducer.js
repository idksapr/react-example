import {
    GET_POOLS_SETTINGS_REQUEST,
    GET_POOLS_SETTINGS_SUCCESS,
    GET_POOLS_SETTINGS_FAIL,
    PUT_POOLS_SETTINGS_REQUEST,
    PUT_POOLS_SETTINGS_SUCCESS,
    PUT_POOLS_SETTINGS_FAIL,
    ADD_POOL_SETTINGS,
    EDIT_POOL_SETTINGS,
    DELETE_POOL_SETTINGS,
    MOVE_POOL_SETTINGS,
} from '../actions/PoolsActions'

const initialState = {
    isFetching: false,
    success: false,
    settings: [],
    isSaved: false,
    error: {
        code: null,
        message: '',
    },
}

const poolsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            settings: action.payload.pools,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case PUT_POOLS_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_POOLS_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_POOLS_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case ADD_POOL_SETTINGS:
    case EDIT_POOL_SETTINGS:
    case MOVE_POOL_SETTINGS:
    case DELETE_POOL_SETTINGS:
        return {
            ...state,
            isFetching: false,
            success: true,
            settings: action.payload.pools,
            error: {
                code: null,
                message: '',
            },
        };
    default:
        return state;
    }
}

export default poolsReducer;
