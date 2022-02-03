import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
//bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
//components
import Header from './components/Header'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
//user screens
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import ManageComponentScreen from './screens/ManageComponentScreen'
import ManageBuildScreen from './screens/ManageBuildScreen'
import BuildScreen from './screens/BuildScreen'

const App = () => {
  return <BrowserRouter>
    <Header/>

    <Switch className="test">
      <Route path="/" exact={true} component={HomeScreen}/>
      <Route path="/profile/:id" component={ProfileScreen}/>
      <Route path="/register" component={RegisterScreen}/>
      <Route path="/login" component={LoginScreen}/>
      <Route path="/manage-component" component={ManageComponentScreen}/>
      <Route path="/manage-build" component={ManageBuildScreen}/>
      <Route path="/build/:id" component={BuildScreen}/>

      <Route component={NotFound}/>
    </Switch>

    <Footer/>
  </BrowserRouter>
}

export default App
