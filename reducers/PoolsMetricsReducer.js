import {
    GET_POOLS_METRICS_REQUEST,
    GET_POOLS_METRICS_SUCCESS,
    GET_POOLS_METRICS_FAIL,
} from '../actions/PoolsActions'

const initialState = {
    isFetching: null,
    success: false,
    metrics: {
        stat: [],
        series: [],
    },
    error: {
        code: null,
        message: '',
    },
}

const poolsMetricsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_POOLS_METRICS_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_METRICS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            metrics: {
                stat: action.payload.metrics.filter(metric => metric.statType != 'none'),
                series: action.payload.metrics.filter(metric => metric.seriesType),
            },
            error: {
                code: null,
                message: '',
            },
        };
    case GET_POOLS_METRICS_FAIL:
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

export default poolsMetricsReducer;
