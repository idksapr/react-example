import axios from 'axios';
import { makeAPIUrl} from '../store/utils';
import { calculateThreats } from '../store/threatsAnalyzer';
import { setThreats, exceptionHandler } from './CommonActions';

export const GET_BOARDS_REQUEST = 'GET_BOARDS_REQUEST';
export const GET_BOARDS_SUCCESS = 'GET_BOARDS_SUCCESS';
export const GET_BOARDS_FAIL = 'GET_BOARDS_FAIL';

export const GET_BOARDS_STAT_REQUEST = 'GET_BOARDS_STAT_REQUEST';
export const GET_BOARDS_STAT_SUCCESS = 'GET_BOARDS_STAT_SUCCESS';
export const GET_BOARDS_STAT_FAIL = 'GET_BOARDS_STAT_FAIL';

export const GET_BOARDS_METRICS_REQUEST = 'GET_BOARDS_METRICS_REQUEST';
export const GET_BOARDS_METRICS_SUCCESS = 'GET_BOARDS_METRICS_SUCCESS';
export const GET_BOARDS_METRICS_FAIL = 'GET_BOARDS_METRICS_FAIL';

export const GET_BOARDS_SERIES_REQUEST = 'GET_BOARDS_SERIES_REQUEST';
export const GET_BOARDS_SERIES_SUCCESS = 'GET_BOARDS_SERIES_SUCCESS';
export const GET_BOARDS_SERIES_FAIL = 'GET_BOARDS_SERIES_FAIL';

export function getBoards(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_BOARDS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/boards'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_BOARDS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_BOARDS_FAIL,
                authState,
                authState => getBoards(authState, successCallback)(dispatch)
            )(dispatch);
        }
    };
}

export function getBoardsStat(authState, successCallback = null, refreshTokenCallback = null) {
    return async dispatch => {
        getBoardsStatByIds(
            [],
            authState,
            successCallback,
            refreshTokenCallback
        )(dispatch);
    }
}

export function getBoardsStatByIds(boards = [], authState, successCallback = null, refreshTokenCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_BOARDS_STAT_REQUEST,
        });

        try {
            const boardsQuery = boards && boards.length > 0 ? boards.join() : 'all';

            const response = await axios.get(
                makeAPIUrl(`/api/boards/${ boardsQuery }/stat`),
                { headers: { Authorization: authState.access_token } }
            );

            const data = response.data;

            if (data.items && data.items.length > 0) {
                data.items = data.items.map(item => {
                    const source = `board_${ item.id }`;
                    const calculatedData = calculateThreats(source, item.stat);

                    setThreats(calculatedData, source)(dispatch);

                    return { ...item, stat: calculatedData };
                });
            }

            dispatch({
                type: GET_BOARDS_STAT_SUCCESS,
                payload: data,
            });

            if (successCallback) {
                successCallback(data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_BOARDS_STAT_FAIL,
                authState,
                refreshTokenCallback
            )(dispatch);
        }
    };
}

export function getBoardsMetrics(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_BOARDS_METRICS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/boards/metrics'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_BOARDS_METRICS_SUCCESS,
                payload: response.data,
            });


            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_BOARDS_METRICS_FAIL,
                authState,
                authState => getBoardsMetrics(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getBoardsSeries(boards, metrics, since, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_BOARDS_SERIES_REQUEST,
        });

        try {
            const boardsQuery = boards && boards.length > 0 ? boards.join() : 'all';
            const metricsQuery = metrics && metrics.length > 0 ? metrics.join() : 'all';

            const response = await axios.get(
                makeAPIUrl(`/api/boards/${ boardsQuery }/series/${ metricsQuery }?since=${ since }`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_BOARDS_SERIES_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_BOARDS_SERIES_FAIL,
                authState,
                authState => getBoardsSeries(
                    boards,
                    metrics,
                    since,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}
