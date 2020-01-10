import {
    GET_MINER_SETTINGS_REQUEST,
    GET_MINER_SETTINGS_SUCCESS,
    GET_MINER_SETTINGS_FAIL,
    PUT_MINER_SETTINGS_REQUEST,
    PUT_MINER_SETTINGS_SUCCESS,
    PUT_MINER_SETTINGS_FAIL,
    GET_CONFIG,
    EXPORT_CONFIG_REQUEST,
    EXPORT_CONFIG_SUCCESS,
    EXPORT_CONFIG_FAIL,
    IMPORT_CONFIG_REQUEST,
    IMPORT_CONFIG_SUCCESS,
    IMPORT_CONFIG_FAIL,
} from '../actions/MinerActions'

const initialState = {
    isFetching: null,
    success: false,
    settings: {
        psuVoltage: 0,
        oscillator: 0,
        ocp: 0,
        fanPower: 0,
        logDelay: 0,
    },
    isSaved: false,
    error: {
        code: null,
        message: '',
    },
}

const minerSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_MINER_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_MINER_SETTINGS_SUCCESS:
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
    case GET_MINER_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case PUT_MINER_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_MINER_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_MINER_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case GET_CONFIG:
        return {
            ...state,
            isFetching: false,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case EXPORT_CONFIG_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case EXPORT_CONFIG_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: true,
            error: {
                code: null,
                message: '',
            },
        };
    case EXPORT_CONFIG_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case IMPORT_CONFIG_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case IMPORT_CONFIG_SUCCESS:
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
    case IMPORT_CONFIG_FAIL:
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

export default minerSettingsReducer;
