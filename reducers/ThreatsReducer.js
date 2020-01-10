import {
    SET_THREATS,
} from '../actions/CommonActions'

const initialState = {
    red: [],
    yellow: [],
}

const threatsReducer = (state = initialState, action) => {
    switch (action.type) {
    case SET_THREATS:
        return {
            ...state,
            red: action.payload.red.concat(
                state.red.filter(item => item.source != action.payload.source)
            ),
            yellow: action.payload.yellow.concat(
                state.yellow.filter(item => item.source != action.payload.source)
            ),
        };
    default:
        return state;
    }
}

export default threatsReducer;
