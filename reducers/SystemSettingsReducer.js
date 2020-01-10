import {
    GET_SYSTEM_SETTINGS_REQUEST,
    GET_SYSTEM_SETTINGS_SUCCESS,
    GET_SYSTEM_SETTINGS_FAIL,
    PUT_SYSTEM_SETTINGS_REQUEST,
    PUT_SYSTEM_SETTINGS_SUCCESS,
    PUT_SYSTEM_SETTINGS_FAIL,
    GET_TLS_CERTIFICATE,
    SEND_TLS_CERTIFICATE_REQUEST,
    SEND_TLS_CERTIFICATE_SUCCESS,
    SEND_TLS_CERTIFICATE_FAIL,
} from '../actions/SystemActions'

const initialState = {
    isFetching: null,
    success: false,
    settings: {
        autoUpdate: false,
        postTelemetry: false,
        publicStat: false,
        useCustomSmtp: false,
        smtp: {
            host: '',
            port: 0,
            username: '',
            password: '',
            ssl: false,
            fromAddress: '',
        }
    },
    isSaved: false,
    error: {
        code: null,
        message: '',
    },
}

const systemSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_SYSTEM_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_SYSTEM_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            settings: action.payload.settings,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_SYSTEM_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case PUT_SYSTEM_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_SYSTEM_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_SYSTEM_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case GET_TLS_CERTIFICATE:
        return {
            ...state,
            isFetching: false,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case SEND_TLS_CERTIFICATE_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case SEND_TLS_CERTIFICATE_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            success: action.payload.success,
            error: {
                code: null,
                message: '',
            },
        };
    case SEND_TLS_CERTIFICATE_FAIL:
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

export default systemSettingsReducer;
