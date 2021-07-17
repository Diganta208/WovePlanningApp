import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Router,  Link, browserHistory,useHistory, IndexRoute } from 'react-router';
import {Route,Redirect} from 'react-router-dom';
import MediaQuery from 'react-responsive';





export const UserLogIn = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let history=useHistory()
    let [user, setUser]= useState(parseInt(localStorage.getItem('empId')))
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
               
                localStorage.setItem('userId',res.data[0].UserID);
                localStorage.setItem('userName',res.data[0].UserName);
                localStorage.setItem('empId',res.data[0].Emp_ID);
                localStorage.setItem('roleId',res.data[0].RoleID);
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
                <h3 align="center" className="headerColor">User Log In</h3>
                <tr>
                    <td><label className="lebel" htmlFor="email">Id</label></td>
                    <td className="space"></td>
                    <td><input className="input" type="text" name="email" id="email"
                     value={email}
                    onChange={(e) => setEmail(e.target.value) }
                    /> </td>
                </tr>
                <tr>
                 <td> <label className="lebel" htmlFor="password">Password</label></td>
                 <td  className="space"></td>
                    <td><input className="input" type="password" name="password" id="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value) }
                         /> </td>
                </tr>
                <tr><td><button className="button btn btn-outline-success" type="submit" onClick={getdata}>Login</button></td></tr>
            </div>
    

    </div>


)
}


export default UserLogIn;
