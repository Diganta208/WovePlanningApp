import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Router, Route, Link, browserHistory,useHistory, IndexRoute } from 'react-router';
import {Redirect} from 'react-dom';
import MediaQuery from 'react-responsive';





export const UserLogIn = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let history=useHistory()
    let [user, setUser]= useState(parseInt(sessionStorage.getItem('empId')))
   // const [newEntry, setNewEntry] = useState([]);

    // const LogStyle ={
        
    //     backgroundColor: "purple",
    //     height: "100%",
    //     width: "100%",
    //     left: "0",
    //     top: "0",
    //     overflow: "hidden",
    //     position: "fixed",
    // }
 

  useEffect(() => {
    if(user) history.push('/dashboard') 
  })
   



    const getdata=()=>{
        //console.log("runningS")
        //console.log(email) 
        axios.get('http://192.168.13.3:8000/api/login?LoginID='+email+'&Password=' + password).then((res)=>{
           console.log(res)
            if(res.data.length>0) 
            {
               
                sessionStorage.setItem('userId',res.data[0].UserID);
                sessionStorage.setItem('userName',res.data[0].UserName);
                sessionStorage.setItem('empId',res.data[0].Emp_ID);
                sessionStorage.setItem('roleId',res.data[0].RoleID);
                console.log("working")

                history.push("/dashboard")
            //    <Redirect to="/" />

            //     <Route exact path="/">
            //     {<Redirect to="/dashboard" />}
            //   </Route>

            }
        })
        
    }

return(
    
    <div className="body" >
        
            <div className="container">
                <tr>
                    <td><label className="lebel" htmlFor="email">Email</label></td>
                    <td><input className="input" type="text" name="email" id="email"
                     value={email}
                    onChange={(e) => setEmail(e.target.value) }
                    /> </td>
                </tr>
                <tr>
                 <td> <label className="lebel" htmlFor="password">Password</label></td>
                    <td><input className="input" type="password" name="password" id="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value) }
                         /> </td>
                </tr>
                <tr><td><button className="button" type="submit" onClick={getdata}>Login</button></td></tr>
            </div>
    

    </div>


)
}


export default UserLogIn;
