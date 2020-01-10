import {
    CLEAR_OTP_REQUEST,
    SET_OTP_REDIRECT,
    SET_OTP_RESTORING_CALLBACK,
    SET_OTP_VALIDATION_CODE,
    OTP_CONFIRM,
    OTP_REQUEST,
    OTP_REQUEST_SUCCESS,
    OTP_REQUEST_FAIL,
    OTP_VALIDATE_REQUEST,
    OTP_VALIDATE_SUCCESS,
    OTP_VALIDATE_FAIL,
} from '../actions/AuthActions'

const initialState = {
    isFetching: null,
    step: '',
    redirect: '',
    restoringCallback: null,
    success: false,
    otpMethod: '',
    stateToken: '',
    code: '',
    expiresIn: 0,
    message: '',
    path: '',
    error: {
        code: null,
        message: '',
    },
}

const otpReducer = (state = initialState, action) => {
    switch (action.type) {
    case CLEAR_OTP_REQUEST:
        return initialState;
    case SET_OTP_REDIRECT:
        return {
            ...state,
            redirect: action.payload.redirect,
        };
    case SET_OTP_RESTORING_CALLBACK:
        return {
            ...state,
            restoringCallback: action.payload.restoringCallback,
        };
    case SET_OTP_VALIDATION_CODE:
        return {
            ...state,
            code: action.payload.code,
        };
    case OTP_REQUEST:
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
    case OTP_CONFIRM:
        return {
            ...state,
            isFetching: true,
            step: 'confirm',
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_VALIDATE_REQUEST:
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
    case OTP_REQUEST_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            otpMethod: action.payload.otpMethod,
            stateToken: action.payload.stateToken,
            expiresIn: action.payload.expiresIn,
            message: action.payload.message,
            path: action.payload.path,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_VALIDATE_SUCCESS:
        return {
            ...state,
            isFetching: false,
            success: action.payload.success,
            error: {
                code: null,
                message: '',
            },
        };
    case OTP_REQUEST_FAIL:
    case OTP_VALIDATE_FAIL:
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

export default otpReducer;
