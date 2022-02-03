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
import axios from 'axios'

const listComponentsAction = (step, searchKeyword, page) => async (dispatch) => {
    try {
        dispatch({type: LIST_COMPONENTS_REQUEST})
        let type = 'case'
        step==='2' ? type = 'cpu' : 
        step==='3' ? type = 'mobo' : 
        step==='4' ? type = 'ram' : 
        step==='5' ? type = 'gpu' : 
        step==='6' ? type = 'psu' : 
        step==='7' ? type = 'drive' : 
        type = 'case'

        let parameters = {
            //searchKeyword: searchKeyword,
            page: page,
            count: 0
        }
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/components/type/' + type + '?searchKeyword=' + searchKeyword + '&page=' + page + '&limit=6')
        parameters.count = parseInt(data.count)
        dispatch({type: LIST_COMPONENTS_SUCCESS, payload: {components: data.components, parameters}})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_COMPONENTS_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_COMPONENTS_FAIL, payload: error.response.data.message})
    }
}
const listComponentsErrorReset = () => (dispatch) => {
    dispatch({type: LIST_COMPONENTS_ERROR_RESET})
}
const detailsComponentAction = (componentId) => async (dispatch) => {
    try {
        dispatch({type: DETAILS_COMPONENT_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/components/' + componentId)
        dispatch({type: DETAILS_COMPONENT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DETAILS_COMPONENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DETAILS_COMPONENT_FAIL, payload: error.response.data.message})
    }
}
const detailsComponentSuccessReset = () => (dispatch) => {
    dispatch({type: DETAILS_COMPONENT_SUCCESS_RESET})
}
const detailsComponentReset = () => (dispatch) => {
    dispatch({type: DETAILS_COMPONENT_RESET})
}

const saveManagedComponentAction = (componentData) => async (dispatch, getState) => {
    try {
        dispatch({type: SAVE_MANAGED_COMPONENT_REQUEST})
        const {listUser: {userInfo}} = getState()

        const parsedComponentData = new FormData()
        parsedComponentData.append('type', componentData.type)
        parsedComponentData.append('name', componentData.name)
        parsedComponentData.append('link', componentData.link)
        parsedComponentData.append('caseCompatibility', componentData.caseCompatibility)
        parsedComponentData.append('cpuCompatibility', componentData.cpuCompatibility)
        parsedComponentData.append('ramCompatibility', componentData.ramCompatibility)
        componentData.fetchedFiles.forEach(fetchedFile => parsedComponentData.append('componentFetchedFiles', fetchedFile))
        componentData.selectedFiles.forEach(selectedFile => parsedComponentData.append('componentSelectedFiles', selectedFile))

        if(!componentData.id) {
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/components', parsedComponentData, userInfo && {
                onUploadProgress: event => {
                    const {loaded, total} = event
                    const progress = Math.floor((loaded * 100) / total)
                    dispatch({type: SAVE_MANAGED_COMPONENT_UPLOADING, payload: progress})
                },
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_COMPONENT_SUCCESS, payload: data})
        }
        else {
            const {data} = await axios.put(process.env.REACT_APP_API_URL + '/components/' + componentData.id, parsedComponentData, userInfo && {
                onUploadProgress: event => {
                    const {loaded, total} = event
                    const progress = Math.floor((loaded * 100) / total)
                    dispatch({type: SAVE_MANAGED_COMPONENT_UPLOADING, payload: progress})
                },
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_COMPONENT_SUCCESS, payload: data})
        }
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SAVE_MANAGED_COMPONENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SAVE_MANAGED_COMPONENT_FAIL, payload: error.response.data.message})
    }
}
const saveManagedComponentReset = () => (dispatch) => {
    dispatch({type: SAVE_MANAGED_COMPONENT_RESET})
}
const deleteManagedComponentAction = (componentId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_MANAGED_COMPONENT_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/components/' + componentId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_MANAGED_COMPONENT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_MANAGED_COMPONENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_MANAGED_COMPONENT_FAIL, payload: error.response.data.message})
    }
}
const deleteManagedComponentReset = () => (dispatch) => {
    dispatch({type: DELETE_MANAGED_COMPONENT_RESET})
}

export {listComponentsAction, listComponentsErrorReset, detailsComponentAction, detailsComponentSuccessReset, detailsComponentReset, saveManagedComponentAction, saveManagedComponentReset, deleteManagedComponentAction, deleteManagedComponentReset}
