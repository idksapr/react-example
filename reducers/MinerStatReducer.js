import {
    GET_MINER_STAT_REQUEST,
    GET_MINER_STAT_SUCCESS,
    GET_MINER_STAT_FAIL
} from '../actions/MinerActions'

const initialState = {
    isFetching: null,
    success: false,
    stat: [],
    refresh: 0,
    error: {
        code: null,
        message: '',
    },
}

const minerStatReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_MINER_STAT_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_MINER_STAT_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            stat: action.payload.stat,
            refresh: action.payload.refresh,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_MINER_STAT_FAIL:
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

export default minerStatReducer;
