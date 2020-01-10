import {
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAIL,
    AUTH_LOGOUT_REQUEST,
    AUTH_LOGOUT_SUCCESS,
    AUTH_LOGOUT_FAIL,
    REFRESH_TOKEN_REQUEST,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAIL,
    ERROR_TYPE_LOGIN,
    ERROR_TYPE_LOGOUT,
    ERROR_TYPE_REFRESH,
    OTP_VALIDATE_SUCCESS,
    CLEAR_OTP_REQUEST,
} from '../actions/AuthActions'

import { reHydrateStore } from '../store/configureStore';

const defaultInitialState = {
    isRefreshing: false,
    isFetching: false,
    authed: false,
    email: '',
    access_token: '',
    refresh_token: '',
    otpToken: '',
    expires_in: 0,
    error: {
        type: null,
        code: null,
        message: '',
    },
};

const stateFromStorage = reHydrateStore();

const initialState = (stateFromStorage && stateFromStorage.authState && stateFromStorage.authState.access_token) ?
    Object.assign(defaultInitialState, stateFromStorage.authState) :
    defaultInitialState;

const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case AUTH_LOGIN_REQUEST:
        return {
            ...state,
            isFetching: true,
        };
    case AUTH_LOGIN_SUCCESS:
        return {
            ...state,
            isFetching: false,
            authed: action.payload.success,
            email: action.payload.email,
            access_token: action.payload.access_token,
            refresh_token: action.payload.refresh_token,
            expires_in: action.payload.expires_in,
            error: {
                type: null,
                code: null,
                message: '',
            },
        };
    case AUTH_LOGIN_FAIL:
        return {
            ...state,
            isFetching: false,
            error: { ...action.payload.error, type: ERROR_TYPE_LOGIN },
        };
    case AUTH_LOGOUT_REQUEST:
        return {
            ...state,
            isFetching: true,
        };
    case AUTH_LOGOUT_SUCCESS:
        return {
            ...state,
            isFetching: false,
            authed: false,
            access_token: '',
            refresh_token: '',
            expires_in: 0,
            otpToken: '',
            error: {
                type: null,
                code: null,
                message: '',
            },
        };
    case AUTH_LOGOUT_FAIL:
        return {
            ...state,
            isFetching: false,
            error: { ...action.payload.error, type: ERROR_TYPE_LOGOUT },
        };
    case REFRESH_TOKEN_REQUEST:
        return {
            ...state,
            isRefreshing: true,
        };
    case REFRESH_TOKEN_SUCCESS:
        return {
            ...state,
            isRefreshing: false,
            authed: action.payload.success,
            email: action.payload.email,
            access_token: action.payload.access_token,
            refresh_token: action.payload.refresh_token,
            expires_in: action.payload.expires_in,
            error: {
                type: null,
                code: null,
                message: '',
            },
        };
    case REFRESH_TOKEN_FAIL:
        return {
            ...state,
            isRefreshing: false,
            authed: false,
            email: '',
            access_token: '',
            refresh_token: '',
            error: { ...action.payload.error, type: ERROR_TYPE_REFRESH },
        };
    case OTP_VALIDATE_SUCCESS:
        return {
            ...state,
            otpToken: action.payload.otpToken,
        };
    case CLEAR_OTP_REQUEST:
        return {
            ...state,
            otpToken: '',
        };
    default:
        return state;
    }
}

export default authReducer;
