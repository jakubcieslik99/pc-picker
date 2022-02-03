import {
    LIST_CONFIGS_REQUEST,
    LIST_CONFIGS_SUCCESS,
    LIST_CONFIGS_FAIL,
    LIST_CONFIGS_ERROR_RESET,
    DETAILS_CONFIG_REQUEST,
    DETAILS_CONFIG_SUCCESS,
    DETAILS_CONFIG_FAIL,
    DETAILS_CONFIG_SUCCESS_RESET,
    DETAILS_CONFIG_RESET,
    SAVE_MANAGED_CONFIG_REQUEST,
    SAVE_MANAGED_CONFIG_SUCCESS,
    SAVE_MANAGED_CONFIG_FAIL,
    SAVE_MANAGED_CONFIG_RESET,
    DELETE_MANAGED_CONFIG_REQUEST,
    DELETE_MANAGED_CONFIG_SUCCESS,
    DELETE_MANAGED_CONFIG_FAIL,
    DELETE_MANAGED_CONFIG_RESET
} from '../constants/configConstants'

const listConfigsReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_CONFIGS_REQUEST:
            return {...state, loading: true}
        case LIST_CONFIGS_SUCCESS:
            return {...state, loading: false, configs: action.payload.configs, parameters: action.payload.parameters}
        case LIST_CONFIGS_FAIL:
            return {...state, loading: false, error: action.payload}
        case LIST_CONFIGS_ERROR_RESET:
            return {...state, error: null}
        default:
            return state
    }
}
const detailsConfigReducer = (state = {}, action) => {
    switch(action.type) {
        case DETAILS_CONFIG_REQUEST:
            return {loading: true}
        case DETAILS_CONFIG_SUCCESS:
            return {loading: false, success: true, config: action.payload}
        case DETAILS_CONFIG_FAIL:
            return {loading: false, error: action.payload}
        case DETAILS_CONFIG_SUCCESS_RESET:
            return {...state, success: null}
        case DETAILS_CONFIG_RESET:
            return {}
        default:
            return state
    }
}

const saveManagedConfigReducer = (state = {}, action) => {
    switch(action.type) {
        case SAVE_MANAGED_CONFIG_REQUEST:
            return {loading: true}
        case SAVE_MANAGED_CONFIG_SUCCESS:
            return {loading: false, message: action.payload.message, config: action.payload.config}
        case SAVE_MANAGED_CONFIG_FAIL:
            return {loading: false, error: action.payload}
        case SAVE_MANAGED_CONFIG_RESET:
            return {}
        default:
            return state
    }
}
const deleteManagedConfigReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_MANAGED_CONFIG_REQUEST:
            return {loading: true}
        case DELETE_MANAGED_CONFIG_SUCCESS:
            return {loading: false, message: action.payload.message}
        case DELETE_MANAGED_CONFIG_FAIL:
            return {loading: false, error: action.payload}
        case DELETE_MANAGED_CONFIG_RESET:
            return {}
        default:
            return state
    }
}

export {listConfigsReducer, detailsConfigReducer, saveManagedConfigReducer, deleteManagedConfigReducer}
