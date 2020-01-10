import {
    GET_POOLS_STAT_REQUEST,
    GET_POOLS_STAT_SUCCESS,
    GET_POOLS_STAT_FAIL,
} from '../actions/PoolsActions'

const initialState = {
    isFetching: null,
    success: false,
    items: [],
    refresh: 0,
    error: {
        code: null,
        message: '',
    },
}

const poolsStatReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_STAT_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_STAT_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            items: action.payload.items,
            refresh: action.payload.refresh,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_STAT_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    default:
        return state;
    }
}

export default poolsStatReducer;
