import axios from 'axios';
import { makeAPIUrl, makeAPIError } from '../store/utils';
import { unsetTimers, exceptionHandler } from './CommonActions';

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAIL = 'AUTH_LOGIN_FAIL';

export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS';
export const AUTH_LOGOUT_FAIL = 'AUTH_LOGOUT_FAIL';

export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAIL = 'REFRESH_TOKEN_FAIL';

export const OTP_SETUP_REQUEST = 'OTP_SETUP_REQUEST';
export const OTP_SETUP_REQUEST_SUCCESS = 'OTP_SETUP_REQUEST_SUCCESS';
export const OTP_SETUP_REQUEST_FAIL = 'OTP_SETUP_REQUEST_FAIL';

export const OTP_SETUP_VALIDATE_REQUEST = 'OTP_SETUP_VALIDATE_REQUEST';
export const OTP_SETUP_VALIDATE_SUCCESS = 'OTP_SETUP_VALIDATE_SUCCESS';
export const OTP_SETUP_VALIDATE_FAIL = 'OTP_SETUP_VALIDATE_FAIL';

export const OTP_REQUEST = 'OTP_REQUEST';
export const OTP_REQUEST_SUCCESS = 'OTP_REQUEST_SUCCESS';
export const OTP_REQUEST_FAIL = 'OTP_REQUEST_FAIL';

export const OTP_VALIDATE_REQUEST = 'OTP_VALIDATE_REQUEST';
export const OTP_VALIDATE_SUCCESS = 'OTP_VALIDATE_SUCCESS';
export const OTP_VALIDATE_FAIL = 'OTP_VALIDATE_FAIL';

export const OTP_CONFIRM = 'OTP_CONFIRM';
export const CLEAR_OTP_REQUEST = 'CLEAR_OTP_REQUEST';
export const SET_OTP_VALIDATION_CODE = 'SET_OTP_VALIDATION_CODE';
export const SET_OTP_REDIRECT = 'SET_OTP_REDIRECT';
export const SET_OTP_RESTORING_CALLBACK = 'SET_OTP_RESTORING_CALLBACK';

export const CLEAR_OTP_SETUP_REQUEST = 'CLEAR_OTP_SETUP_REQUEST';
export const SET_OTP_SETUP_VALIDATION_CODE = 'SET_OTP_SETUP_VALIDATION_CODE';
export const SET_OTP_SETUP_METHOD = 'SET_OTP_SETUP_METHOD';

export const ERROR_TYPE_LOGIN = 10;
export const ERROR_TYPE_LOGOUT = 11;
export const ERROR_TYPE_REFRESH = 12;

export function authLogin(email, password, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: AUTH_LOGIN_REQUEST,
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/auth/token'),
                {
                    grant_type: 'password',
                    email,
                    password,
                    refresh_token: '',
                },
                { headers: {
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            unsetTimers()(dispatch);

            dispatch({
                type: AUTH_LOGIN_SUCCESS,
                payload: Object.assign({ email }, response.data),
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            dispatch({
                type: AUTH_LOGIN_FAIL,
                payload: { email, error: makeAPIError(e) },
            });
            exceptionHandler(
                e,
                AUTH_LOGIN_FAIL,
                authState,
                (authState, successCallback) => authLogin(
                    email,
                    password,
                    authState,
                    successCallback
                )(dispatch),
            )(dispatch);
        }
    }
}

export function authLogout(authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: AUTH_LOGOUT_REQUEST,
        });

        try {
            await axios.post(
                makeAPIUrl('/api/auth/logout'),
                null,
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: AUTH_LOGOUT_SUCCESS,
            });

            unsetTimers()(dispatch);

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            dispatch({
                type: AUTH_LOGOUT_FAIL,
                payload: { error: makeAPIError(e) },
            });
        }
    }
}

