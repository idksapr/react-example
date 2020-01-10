import axios from 'axios';
import { makeAPIUrl, sortLogEntries } from '../store/utils';
import { exceptionHandler } from './CommonActions';

export const GET_SYSTEM_SETTINGS_REQUEST = 'GET_SYSTEM_SETTINGS_REQUEST';
export const GET_SYSTEM_SETTINGS_SUCCESS = 'GET_SYSTEM_SETTINGS_SUCCESS';
export const GET_SYSTEM_SETTINGS_FAIL = 'GET_SYSTEM_SETTINGS_FAIL';

export const PUT_SYSTEM_SETTINGS_REQUEST = 'PUT_SYSTEM_SETTINGS_REQUEST';
export const PUT_SYSTEM_SETTINGS_SUCCESS = 'PUT_SYSTEM_SETTINGS_SUCCESS';
export const PUT_SYSTEM_SETTINGS_FAIL = 'PUT_SYSTEM_SETTINGS_FAIL';

export const GET_TLS_CERTIFICATE = 'GET_TLS_CERTIFICATE';
export const SEND_TLS_CERTIFICATE_REQUEST = 'SEND_TLS_CERTIFICATE_REQUEST';
export const SEND_TLS_CERTIFICATE_SUCCESS = 'SEND_TLS_CERTIFICATE_SUCCESS';
export const SEND_TLS_CERTIFICATE_FAIL = 'SEND_TLS_CERTIFICATE_FAIL';

export const GET_SYSTEM_LOG_REQUEST = 'GET_SYSTEM_LOG_REQUEST';
export const GET_SYSTEM_LOG_SUCCESS = 'GET_SYSTEM_LOG_SUCCESS';
export const GET_SYSTEM_LOG_FAIL = 'GET_SYSTEM_LOG_FAIL';
export const SORT_SYSTEM_LOG = 'SORT_SYSTEM_LOG';
export const SET_SYSTEM_LOG_FILTERS = 'SET_SYSTEM_LOG_FILTERS';
export const SET_SYSTEM_LOG_PAGING = 'SET_SYSTEM_LOG_PAGING';

export const GET_COMPONENTS_REQUEST = 'GET_OMPONENTS_REQUEST';
export const GET_COMPONENTS_SUCCESS = 'GET_COMPONENTS_SUCCESS';
export const GET_COMPONENTS_FAIL = 'GET_COMPONENTS_FAIL';

export const CHECK_COMPONENTS_REQUEST = 'CHECK_COMPONENTS_REQUEST';
export const CHECK_COMPONENTS_SUCCESS = 'CHECK_COMPONENTS_SUCCESS';
export const CHECK_COMPONENTS_FAIL = 'CHECK_COMPONENTS_FAIL';

export const UPGRADE_COMPONENTS_REQUEST = 'UPGRADE_COMPONENTS_REQUEST';
export const UPGRADE_COMPONENTS_SUCCESS = 'UPGRADE_COMPONENTS_SUCCESS';
export const UPGRADE_COMPONENTS_FAIL = 'UPGRADE_COMPONENTS_FAIL';

export const CLEAR_UPLOAD_COMPONENTS = 'CLEAR_UPLOAD_COMPONENTS';
export const UPLOAD_COMPONENTS_REQUEST = 'UPLOAD_COMPONENTS_REQUEST';
export const UPLOAD_COMPONENTS_SUCCESS = 'UPLOAD_COMPONENTS_SUCCESS';
export const UPLOAD_COMPONENTS_FAIL = 'UPLOAD_COMPONENTS_FAIL';

