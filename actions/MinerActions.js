import axios from 'axios';
import { makeAPIUrl, sortLogEntries } from '../store/utils';
import { calculateThreats } from '../store/threatsAnalyzer';
import { setThreats, exceptionHandler } from './CommonActions';

export const GET_MINER_REQUEST = 'GET_MINER_REQUEST';
export const GET_MINER_SUCCESS = 'GET_MINER_SUCCESS';
export const GET_MINER_FAIL = 'GET_MINER_FAIL';

export const GET_MINER_SETTINGS_REQUEST = 'GET_MINER_SETTINGS_REQUEST';
export const GET_MINER_SETTINGS_SUCCESS = 'GET_MINER_SETTINGS_SUCCESS';
export const GET_MINER_SETTINGS_FAIL = 'GET_MINER_SETTINGS_FAIL';
export const PUT_MINER_SETTINGS_REQUEST = 'PUT_MINER_SETTINGS_REQUEST';
export const PUT_MINER_SETTINGS_SUCCESS = 'PUT_MINER_SETTINGS_SUCCESS';
export const PUT_MINER_SETTINGS_FAIL = 'PUT_MINER_SETTINGS_FAIL';

export const GET_MINER_LOG_REQUEST = 'GET_MINER_LOG_REQUEST';
export const GET_MINER_LOG_SUCCESS = 'GET_MINER_LOG_SUCCESS';
export const GET_MINER_LOG_FAIL = 'GET_MINER_LOG_FAIL';
export const SORT_MINER_LOG = 'SORT_MINER_LOG';

export const GET_CONFIG = 'GET_CONFIG';
export const EXPORT_CONFIG_REQUEST = 'EXPORT_CONFIG_REQUEST';
export const EXPORT_CONFIG_SUCCESS = 'EXPORT_CONFIG_SUCCESS';
export const EXPORT_CONFIG_FAIL = 'EXPORT_CONFIG_FAIL';
export const IMPORT_CONFIG_REQUEST = 'IMPORT_CONFIG_REQUEST';
export const IMPORT_CONFIG_SUCCESS = 'IMPORT_CONFIG_SUCCESS';
export const IMPORT_CONFIG_FAIL = 'IMPORT_CONFIG_FAIL';

export const GET_MINER_METRICS_REQUEST = 'GET_MINER_METRICS_REQUEST';
export const GET_MINER_METRICS_SUCCESS = 'GET_MINER_METRICS_SUCCESS';
export const GET_MINER_METRICS_FAIL = 'GET_MINER_METRICS_FAIL';

export const GET_MINER_STAT_REQUEST = 'GET_MINER_STAT_REQUEST';
export const GET_MINER_STAT_SUCCESS = 'GET_MINER_STAT_SUCCESS';
export const GET_MINER_STAT_FAIL = 'GET_MINER_STAT_FAIL';

export const GET_MINER_SERIES_REQUEST = 'GET_MINER_SERIES_REQUEST';
export const GET_MINER_SERIES_SUCCESS = 'GET_MINER_SERIES_SUCCESS';
export const GET_MINER_SERIES_FAIL = 'GET_MINER_SERIES_FAIL';

export const RUN_MINER_ACTION_REQUEST = 'RUN_MINER_ACTION_REQUEST';
export const RUN_MINER_ACTION_SUCCESS = 'RUN_MINER_ACTION_SUCCESS';
export const RUN_MINER_ACTION_FAIL = 'RUN_MINER_ACTION_FAIL';
export const CLEAR_MINER_ACTION = 'CLEAR_MINER_ACTION';

export const PING_REQUEST = 'PING_REQUEST';
export const PING_SUCCESS = 'PING_SUCCESS';
export const PING_FAIL = 'PING_FAIL';

