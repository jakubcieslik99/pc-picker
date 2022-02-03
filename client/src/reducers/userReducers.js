import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USER_RESET,
    LOGOUT_USER,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAIL,
    LIST_USER_MESSAGE_ERROR_RESET,
    CONFIRM_USER_REQUEST,
    CONFIRM_USER_SUCCESS,
    CONFIRM_USER_FAIL,
    LIST_USER_PROFILE_REQUEST,
    LIST_USER_PROFILE_SUCCESS,
    LIST_USER_PROFILE_FAIL
} from '../constants/userConstants'

const listUserReducer = (state = {
    userInfo: {}
}, action) => {
    switch(action.type) {
        case REGISTER_USER_REQUEST:
            return {loading: true}
        case REGISTER_USER_SUCCESS:
            return {loading: false, message: action.payload.message}
        case REGISTER_USER_FAIL:
            return {loading: false, error: action.payload}
        case LOGIN_USER_REQUEST:
            return {loading: true}
        case LOGIN_USER_SUCCESS:
            return {loading: false, userInfo: action.payload}
        case LOGIN_USER_FAIL:
            return {loading: false, error: action.payload}
        case UPDATE_USER_REQUEST:
            return {...state, loading: true}
        case UPDATE_USER_SUCCESS:
            return {
                loading: false, 
                message: action.payload.message,
                userInfo: action.payload.data
            }
        case UPDATE_USER_FAIL:
            return {...state, loading: false, error: action.payload}
        case UPDATE_USER_RESET:
            return {userInfo: {...state.userInfo}}
        case LOGOUT_USER:
            return {userInfo: null}
        case FETCH_USER_REQUEST:
            return {...state, loading: true}
        case FETCH_USER_SUCCESS:
            return {...state, loading: false}
        case FETCH_USER_FAIL:
            return {...state, loading: false, error: action.payload}
        case LIST_USER_MESSAGE_ERROR_RESET:
            return {...state, message: null, error: null}
        default:
            return state
    }
}

const confirmUserReducer = (state = {}, action) => {
    switch(action.type) {
        case CONFIRM_USER_REQUEST:
            return {loading: true}
        case CONFIRM_USER_SUCCESS:
            return {loading: false, message: action.payload.message}
        case CONFIRM_USER_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

const listUserProfileReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_USER_PROFILE_REQUEST:
            return {loading: true}
        case LIST_USER_PROFILE_SUCCESS:
            return {loading: false, nick: action.payload.nick, isAdmin: action.payload.isAdmin, components: action.payload.components, configs: action.payload.configs}
        case LIST_USER_PROFILE_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export {listUserReducer, confirmUserReducer, listUserProfileReducer}
