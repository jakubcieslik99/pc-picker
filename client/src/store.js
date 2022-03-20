import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import Cookie from 'js-cookie'
import {
    listUserReducer,
    confirmUserReducer,
    listUserProfileReducer
} from './reducers/userReducers'
import {
    listComponentsReducer,
    detailsComponentReducer,
    saveManagedComponentReducer,
    deleteManagedComponentReducer
} from './reducers/componentReducers'
import {
    listConfigsReducer,
    detailsConfigReducer,
    saveManagedConfigReducer,
    deleteManagedConfigReducer
} from './reducers/configReducers'

const userInfo = Cookie.get('userInfo') || null

const initialState = {
    listUser: {
        userInfo: userInfo!==null ? JSON.parse(userInfo) : userInfo
    }
}

const reducer = combineReducers({
    //user state
    listUser: listUserReducer, //state defined
    confirmUser: confirmUserReducer,
    listUserProfile: listUserProfileReducer,
    //component state
    listComponents: listComponentsReducer,
    detailsComponent: detailsComponentReducer,
    saveManagedComponent: saveManagedComponentReducer,
    deleteManagedComponent: deleteManagedComponentReducer,
    //config state
    listConfigs: listConfigsReducer,
    detailsConfig: detailsConfigReducer,
    saveManagedConfig: saveManagedConfigReducer,
    deleteManagedConfig: deleteManagedConfigReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))
//const store = createStore(reducer, initialState, compose(applyMiddleware(thunk)))

export default store
