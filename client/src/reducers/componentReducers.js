import {
    LIST_COMPONENTS_REQUEST,
    LIST_COMPONENTS_SUCCESS,
    LIST_COMPONENTS_FAIL,
    LIST_COMPONENTS_ERROR_RESET,
    DETAILS_COMPONENT_REQUEST,
    DETAILS_COMPONENT_SUCCESS,
    DETAILS_COMPONENT_FAIL,
    DETAILS_COMPONENT_SUCCESS_RESET,
    DETAILS_COMPONENT_RESET,
    SAVE_MANAGED_COMPONENT_REQUEST,
    SAVE_MANAGED_COMPONENT_UPLOADING,
    SAVE_MANAGED_COMPONENT_SUCCESS,
    SAVE_MANAGED_COMPONENT_FAIL,
    SAVE_MANAGED_COMPONENT_RESET,
    DELETE_MANAGED_COMPONENT_REQUEST,
    DELETE_MANAGED_COMPONENT_SUCCESS,
    DELETE_MANAGED_COMPONENT_FAIL,
    DELETE_MANAGED_COMPONENT_RESET
} from '../constants/componentConstants'

const listComponentsReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_COMPONENTS_REQUEST:
            return {...state, loading: true}
        case LIST_COMPONENTS_SUCCESS:
            return {...state, loading: false, components: action.payload.components, parameters: action.payload.parameters}
        case LIST_COMPONENTS_FAIL:
            return {...state, loading: false, error: action.payload}
        case LIST_COMPONENTS_ERROR_RESET:
            return {...state, error: null}
        default:
            return state
    }
}
const detailsComponentReducer = (state = {}, action) => {
    switch(action.type) {
        case DETAILS_COMPONENT_REQUEST:
            return {loading: true}
        case DETAILS_COMPONENT_SUCCESS:
            return {loading: false, success: true, component: action.payload}
        case DETAILS_COMPONENT_FAIL:
            return {loading: false, error: action.payload}
        case DETAILS_COMPONENT_SUCCESS_RESET:
            return {...state, success: null}
        case DETAILS_COMPONENT_RESET:
            return {}
        default:
            return state
    }
}

const saveManagedComponentReducer = (state = {}, action) => {
    switch(action.type) {
        case SAVE_MANAGED_COMPONENT_REQUEST:
            return {loading: true}
        case SAVE_MANAGED_COMPONENT_UPLOADING:
            return {...state, progress: action.payload}
        case SAVE_MANAGED_COMPONENT_SUCCESS:
            return {loading: false, progress: 100, message: action.payload.message, component: action.payload.component}
        case SAVE_MANAGED_COMPONENT_FAIL:
            return {loading: false, progress: 0, error: action.payload}
        case SAVE_MANAGED_COMPONENT_RESET:
            return {}
        default:
            return state
    }
}
const deleteManagedComponentReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_MANAGED_COMPONENT_REQUEST:
            return {loading: true}
        case DELETE_MANAGED_COMPONENT_SUCCESS:
            return {loading: false, message: action.payload.message}
        case DELETE_MANAGED_COMPONENT_FAIL:
            return {loading: false, error: action.payload}
        case DELETE_MANAGED_COMPONENT_RESET:
            return {}
        default:
            return state
    }
}

export {listComponentsReducer, detailsComponentReducer, saveManagedComponentReducer, deleteManagedComponentReducer}
