import {
    GET_POOLS_SERIES_REQUEST,
    GET_POOLS_SERIES_SUCCESS,
    GET_POOLS_SERIES_FAIL,
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

const poolsSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_SERIES_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_SERIES_SUCCESS:
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
    case GET_POOLS_SERIES_FAIL:
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

export default poolsSeriesReducer;