export function getSystemSettings(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_SYSTEM_SETTINGS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/system/settings'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_SYSTEM_SETTINGS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_SYSTEM_SETTINGS_FAIL,
                authState,
                authState => getSystemSettings(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function putSystemSettings(systemSettings, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: PUT_SYSTEM_SETTINGS_REQUEST,
        });

        try {
            await axios.put(
                makeAPIUrl('/api/system/settings'),
                systemSettings,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: PUT_SYSTEM_SETTINGS_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                PUT_SYSTEM_SETTINGS_FAIL,
                authState,
                (authState, successCallback) => putSystemSettings(
                    systemSettings,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getTlsCertificate() {
    return async dispatch => {
        dispatch({
            type: GET_TLS_CERTIFICATE,
        });
    };
}

export function sendTlsCertificate(file, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: SEND_TLS_CERTIFICATE_REQUEST,
        });

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                makeAPIUrl('/api/system/cert'),
                formData,
                { headers: {
                    Authorization: authState.access_token,
                    'Content-Type': 'multipart/form-data',
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: SEND_TLS_CERTIFICATE_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                SEND_TLS_CERTIFICATE_FAIL,
                authState,
                (authState, successCallback) => sendTlsCertificate(
                    file,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function getSystemLog(count, filters, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_SYSTEM_LOG_REQUEST,
        });

        try {
            let filterQuery = '';

            if (filters.type) {
                filterQuery += `&actions=${filters.type}`;
            }

            if (filters.date) {
                if (filters.date.startTimestamp) {
                    filterQuery += `&since=${filters.date.startTimestamp}`;
                }
                if (filters.date.endTimestamp) {
                    filterQuery += `&till=${filters.date.endTimestamp}`;
                }
            }

            if (filters.ip) {
                filterQuery += `&ip=${filters.ip}`;
            }

            if (filters.ipProxy) {
                filterQuery += `&ipproxy=${filters.ipProxy}`;
            }

            const response = await axios.get(
                makeAPIUrl(`/api/system/log?limit=${count}${filterQuery}`),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_SYSTEM_LOG_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_SYSTEM_LOG_FAIL,
                authState,
                authState => getSystemLog(
                    count,
                    filters,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function sortSystemLog(entries, field, asc) {
    return async dispatch => {
        sortLogEntries(entries, field, asc);

        dispatch({
            type: SORT_SYSTEM_LOG,
            payload: { entries },
        });
    };
}

export function setSystemLogFilters(filters) {
    return async dispatch => {
        dispatch({
            type: SET_SYSTEM_LOG_FILTERS,
            payload: { filters },
        });
    };
}

export function setSystemLogPaging(paging) {
    return async dispatch => {
        dispatch({
            type: SET_SYSTEM_LOG_PAGING,
            payload: { paging },
        });
    };
}

export function getComponents(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_COMPONENTS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/system/components'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_COMPONENTS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_COMPONENTS_FAIL,
                authState,
                authState => getComponents(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function checkComponents(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: CHECK_COMPONENTS_REQUEST,
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/system/components/check'),
                null,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: CHECK_COMPONENTS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                CHECK_COMPONENTS_FAIL,
                authState,
                (authState, successCallback) => checkComponents(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function upgradeComponents(upgradablePackage, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: UPGRADE_COMPONENTS_REQUEST,
            payload: { upgradablePackage }
        });

        try {
            const response = await axios.post(
                makeAPIUrl(`/api/system/components/upgrade/${upgradablePackage}`),
                null,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: UPGRADE_COMPONENTS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                UPGRADE_COMPONENTS_FAIL,
                authState,
                (authState, successCallback) => upgradeComponents(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function uploadComponents(file, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: UPLOAD_COMPONENTS_REQUEST,
        });

        try {
            const formData = new FormData();
            formData.append('updatePackage', file);

            const response = await axios.post(
                makeAPIUrl('/api/system/components/upload'),
                formData,
                { headers: {
                    Authorization: authState.access_token,
                    'Content-Type': 'multipart/form-data',
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: UPLOAD_COMPONENTS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                UPLOAD_COMPONENTS_FAIL,
                authState,
                (authState, successCallback) => uploadComponents(
                    file,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function clearUploadComponents() {
    return async dispatch => {
        dispatch({
            type: CLEAR_UPLOAD_COMPONENTS,
        });
    };
}
