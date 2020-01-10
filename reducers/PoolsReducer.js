import {
    GET_POOLS_REQUEST,
    GET_POOLS_SUCCESS,
    GET_POOLS_FAIL,
} from '../actions/PoolsActions'

const initialState = {
    isFetching: null,
    success: false,
    pools: [],
    error: {
        code: null,
        message: '',
    },
}

const poolsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            pools: action.payload.pools,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_FAIL:
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

export default poolsReducer;
