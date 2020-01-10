import {
    GET_MINER_REQUEST,
    GET_MINER_SUCCESS,
    GET_MINER_FAIL,
} from '../actions/MinerActions'

const initialState = {
    isFetching: null,
    success: false,
    miner: {},
    error: {
        code: null,
        message: '',
    },
}

const minerReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_MINER_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_MINER_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            miner: action.payload.miner,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_MINER_FAIL:
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

export default minerReducer;