export function authRefreshToken(refreshToken, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: REFRESH_TOKEN_REQUEST,
        });

        try {
            const response = await axios.post(makeAPIUrl('/api/auth/token'), {
                grant_type: 'refresh_token',
                email: '',
                password: '',
                refresh_token: refreshToken,
            });

            dispatch({
                type: REFRESH_TOKEN_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback(response.data);
            }
        } catch (e) {
            dispatch({
                type: REFRESH_TOKEN_FAIL,
                payload: { error: makeAPIError(e) },
            });
        }
    }
}

export function otpSetupRequest(otpMethod, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: OTP_SETUP_REQUEST,
            payload: { otpMethod },
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/otp/setup/request'),
                { otpMethod },
                { headers: {
                    Authorization: authState.access_token,
                    'X-Bman-Otp-Token': authState.otpToken,
                }}
            );

            dispatch({
                type: OTP_SETUP_REQUEST_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                OTP_SETUP_REQUEST_FAIL,
                authState,
                (authState, successCallback) => otpSetupRequest(
                    otpMethod,
                    authState,
                    successCallback
                )(dispatch),
            )(dispatch);
        }
    };
}

export function otpSetupValidate(stateToken, code, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: OTP_SETUP_VALIDATE_REQUEST,
            payload: { stateToken, code },
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/otp/setup/validate'),
                { stateToken, code },
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: OTP_SETUP_VALIDATE_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                OTP_SETUP_VALIDATE_FAIL,
                authState,
                authState => otpSetupValidate(
                    stateToken,
                    code,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function otpRequest(stateToken, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: OTP_REQUEST,
            payload: { stateToken },
        });

        try {
            const headers = { Authorization: authState.access_token };

            if (authState.otpToken) {
                headers['X-Bman-Otp-Token'] = authState.otpToken;
            }

            const response = await axios.post(
                makeAPIUrl('/api/otp/request'),
                { stateToken },
                { headers }
            );

            dispatch({
                type: OTP_REQUEST_SUCCESS,
                payload: response.data,
            });

            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            exceptionHandler(
                e,
                OTP_REQUEST_FAIL,
                authState,
                authState => otpRequest(
                    stateToken,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function otpValidate(stateToken, code, authState, successCallback = null) {
    return async dispatch => {
        dispatch({
            type: OTP_VALIDATE_REQUEST,
            payload: { stateToken, code },
        });

        try {
            const response = await axios.post(
                makeAPIUrl('/api/otp/validate'),
                { stateToken, code },
                { headers: { Authorization: authState.access_token } }
            );

            dispatch({
                type: OTP_VALIDATE_SUCCESS,
                payload: response.data,
            });

            authState.otpToken = response.data.otpToken;

            if (successCallback) {
                successCallback(authState);
            }
        } catch (e) {
            exceptionHandler(
                e,
                OTP_VALIDATE_FAIL,
                authState,
                authState => otpValidate(
                    stateToken,
                    code,
                    authState,
                    successCallback
                )(dispatch)
            )(dispatch);
        }
    };
}

export function clearOtpRequest(setup = false) {
    return async dispatch => {
        dispatch({
            type: setup ?
                CLEAR_OTP_SETUP_REQUEST :
                CLEAR_OTP_REQUEST,
        });
    }
}

export function setOtpMethod(otpMethod) {
    return async dispatch => {
        dispatch({
            type: SET_OTP_SETUP_METHOD,
            payload: { otpMethod },
        });
    }
}

export function setOtpValidationCode(code, setup = false) {
    return async dispatch => {
        dispatch({
            type: setup ?
                SET_OTP_SETUP_VALIDATION_CODE :
                SET_OTP_VALIDATION_CODE,
            payload: { code },
        });
    }
}

export function setOtpRedirect(redirect) {
    return async dispatch => {
        dispatch({
            type: SET_OTP_REDIRECT,
            payload: { redirect },
        });
    }
}

export function setOtpRestoringCallback(restoringCallback) {
    return async dispatch => {
        dispatch({
            type: SET_OTP_RESTORING_CALLBACK,
            payload: { restoringCallback },
        });
    }
}

export function otpConfirm() {
    return async dispatch => {
        dispatch({
            type: OTP_CONFIRM,
        });
    }
}
