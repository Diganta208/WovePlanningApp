import React,{useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory,useHistory, IndexRoute, Redirect } from 'react-router';
//import Select from 'react-select';
import axios from 'axios';
import reactDom from 'react-dom';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {format} from 'date-fns';
import Select from 'react-select';
import 'semantic-ui-css/semantic.min.css';

let api='192.168.12.5:3500'
let Machines=[]
let plan=[]  
let data
  function WovenPlaningDashboard() {

    let [dropdown, setDropdown] = useState(false);
    let [reciveButton, setReciveButton]=useState(false);
    //  let [plans,setPlans]=useState(false);
    let[showData,setShowData]=useState(false);
    let[jobrecived, setJobrecived]=useState(true);
    let[count, setCount]=useState(0);
    let[shed,setShed]=useState([]);
    let[shift,setShift]=useState([]);
    let[machine,setMachine]=useState([]);
    let [workorder, setWorkOrder]=useState([]);
    let [pick, setPick]=useState(0);
    let [sample, setSample]=useState("");
    let [sampleId, setSampleId]=useState(0)
    let [cutter, setCutter]=useState("");
    let[info, setInfo]=useState(false);
    let [userInfo, setUserInfo]=useState(localStorage.getItem('empId'));
    let [plans, setPlans]=useState([]);
    let history=new useHistory();
    let [selectedShed , setSelectedShed]= useState(0);
    let [selectedShift, setSelectedShift]= useState();
    let [selectedPlan, setSelectedPlan]= useState(0);
    let [selectedMachine, setSelectedMachine]= useState();
    let [selectedWorkOrder, setSelectedWorkOrder]= useState();
    let [selectedPickOpening, setSelectedPickOpening]= useState(0);
    let [selectedPickCloseing, setSelectedPickCloseing]= useState(0);
   
    let [selectedRepeat, setSelectedRepeat]= useState(0);
    let [selectedWarp, setSelectedWarp]= useState(0);
    let [selectedWeft, setSelectedWeft]= useState(0);
    let [selectedEficiency, setSelectedEficiency]= useState(0);
    let [selectedOthers, setSelectedOthers]= useState(0);
    let [selectedPower, setSelectedPower]= useState(0);
    let [selectedMeintenance, setSelectedMeintenance]= useState(0);
    let [selectedNoWork, setSelectedNoWork]= useState(0);
    let [selectedRemarks, setSelectedRemarks]= useState("");
    let [startDate, setStartDate] = useState(new Date());
    let [operators, setOperators]=useState([])
    let [OperatorId, setOperatorId]=useState()


    const style = <link rel='stylesheet' href ='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

 
    // let plan
    // let Machines
    // let optionItems 
    const getPlanWiseMachine=(wpid)=>{
      console.log(wpid)
      axios.get('http://'+api+'/api/pflplannings/getPlanWiseMachineListForWoven?shed='+wpid).then((res)=>{
         console.log(res) 
         setMachine([...res.data])

      })
      setTimeout(()=>{
        //  console.log(Machines)
         setDropdown(true)
            
      },1000)
    }


    const JobRecieve=()=>{
      let user= parseInt(localStorage.getItem('empId') )
      axios.post('http://'+api+'/api/pflplannings/UpdateWovenPlannsmaster',{PlanId:plans[plans.length-1].WplanID, UserId: user} ).then((res)=>{
        setJobrecived(true)
      })
    }

  useEffect(() => {


        if(!userInfo) history.push('/login')
        axios.get('http://'+api+'/api/MAchinemasters/wovenShedList').then((res2)=>{
          shed.push(res2.data)
          })

          axios.get('http://'+api+'/api/pflplannings/GetAllOperatorForWoven').then((res4)=>{
           setOperators([...res4.data])
            console.log(res4.data)
          })
          
      
          axios.get('http://'+api+'/api/icg-shifts').then((res3)=>{
            res3.data.map((e)=>{
              if(e['SHIFT_NAME_ENG']=='C'|| e['SHIFT_NAME_ENG']=='A'||e['SHIFT_NAME_ENG']=='B')
              {
                shift.push(e)
              }
            })
          })
        
    //  })
    },[]);


    const updateCount=()=>{
      console.log(count)
         setCount(count+1)
    }

    const ShiftWiseMaxPlan=(e)=>{
     
      console.log(e.target.value)
     setMachine([])
      setInfo(false)
      setWorkOrder([])

      if(e.target.value=='Select')
      {
        setSelectedShed()
        setSelectedMachine()
        Swal.fire('Hey!','Please select Shed', 'error')
        return
      } 
      setSelectedShed(e.target.value)

       axios.get('http://'+api+'/api/pflplannings/getMaxWovenPlan?shedNo='+e.target.value).then((res)=>{
         setPlans([...res.data])
         setSelectedPlan(res.data[0].WplanID)
         
        axios.get('http://'+api+'/api/pflplannings/getPlanWiseStatus?PlanId='+res.data[0].WplanID).then((res1)=>{
          res1.data[0].StatusID==0? setJobrecived(false): setJobrecived(true)
        })
          getPlanWiseMachine(e.target.value)
      
       
      })
    }

    const getWorkOrder=(st)=>{

       console.log(st.target.value)
       axios.get('http://'+api+'/api/VWorkOrderMasters?filter[limit]=10&filter[order]=WorkOrderID desc&filter[where][WorkOrderNo][like]=%'+st.target.value+'%').then((res4)=>{
          console.log(res4)
         // setWorkOrder([...res4.data])
         let orders =res4.data.map((wo)=>{
           return{ label : wo.WorkOrderNo, value: wo.WorkOrderID}
         })

         setWorkOrder([...orders])
        })
             
    }

    const selectWorkorder=(e)=>{
      
     setInfo(false)
     setWorkOrder([])
     if(e.target.value=='Machine')
     {
       setSelectedMachine()
      Swal.fire('Hey!','Please select Machine', 'error')
        return
     }
     const mId=machine.find((m)=> e.target.value==m.MachineNo).MachineID
     setSelectedMachine(mId)
     axios.get('http://'+api+'/api/pflplannings/LoadMachinWiseWorkOrderForWoven?MachignId='+mId+'&PlanId='+plans[0].WplanID).then((res)=>{
      
      
     setWorkOrder([...res.data])
      
     })

    }

    const getPickCutterByWorkOrder=(e)=>{
         setInfo(false)
     
        setSelectedWorkOrder(e.value)
        axios.get('http://'+api+'/api/MachineMasters/mcefficiencywovenorderlist?Search='+e.label).then((res)=>{
          console.log(res)
          if(res.data.length>0){
            setInfo(true)
            setPick(res.data[0].Pick)
            setCutter(res.data[0].Cutter)
            setSample(res.data[0].SampleName)
            setSampleId(res.data[0].SampleID)
            
          }
        })

    }


    const setShiftForWoven=(e)=>{  
      if(e.target.value=='Shift')
      {
        Swal.fire('Hey!','Please select a Shift', 'error')
        setSelectedShift()
        return
      }
      setSelectedShift(e.target.value) }

    const setRepeatForWoven=(e)=>{ 
      console.log(e.target.value)
      setSelectedRepeat(e.target.value)
    }
    const setOperatorIdForOven=(e)=>{ setOperatorId(e.EMP_ID) }
    const setWarpForWoven=(e)=>{ setSelectedWarp(e.target.value)} 
    const setWeftForWoven=(e)=>{ setSelectedWeft(e.target.value)} 
    const setEficiencyForWoven=(e)=>{ setSelectedEficiency(e.target.value)} 
    const setOthersForWoven=(e)=>{ setSelectedOthers(e.target.value)} 
    const setPowerForWoven=(e)=>{ setSelectedPower(e.target.value)}
    const setMeintenanceForWoven=(e)=>{ setSelectedMeintenance(e.target.value)}
    const setNoWorkForWoven=(e)=>{ setSelectedNoWork(e.target.value)}
    const setRemarksForWoven=(e)=>{ setSelectedRemarks(e.target.value)}
    const setPickForWoven=(e)=>{setPick(e.target.value)}
    const setCutterForWoven=(e)=>{ setCutter(e.target.value)}

    const getselectedDate=(e)=>{ setStartDate(e) }


    const ReSet=()=>{
      setInfo(false)
       setMachine([])
       setWorkOrder([])
       setOperatorId()
       setSelectedShed(0)
       setSelectedMachine(null)
    }


    const SaveButton=()=>{

      console.log(selectedShift)
      if(!selectedShift){
        Swal.fire('Hey!','Please Select Shift', 'error')
        return
      }

      if(!OperatorId){
        Swal.fire('fire!','Please Select Operator', 'error')
        return
      }

      if(!selectedMachine)
      {
        Swal.fire('fire!','Please Select a Machine', 'error')
        return
      }
      if(!selectedWorkOrder)
      {
        Swal.fire('fire!','Please Select a WorkOrder', 'error')
        return
      }


      if(!selectedRemarks) selectedRemarks=""

     const data={
       "SHIFT_ID" : selectedShift,
       "PROD_DATE": format(startDate,'yyyy-MM-dd'),
       "MachineID": selectedMachine,
       "SHED_NAME": selectedShed,
       "OPERATOR_ID": OperatorId,
       "ORDER_ID": selectedWorkOrder,
       "SAMPLE_ID": sampleId,
       "CUTTER": parseInt(cutter),
       "PICK": parseInt(pick),
       "REPEAT": parseInt(selectedRepeat),
       "PICK_OPENING": selectedPickOpening,
       "PICK_CLOSING": selectedPickCloseing,
       "EFFICENCY": parseInt(selectedEficiency),
       "STOP_WRAP": parseInt(selectedWarp),
       "STOP_WEFT": parseInt(selectedWeft),
       "STOP_OTHERS": parseInt(selectedOthers),
       "REMARKS": selectedRemarks,
       "CREATED_BY": userInfo,
       "CommandID": 1,
       "POWER": parseInt(selectedPower),
       "MAINTANANCE": parseInt(selectedMeintenance),
       "NOWORK": parseInt(selectedNoWork),
     }
      console.log(data)
     axios.post('http://'+api+'/api/MachineMasters/wovenProductionEffiInsert',data ).then((res)=>{
      Swal.fire('hey!','Added Successfully', 'success')
       
        ReSet()
     })


    }
    

    return (
        <>
        
       <div className="woven backgroundColour container "><h3 align="center">Woven Daily Entry</h3></div>
        {count==0? <div  class="d-flex justify-content-center">< button class="btn btn-outline-dark"  onClick={updateCount} >Start</button></div>: 
        <div className="app-background container">
         
          <div>
          <table>
            <tr>
              <td>  <select onChange={ShiftWiseMaxPlan}  className="b select ">
                     <option>Select</option>{
                       shed[0].map((s)=> <option>{s.ShedName}</option> )
                      }</select></td>
              <td className="a"></td>
              <td> <select onChange={setShiftForWoven} className="b select">
              <option>Shift</option>{
                shift.map((s)=> <option>{s.SHIFT_NAME_ENG}</option> )
                   }</select>
             </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
         
          </table>
          <br/>
          <div><DatePicker className="c" selected={startDate} onChange={getselectedDate} /></div> <br/>
          </div>
          {/* {plans.length>0 ?<div><h5 className="workOrder" align="center">{plans[plans.length-1].WplanNo}</h5></div> : <label></label>}
          {jobrecived? <label></label>:<div className="wrapper "> <button className="btn btn-outline-secondary"  onClick={JobRecieve} >Recieve</button><br></br></div>} */}
          
          <div>
            {machine.length>0 ? <div>    
             <div className="c">
                      <Select placeholder="Operator" onChange={setOperatorIdForOven} options={operators}/>
                      <br/>
             </div>
            
             <select onChange={selectWorkorder} className="c select">
              <option>Machine</option>{
                machine.map((s)=> <option>{s.MachineNo}</option> )
               }</select>
               <br></br>
               <br></br>
             </div>   
          : <label></label>}
          </div>

          <div>
            {selectedMachine? <div>

              <div className="c" onKeyUp={getWorkOrder}>
                      <Select placeholder="Work Order" onChange={getPickCutterByWorkOrder} options={workorder}/>
                      <br/>
             </div>
               
             </div>   
          : <label></label>}
          <br></br>
          </div>
          <div>
           {info? <div>

             <table>
               <tr>
                 <td className="headerColor"><b>Pick</b></td>
                 <td className="space"></td>
                 <td><input type="number" value={pick} className="b alignTextBox " onChange={setPickForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Cutter</b></td>
                 <td className="space"></td>
                 <td><input type="number" value={cutter} className="b alignTextBox" onChange={setCutterForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Sample</b></td>
                 <td className="space"></td>
                 <td><input type="text" value={sample} readOnly className="b alignTextBox"/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Repeat</b></td>
                 <td className="space"></td>
                 <td><input type="number" onChange={setRepeatForWoven} className="b alignTextBox"/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Warp</b></td>
                 <td className="space"></td>
                 <td><input type="number" onChange={setWarpForWoven} className="b alignTextBox"/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Weft</b></td>
                 <td className="space"></td>
                 <td><input type="number"  className="b alignTextBox" onChange={setWeftForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Eficiency</b></td>
                 <td className="space"></td>
                 <td><input type="number" className="b alignTextBox" onChange={setEficiencyForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Others</b></td>
                 <td className="space"></td>
                 <td><input type="number" className="b alignTextBox" onChange={setOthersForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Power</b></td>
                 <td className="space"></td>
                 <td><input type="number"className="b alignTextBox" onChange={setPowerForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Meintenance</b></td>
                 <td className="space"></td>
                 <td><input type="number" className="b alignTextBox" onChange={setMeintenanceForWoven}/></td>
               </tr>

               <tr>
                 <td className="headerColor"><b>Power</b></td>
                 <td className="space"></td>
                 <td><input type="number"className="b alignTextBox" onChange={setPowerForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>No work</b></td>
                 <td className="space"></td>
                 <td><input type="number" className="b alignTextBox" onChange={setNoWorkForWoven}/></td>
               </tr>
               <tr>
                 <td className="headerColor"><b>Remarks</b></td>
                 <td className="space"></td>
                 <td><textarea className="b alignTextBox" onChange={setRemarksForWoven}>Remarks</textarea></td>
               </tr>

               <tr>
                 <td> <button className="btn btn-outline-success" onClick={SaveButton}>Save</button></td>
               </tr>
               
             </table>

           </div>:<label></label>}
          </div>
        </div>
        
        }
        

        {/* {jobrecived?  count==0? <label></label>: 
        <div>
         <div>
           <label>Shed </label>
              <select onChange={ShiftWiseMaxPlan}>
              <option></option>{
                 shed[0].map((s)=> <option>{s.ShedName}</option> )
             }</select>
          </div>
          <div>
            <label>Shift </label>
          <select>
              <option></option>{
                shift.map((s)=> <option>{s.SHIFT_NAME_ENG}</option> )
             }</select>
          </div>
          {
            plans.length>0? <div><label>{plans[0].WplanNo}</label></div>: <label></label>
          }
        </div>      
          :<button onClick={JobRecieve}>Recive</button>} */}
      </>
    );   
  }
  
  export default WovenPlaningDashboard;



