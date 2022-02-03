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
import axios from 'axios'
import Cookie from 'js-cookie'

const registerUserAction = (registerData) => async (dispatch) => {
    try {
        dispatch({type: REGISTER_USER_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/register', registerData)
        dispatch({type: REGISTER_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: REGISTER_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: REGISTER_USER_FAIL, payload: error.response.data.message})
    }
}
const loginUserAction = (loginData) => async (dispatch) => {
    try {
        dispatch({type: LOGIN_USER_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/login', loginData)
        Cookie.set('userInfo', JSON.stringify(data))
        dispatch({type: LOGIN_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LOGIN_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LOGIN_USER_FAIL, payload: error.response.data.message})
    }
}
const updateUserAction = (updateData) => async (dispatch, getState) => {
    try {
        dispatch({type: UPDATE_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.put(process.env.REACT_APP_API_URL + '/users/update', updateData, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        Cookie.set('userInfo', JSON.stringify(data.data))
        dispatch({type: UPDATE_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: UPDATE_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: UPDATE_USER_FAIL, payload: error.response.data.message})
    }
}
const updateUserReset = () => (dispatch) => {
    dispatch({type: UPDATE_USER_RESET})
}
const logoutUserAction = () => (dispatch) => {
    Cookie.remove('userInfo')
    dispatch({type: LOGOUT_USER})
}
const fetchUserAction = () => async (dispatch, getState) => {
    try {
        dispatch({type: FETCH_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        await axios.post(process.env.REACT_APP_API_URL + '/users/fetch', null, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: FETCH_USER_SUCCESS})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: FETCH_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: FETCH_USER_FAIL, payload: error.response.data.message})
    }
}
const listUserMessageErrorReset = () => (dispatch) => {
    dispatch({type: LIST_USER_MESSAGE_ERROR_RESET})
}

const confirmUserAction = (userData) => async (dispatch) => {
    try {
        if(userData.token!=='null') {
            dispatch({type: CONFIRM_USER_REQUEST})
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/confirm', userData)
            dispatch({type: CONFIRM_USER_SUCCESS, payload: data})
        }
        else dispatch({type: CONFIRM_USER_FAIL, payload: 'Błąd linku weryfikacyjnego'})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: CONFIRM_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: CONFIRM_USER_FAIL, payload: error.response.data.message})
    }
}

const listUserProfileAction = (userId) => async (dispatch) => {
    try {
        dispatch({type: LIST_USER_PROFILE_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/users/' + userId)
        dispatch({type: LIST_USER_PROFILE_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_USER_PROFILE_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_USER_PROFILE_FAIL, payload: error.response.data.message})
    }
}

export {registerUserAction, loginUserAction, updateUserAction, updateUserReset, logoutUserAction, fetchUserAction, listUserMessageErrorReset, confirmUserAction, listUserProfileAction}
