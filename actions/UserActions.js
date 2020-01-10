import axios from 'axios';
import { makeAPIUrl } from '../store/utils';
import { exceptionHandler } from './CommonActions';

export const USER_CURRENT_REQUEST = 'USER_CURRENT_REQUEST';
export const USER_CURRENT_SUCCESS = 'USER_CURRENT_SUCCESS';
export const USER_CURRENT_FAIL = 'USER_CURRENT_FAIL';

export const GET_USER_SETTINGS_REQUEST = 'GET_USER_SETTINGS_REQUEST';
export const GET_USER_SETTINGS_SUCCESS = 'GET_USER_SETTINGS_SUCCESS';
export const GET_USER_SETTINGS_FAIL = 'GET_USER_SETTINGS_FAIL';

export const PUT_USER_SETTINGS_REQUEST = 'PUT_USER_SETTINGS_REQUEST';
export const PUT_USER_SETTINGS_SUCCESS = 'PUT_USER_SETTINGS_SUCCESS';
export const PUT_USER_SETTINGS_FAIL = 'PUT_USER_SETTINGS_FAIL';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';

export const POST_USER_ASSISTANCE_REQUEST = 'POST_USER_ASSISTANCE_REQUEST';
export const POST_USER_ASSISTANCE_SUCCESS = 'POST_USER_ASSISTANCE_SUCCESS';
export const POST_USER_ASSISTANCE_FAIL = 'POST_USER_ASSISTANCE_FAIL';
export const CLEAR_USER_ASSISTANCE = 'CLEAR_USER_ASSISTANCE';

export function userCurrent(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: USER_CURRENT_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/user/current'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: USER_CURRENT_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            exceptionHandler(
                e,
                USER_CURRENT_FAIL,
                authState,
                authState => userCurrent(authState, successCallback)(dispatch)
            )(dispatch);
        }
    }
}

export function getUserSettings(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: GET_USER_SETTINGS_REQUEST,
        });

        try {
            const response = await axios.get(
                makeAPIUrl('/api/user/current/settings'),
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: GET_USER_SETTINGS_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                GET_USER_SETTINGS_FAIL,
                authState,
                authState => getUserSettings(
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function putUserSettings(userSettings, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: PUT_USER_SETTINGS_REQUEST,
        });

        try {
            await axios.put(
                makeAPIUrl('/api/user/current/settings'),
                userSettings,
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: PUT_USER_SETTINGS_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                PUT_USER_SETTINGS_FAIL,
                authState,
                (authState, successCallback) => putUserSettings(
                    userSettings,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function changePassword(oldPassword, newPassword, confirmPassword, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: CHANGE_PASSWORD_REQUEST,
        });

        try {
            if (newPassword != confirmPassword) {
                throw new Error('Password and password confirmation do not match');
            }

            await axios.post(
                makeAPIUrl('/api/user/current/password'),
                {
                    current: oldPassword,
                    new: newPassword,
                },
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: CHANGE_PASSWORD_SUCCESS,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                CHANGE_PASSWORD_FAIL,
                authState,
                (authState, successCallback) => changePassword(
                    oldPassword,
                    newPassword,
                    confirmPassword,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    }
}

export function postUserAssistance(data, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: POST_USER_ASSISTANCE_REQUEST,
        });

        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));

            const response = await axios.post(
                makeAPIUrl('/api/user/assistance'),
                formData,
                { headers: {
                    Authorization: authState.access_token,
                    'Content-Type': 'multipart/form-data',
                }}
            );

            dispatch({
                type: POST_USER_ASSISTANCE_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                POST_USER_ASSISTANCE_FAIL,
                authState,
                authState => postUserAssistance(
                    data,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function clearUserAssistance() {
    return async dispatch => {
        dispatch({
            type: CLEAR_USER_ASSISTANCE,
        });
    }
}
