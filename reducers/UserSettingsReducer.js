import {
    GET_USER_SETTINGS_REQUEST,
    GET_USER_SETTINGS_SUCCESS,
    GET_USER_SETTINGS_FAIL,
    PUT_USER_SETTINGS_REQUEST,
    PUT_USER_SETTINGS_SUCCESS,
    PUT_USER_SETTINGS_FAIL,
} from '../actions/UserActions'

const initialState = {
    isFetching: null,
    success: false,
    user: {
        email: '',
        expiration: 0,
        emailNotifications: false,
        otpLogin: false,
        otpSettings: false,
        otpPassword: false,
        otpRestart: false,
        encryptConfig: false,
    },
    isSaved: false,
    error: {
        code: null,
        message: '',
    },
}

const userSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_USER_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case GET_USER_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            user: Object.assign(state.user, action.payload.user),
            error: {
                code: null,
                message: '',
            },
        };
    case GET_USER_SETTINGS_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case PUT_USER_SETTINGS_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_USER_SETTINGS_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            error: {
                code: null,
                message: '',
            },
        };
    case PUT_USER_SETTINGS_FAIL:
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

export default userSettingsReducer;
