import logo from './logo.svg';
import React,{useState, useEffect } from 'react';
import './App.css';
import UserLogin from "./component/UserLogin";
import Dashboard from "./component/Dashboard";
import WovenPlaningDashboard from "./component/WovenPlaningDashboard";
import {render} from 'react-dom'
import { BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './component/Home'

import { useHistory } from 'react-router';



function App() { 


  return (
  <div >
    <div> 
    </div>
    <Router>
    <Switch>
      <Route path='/dashboard'>
        <Dashboard/>
         </Route>
    </Switch>
    <Switch>
      <Route path='/userlogin'>
        <UserLogin/>
         </Route>
    </Switch>
    <Switch>
      <Route path='/wovenplaningdashboard'>
        <WovenPlaningDashboard/>
         </Route>
    </Switch>
    </Router>
    
    
  </div>
    

  );
}

export default App;
