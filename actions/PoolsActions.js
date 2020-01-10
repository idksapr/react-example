import axios from 'axios';
import { makeAPIUrl } from '../store/utils';
import { calculateThreats } from '../store/threatsAnalyzer';
import { setThreats, exceptionHandler } from './CommonActions';

export const GET_POOLS_SETTINGS_REQUEST = 'GET_POOLS_SETTINGS_REQUEST';
export const GET_POOLS_SETTINGS_SUCCESS = 'GET_POOLS_SETTINGS_SUCCESS';
export const GET_POOLS_SETTINGS_FAIL = 'GET_POOLS_SETTINGS_FAIL';

export const PUT_POOLS_SETTINGS_REQUEST = 'PUT_POOLS_SETTINGS_REQUEST';
export const PUT_POOLS_SETTINGS_SUCCESS = 'PUT_POOLS_SETTINGS_SUCCESS';
export const PUT_POOLS_SETTINGS_FAIL = 'PUT_POOLS_SETTINGS_FAIL';

export const ADD_POOL_SETTINGS = 'ADD_POOL_SETTINGS';
export const EDIT_POOL_SETTINGS = 'EDIT_POOL_SETTINGS';
export const DELETE_POOL_SETTINGS = 'DELETE_POOL_SETTINGS';
export const MOVE_POOL_SETTINGS = 'MOVE_POOL_SETTINGS';

export const GET_POOLS_LOG_REQUEST = 'GET_POOLS_LOG_REQUEST';
export const GET_POOLS_LOG_SUCCESS = 'GET_POOLS_LOG_SUCCESS';
export const GET_POOLS_LOG_FAIL = 'GET_POOLS_LOG_FAIL';

export const SORT_POOLS_LOG = 'SORT_POOLS_LOG';

export const GET_POOLS_REQUEST = 'GET_POOLS_REQUEST';
export const GET_POOLS_SUCCESS = 'GET_POOLS_SUCCESS';
export const GET_POOLS_FAIL = 'GET_POOLS_FAIL';

export const GET_POOLS_STAT_REQUEST = 'GET_POOLS_STAT_REQUEST';
export const GET_POOLS_STAT_SUCCESS = 'GET_POOLS_STAT_SUCCESS';
export const GET_POOLS_STAT_FAIL = 'GET_POOLS_STAT_FAIL';

export const GET_POOLS_METRICS_REQUEST = 'GET_POOLS_METRICS_REQUEST';
export const GET_POOLS_METRICS_SUCCESS = 'GET_POOLS_METRICS_SUCCESS';
export const GET_POOLS_METRICS_FAIL = 'GET_POOLS_METRICS_FAIL';

export const GET_POOLS_SERIES_REQUEST = 'GET_POOLS_SERIES_REQUEST';
export const GET_POOLS_SERIES_SUCCESS = 'GET_POOLS_SERIES_SUCCESS';
export const GET_POOLS_SERIES_FAIL = 'GET_POOLS_SERIES_FAIL';