export function getMiner(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/miner'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_MINER_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_FAIL,
                authState,
                authState => getMiner(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getMinerSettings(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_SETTINGS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/miner/settings'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_MINER_SETTINGS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_SETTINGS_FAIL,
                authState,
                authState => getMinerSettings(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function putMinerSettings(minerSettings, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: PUT_MINER_SETTINGS_REQUEST,
        });

        try {
            await axios.put(
                makeAPIUrl('/api/miner/settings'),
                minerSettings,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: PUT_MINER_SETTINGS_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                PUT_MINER_SETTINGS_FAIL,
                authState,
                (authState, successCallback) => putMinerSettings(
                    minerSettings,
                    authState,
                    successCallback,
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getMinerLog(count, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_LOG_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl(`/api/miner/log?count=${count}`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_MINER_LOG_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_LOG_FAIL,
                authState,
                authState => getMinerLog(
                    count,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function sortMinerLog(entries, field, asc) {
    return async dispatch => {
        sortLogEntries(entries, field, asc);

        dispatch({
            type: SORT_MINER_LOG,
            payload: { entries },
        });
    };
}

export function getConfig() {
    return async dispatch => {
        dispatch({
            type: GET_CONFIG,
        });
    };
}

export function exportConfig(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: EXPORT_CONFIG_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/miner/config/export'),
                {
                    headers: {
                        Authorization: authState.access_token,
                        Accept: 'application/json, application/octet-stream',
                        'X-Bman-Otp-Token': authState.otpToken,
                    },
                    responseType: 'blob',
                }
            );

            dispatch({
                type: EXPORT_CONFIG_SUCCESS,
            });

            const fileNameHeader = 'x-suggested-filename';
            const suggestedFileName = response.headers[fileNameHeader];

            const effectiveFileName = suggestedFileName === undefined ?
                'miner.config' : suggestedFileName;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', effectiveFileName);
            document.body.appendChild(link);
            link.click();

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                EXPORT_CONFIG_FAIL,
                authState,
                (authState, successCallback) =>
                    exportConfig(authState, successCallback)(dispatch)
            )(dispatch);
        }
    };
}

export function importConfig(file, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: IMPORT_CONFIG_REQUEST,
        });

        try {
            const formData = new FormData();
            formData.append('minerConfig', file);

            const response = await axios.post(
                makeAPIUrl('/api/miner/config/import'),
                formData,
                { headers: {
                    Authorization: authState.access_token,
                    'Content-Type': 'multipart/form-data',
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: IMPORT_CONFIG_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                IMPORT_CONFIG_FAIL,
                authState,
                (authState, successCallback) => importConfig(
                    file,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getMinerStat(authState, successCallback = null, refreshTokenCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_STAT_REQUEST,
        });

        try {
            const source = 'miner';

            const response = await axios.get(
                makeAPIUrl('/api/miner/stat'),
                { headers: { Authorization: authState.access_token } }
            );

            const data = response.data;

            if (data.stat) {
                data.stat = calculateThreats(source, data.stat);
            }

            dispatch({
                type: GET_MINER_STAT_SUCCESS,
                payload: data,
            });

            setThreats(data.stat, source)(dispatch);

            if (successCallback) {
                successCallback(data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_STAT_FAIL,
                authState,
                refreshTokenCallback
            )(dispatch);
        }
    };
}

export function getMinerMetrics(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_METRICS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/miner/metrics'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_MINER_METRICS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_METRICS_FAIL,
                authState,
                authState => getMinerMetrics(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getMinerSeries(metrics, since, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_MINER_SERIES_REQUEST,
        });

        try {
            const metricsQuery = metrics && metrics.length > 0 ? metrics.join() : 'all';

            const response = await axios.get(
                makeAPIUrl(`/api/miner/series/${ metricsQuery }?since=${ since }`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_MINER_SERIES_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_MINER_SERIES_FAIL,
                authState,
                authState => getMinerSeries(
                    metrics,
                    since,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function runMinerAction(action, authState, successCallback = null) {
    return async dispatch => {
        const request = { action };

        dispatch({
            type: RUN_MINER_ACTION_REQUEST,
            payload: request,
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/miner/action'),
                request,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: RUN_MINER_ACTION_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                RUN_MINER_ACTION_FAIL,
                authState,
                (authState, successCallback) => runMinerAction(
                    action,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function clearMinerAction() {
    return async dispatch => {
        dispatch({
            type: CLEAR_MINER_ACTION,
        });
    }
}

export function ping(successCallback = null) {
    return async dispatch => {
        dispatch({
            type: PING_REQUEST,
        });

        try {
            await axios.get(makeAPIUrl('/api/ping'));

            dispatch({
                type: PING_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(e, PING_FAIL)(dispatch);
        }
    };
}
