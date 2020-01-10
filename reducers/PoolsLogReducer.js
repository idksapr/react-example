import {
    GET_POOLS_LOG_REQUEST,
    GET_POOLS_LOG_SUCCESS,
    GET_POOLS_LOG_FAIL,
    SORT_POOLS_LOG,
} from '../actions/PoolsActions'

const initialState = {
    isFetching: false,
    success: false,
    entries: [],
    error: {
        code: null,
        message: '',
    },
}

const poolsLogReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_LOG_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_LOG_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            entries: action.payload.entries,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_LOG_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case SORT_POOLS_LOG:
        return {
            ...state,
            isFetching: false,
            success: true,
            entries: action.payload.entries,
            error: {
                code: null,
                message: '',
            },
        };
    default:
        return state;
    }
}

export default poolsLogReducer;
