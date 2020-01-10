import {
    CLEAR_OTP_SETUP_REQUEST,
    SET_OTP_SETUP_METHOD,
    SET_OTP_SETUP_VALIDATION_CODE,
    OTP_SETUP_REQUEST,
    OTP_SETUP_REQUEST_SUCCESS,
    OTP_SETUP_REQUEST_FAIL,
    OTP_SETUP_VALIDATE_REQUEST,
    OTP_SETUP_VALIDATE_SUCCESS,
    OTP_SETUP_VALIDATE_FAIL,
} from '../actions/AuthActions'

const initialState = {
    isFetching: null,
    step: '',
    success: false,
    otpMethod: '',
    stateToken: '',
    code: '',
    expiresIn: 0,
    message: '',
    secret: '',
    secretURI: '',
    path: '',
    error: {
        code: null,
        message: '',
    },
}

const otpSetupReducer = (state = initialState, action) => {
    switch (action.type) {
    case CLEAR_OTP_SETUP_REQUEST:
        return initialState;
    case SET_OTP_SETUP_METHOD:
        return {
            ...state,
            otpMethod: action.payload.otpMethod,
        };
    case SET_OTP_SETUP_VALIDATION_CODE:
        return {
            ...state,
            code: action.payload.code,
        };
    case OTP_SETUP_REQUEST:
        return {
            ...state,
            isFetching: true,
            step: 'request',
            otpMethod: action.payload.otpMethod,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_SETUP_VALIDATE_REQUEST:
        return {
            ...state,
            isFetching: true,
            step: 'validate',
            stateToken: action.payload.stateToken,
            code: action.payload.code,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_SETUP_REQUEST_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            otpMethod: action.payload.otpMethod,
            stateToken: action.payload.stateToken,
            expiresIn: action.payload.expiresIn,
            message: action.payload.message,
            secret: action.payload.secret,
            secretURI: action.payload.secretURI,
            path: action.payload.path,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_SETUP_VALIDATE_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_SETUP_REQUEST_FAIL:
    case OTP_SETUP_VALIDATE_FAIL:
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

export default otpSetupReducer;
