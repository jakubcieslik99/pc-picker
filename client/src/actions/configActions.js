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
import axios from 'axios'

const listConfigsAction = (searchKeyword, sortOrder, page) => async (dispatch) => {
    try {
        dispatch({type: LIST_CONFIGS_REQUEST})
        const parameters = {
            //searchKeyword: searchKeyword,
            sortOrder: sortOrder,
            page: page,
            count: 0
        }
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/configs?searchKeyword=' + searchKeyword + '&sortOrder=' + sortOrder + '&page=' + page + '&limit=9')
        parameters.count = parseInt(data.count)
        dispatch({type: LIST_CONFIGS_SUCCESS, payload: {configs: data.configs, parameters}})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_CONFIGS_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_CONFIGS_FAIL, payload: error.response.data.message})
    }
}
const listConfigsErrorReset = () => (dispatch) => {
    dispatch({type: LIST_CONFIGS_ERROR_RESET})
}
const detailsConfigAction = (configId) => async (dispatch) => {
    try {
        dispatch({type: DETAILS_CONFIG_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/configs/' + configId)
        dispatch({type: DETAILS_CONFIG_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DETAILS_CONFIG_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DETAILS_CONFIG_FAIL, payload: error.response.data.message})
    }
}
const detailsConfigSuccessReset = () => (dispatch) => {
    dispatch({type: DETAILS_CONFIG_SUCCESS_RESET})
}
const detailsConfigReset = () => (dispatch) => {
    dispatch({type: DETAILS_CONFIG_RESET})
}

const saveManagedConfigAction = (configtData) => async (dispatch, getState) => {
    try {
        dispatch({type: SAVE_MANAGED_CONFIG_REQUEST})
        const {listUser: {userInfo}} = getState()

        if(!configtData.id) {
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/configs', configtData, userInfo && {
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_CONFIG_SUCCESS, payload: data})
        }
        else {
            const {data} = await axios.put(process.env.REACT_APP_API_URL + '/configs/' + configtData.id, configtData, userInfo && {
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_CONFIG_SUCCESS, payload: data})
        }
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SAVE_MANAGED_CONFIG_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SAVE_MANAGED_CONFIG_FAIL, payload: error.response.data.message})
    }
}
const saveManagedConfigReset = () => (dispatch) => {
    dispatch({type: SAVE_MANAGED_CONFIG_RESET})
}
const deleteManagedConfigAction = (configId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_MANAGED_CONFIG_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/configs/' + configId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_MANAGED_CONFIG_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_MANAGED_CONFIG_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_MANAGED_CONFIG_FAIL, payload: error.response.data.message})
    }
}
const deleteManagedConfigReset = () => (dispatch) => {
    dispatch({type: DELETE_MANAGED_CONFIG_RESET})
}

export {listConfigsAction, listConfigsErrorReset, detailsConfigAction, detailsConfigSuccessReset, detailsConfigReset, saveManagedConfigAction, saveManagedConfigReset, deleteManagedConfigAction, deleteManagedConfigReset}
