import {
    USER_CURRENT_REQUEST,
    USER_CURRENT_SUCCESS,
    USER_CURRENT_FAIL,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
} from '../actions/UserActions'

const initialState = {
    isFetching: null,
    success: false,
    user: {
        id: '',
        email: '',
        role: '',
        otpMethod: '',
        pwdChangeRequired: false,
        sessionTimeout: 0,
    },
    isSaved: false,
    error: {
        code: null,
        message: '',
    },
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
    case USER_CURRENT_REQUEST:
        return {
            ...state,
            isFetching: true,
            error: {
                code: null,
                message: '',
            },
        };
    case USER_CURRENT_SUCCESS:
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
    case USER_CURRENT_FAIL:
        return {
            ...state,
            isFetching: false,
            success: false,
            error: action.payload.error,
        };
    case CHANGE_PASSWORD_REQUEST:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            error: {
                code: null,
                message: '',
            },
        };
    case CHANGE_PASSWORD_SUCCESS:
        return {
            ...state,
            isFetching: false,
            isSaved: true,
            error: {
                code: null,
                message: '',
            },
        };
    case CHANGE_PASSWORD_FAIL:
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

export default userReducer;
