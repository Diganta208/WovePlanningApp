import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory,useHistory, IndexRoute } from 'react-router';
import {useState, useEffect} from 'react'



export const Dashboard = () => {

    let [user, setUser]= useState(parseInt(sessionStorage.getItem('empId')))
    let history=new useHistory()
    const redirectToWoven=()=>{
        history.push('/wovenplaningdashboard')
    }

    useEffect(()=>{
        if(!user)  history.push('/userlogin')
    })

    return(
         <>
          
          <div >
	            <div className="row">
		            <div className="col-sm">
                    
                        <div className="card" >
                            {/* <img src="https://picsum.photos/201/300" class="card-img-top" alt="..." height="150px"/> */}
                        <div className="card-body">
                            <h3 className="card-title">PFL  Planning</h3>
                            {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                            <a href="#" class="btn btn-primary">Details</a>
                        </div>
                    </div>

		        </div>



		            <div className="col-sm">
                        <div className="card" >
                            {/* <img src="https://picsum.photos/200/301" class="card-img-top" alt="..." height="150px"/> */}
                            <div className="card-body">
                                <h3 className="card-title">Woven Planning</h3>
                                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                <button onClick={redirectToWoven} type="button" className="btn btn-info">Details</button>
                            </div>
                        </div>
		            </div>



		            <div className="col-sm">
                        <div className="card" >
                            {/* <img src="https://picsum.photos/200/302" class="card-img-top" alt="..." height="150px"/> */}
                            <div className="card-body">
                                <h3 className="card-title">Offset Planning</h3>
                                {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                <a href="#" className="btn btn-primary">Details</a>
                            </div>
                        </div>
		            </div>


	            </div>
            </div>


         </>

   
    )

}

export default Dashboard;