export function getPoolsSettings(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_SETTINGS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/miner/pools/settings'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_POOLS_SETTINGS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_SETTINGS_FAIL,
                authState,
                authState => getPoolsSettings(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function putPoolsSettings(poolsSettings, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: PUT_POOLS_SETTINGS_REQUEST,
        });

        try {
            await axios.put(
                makeAPIUrl('/api/miner/pools/settings'),
                poolsSettings,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: PUT_POOLS_SETTINGS_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                PUT_POOLS_SETTINGS_FAIL,
                authState,
                (authState, successCallback) => putPoolsSettings(
                    poolsSettings,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function addPoolSettings(poolsSettings, modifiablePoolSettings) {
    return dispatch => {
        const modifiedPoolsSettings = poolsSettings;

        modifiedPoolsSettings.push(modifiablePoolSettings);

        dispatch({
            type: ADD_POOL_SETTINGS,
            payload: { pools: modifiedPoolsSettings },
        });
    };
}

export function editPoolSettings(poolsSettings, modifiablePoolSettings, index) {
    return dispatch => {
        const modifiedPoolsSettings = poolsSettings;

        if (modifiedPoolsSettings[index]) {
            modifiedPoolsSettings[index] = modifiablePoolSettings;

            dispatch({
                type: EDIT_POOL_SETTINGS,
                payload: { pools: modifiedPoolsSettings },
            });
        }
    };
}

export function deletePoolSettings(poolsSettings, index) {
    return dispatch => {
        const modifiedPoolsSettings = poolsSettings;

        if (modifiedPoolsSettings[index]) {
            modifiedPoolsSettings.splice(index, 1);

            dispatch({
                type: DELETE_POOL_SETTINGS,
                payload: { pools: modifiedPoolsSettings },
            });
        }
    }
}

export function movePoolSettings(poolsSettings, index, step) {
    return dispatch => {
        const modifiedPoolsSettings = poolsSettings;
        const newIndex = index + step;

        if (modifiedPoolsSettings[newIndex]) {
            const tmp = modifiedPoolsSettings[newIndex];
            modifiedPoolsSettings[newIndex] = modifiedPoolsSettings[index];
            modifiedPoolsSettings[index] = tmp;

            dispatch({
                type: MOVE_POOL_SETTINGS,
                payload: { pools: modifiedPoolsSettings },
            });
        }
    }
}

export function getPoolsLog(count, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_LOG_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl(`/api/miner/pools/log?count=${count}`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_POOLS_LOG_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_LOG_FAIL,
                authState,
                authState => getPoolsLog(
                    count,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function sortPoolsLog(poolsLog, field, asc) {
    return async dispatch => {
        if (field == 'date') {
            poolsLog.sort((a, b) =>
                (Date.parse(a[field]) - Date.parse(b[field])) * (asc ? 1 : -1)
            );
        } else {
            poolsLog.sort((a, b) =>
                a.settings[field] < b.settings[field] ^ asc ?
                    1 : a.settings[field] == b.settings[field] ? 0 : -1
            );
        }

        dispatch({
            type: SORT_POOLS_LOG,
            payload: { entries: poolsLog },
        });
    };
}

export function getPools(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/pools'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_POOLS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_FAIL,
                authState,
                authState => getPools(authState, successCallback)(dispatch)
            )(dispatch);
        }
    };
}

export function getPoolsStat(authState, successCallback = null, refreshTokenCallback = null) {
    return async dispatch => {
        getPoolsStatByIds(
            [],
            authState,
            successCallback,
            refreshTokenCallback
        )(dispatch);
    }
}

export function getPoolsStatByIds(pools = [], authState, successCallback = null, refreshTokenCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_STAT_REQUEST,
        });

        try {
            const poolsQuery = pools && pools.length > 0 ? pools.join() : 'all';

            const response = await axios.get(
                makeAPIUrl(`/api/pools/${ poolsQuery }/stat`),
                { headers: { Authorization: authState.access_token } }
            );

            const data = response.data;

            if (data.items && data.items.length > 0) {
                data.items = data.items.map(item => {
                    const source = `pool_${ item.index }`;
                    const calculatedData = calculateThreats(source, item.stat);

                    setThreats(calculatedData, source)(dispatch);

                    return { ...item, stat: calculatedData };
                });
            }

            dispatch({
                type: GET_POOLS_STAT_SUCCESS,
                payload: data,
            });

            if (successCallback) {
                successCallback(data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_STAT_FAIL,
                authState,
                refreshTokenCallback
            )(dispatch);
        }
    };
}

export function getPoolsMetrics(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_METRICS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/pools/metrics'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_POOLS_METRICS_SUCCESS,
                payload: response.data,
            });


            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_METRICS_FAIL,
                authState,
                authState => getPoolsMetrics(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getPoolsSeries(pools, metrics, since, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_POOLS_SERIES_REQUEST,
        });

        try {
            const poolsQuery = pools && pools.length > 0 ? pools.join() : 'all';
            const metricsQuery = metrics && metrics.length > 0 ? metrics.join() : 'all';

            const response = await axios.get(
                makeAPIUrl(`/api/pools/${ poolsQuery }/series/${ metricsQuery }?since=${ since }`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_POOLS_SERIES_SUCCESS,
                payload: response.data,
            });


            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_POOLS_SERIES_FAIL,
                authState,
                authState => getPoolsSeries(
                    pools,
                    metrics,
                    since,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}
