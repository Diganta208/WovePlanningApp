import React,{useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory,useHistory, IndexRoute } from 'react-router';
import Select from 'react-select';
import axios from 'axios';
import reactDom from 'react-dom';

export const Home = () => {

    let history=new useHistory()
    const redirectToWoven=()=>{
        history.push('/dashboard')
    }

 let[user, setUser]=useState(parseInt(sessionStorage.getItem('empId')))
 useEffect(()=>{
     console.log(user)
 })

return(
    <div>
        {user?  redirectToWoven() : <label>home</label>}
    </div>
)
}

export default Home;
