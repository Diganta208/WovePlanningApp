import React,{useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory,useHistory, IndexRoute } from 'react-router';
import Select from 'react-select';
import axios from 'axios';
import reactDom from 'react-dom';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {format} from 'date-fns';


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
    let [userInfo, setUserInfo]=useState(sessionStorage.getItem('empId'));
    let [plans, setPlans]=useState([]);
    let history=new useHistory();
    let [selectedShed , setSelectedShed]= useState(0);
    let [selectedShift, setSelectedShift]= useState();
    let [selectedPlan, setSelectedPlan]= useState(0);
    let [selectedMachine, setSelectedMachine]= useState();
    let [selectedWorkOrder, setSelectedWorkOrder]= useState();
    let [selectedPickOpening, setSelectedPickOpening]= useState(0);
    let [selectedPickCloseing, setSelectedPickCloseing]= useState(0);
   
    let [selectedRepeat, setSelectedRepeat]= useState();
    let [selectedWarp, setSelectedWarp]= useState();
    let [selectedWeft, setSelectedWeft]= useState();
    let [selectedEficiency, setSelectedEficiency]= useState();
    let [selectedOthers, setSelectedOthers]= useState();
    let [selectedPower, setSelectedPower]= useState();
    let [selectedMeintenance, setSelectedMeintenance]= useState();
    let [selectedNoWork, setSelectedNoWork]= useState();
    let [selectedRemarks, setSelectedRemarks]= useState();
    let [startDate, setStartDate] = useState(new Date());

    // let plan
    // let Machines
    // let optionItems 
    const getPlanWiseMachine=(wpid)=>{
      console.log(wpid)
      axios.get('http://localhost:3000/api/pflplannings/getPlanWiseMachineListForWoven?shed='+wpid).then((res)=>{
         console.log(res) 
         setMachine([...res.data])

      })
      setTimeout(()=>{
        //  console.log(Machines)
         setDropdown(true)
            
      },1000)
    }


    const JobRecieve=()=>{
      let user= parseInt(sessionStorage.getItem('empId') )
      axios.post('http://localhost:3000/api/pflplannings/UpdateWovenPlannsmaster',{PlanId:plans[plans.length-1].WplanID, UserId: user} ).then((res)=>{
        setJobrecived(true)
      })
    }

  useEffect(() => {
      //  axios.get('http://localhost:3000/api/pflplannings/getMaxWovenPlan').then((res)=>{
      //    plans.push(res.data[0])
        // axios.get('http://localhost:3000/api/pflplannings/getPlanWiseStatus?PlanId='+res.data[0].WplanID).then((res1)=>{
        //   res1.data[0].StatusID==0? setJobrecived(false): setJobrecived(true)
        // })

        if(!userInfo) history.push('/userlogin')
        axios.get('http://localhost:3000/api/MAchinemasters/wovenShedList').then((res2)=>{
          shed.push(res2.data)
          })
      
          axios.get('http://localhost:3000/api/icg-shifts').then((res3)=>{
            res3.data.map((e)=>{
              if(e['SHIFT_NAME_ENG']=='C'|| e['SHIFT_NAME_ENG']=='A'||e['SHIFT_NAME_ENG']=='B')
              {
                shift.push(e)
              }
            })
          })
        
    //  })
    },[]);


    const MachineSelected=(e)=>{
      var value =Machines.filter((machine)=>{
        if(e.target.value==machine.MachineNo) return machine 
      })
      console.log(value[0].MachineID)

      axios.get('http://localhost:3000/api/pflplannings/getPlanWiseStatus?machineId='+value[0].MachineID).then((res)=>{
        console.log(plans[0].WplanID)
        data=[...res.data]
        setShowData(true)
        setDropdown(false)
      })
    }

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
        Swal.fire('Yikes!','Please select Shed', 'error')
        return
      } 
      setSelectedShed(e.target.value)

       axios.get('http://localhost:3000/api/pflplannings/getMaxWovenPlan?shedNo='+e.target.value).then((res)=>{
         setPlans([...res.data])
         setSelectedPlan(res.data[0].WplanID)
         
        axios.get('http://localhost:3000/api/pflplannings/getPlanWiseStatus?PlanId='+res.data[0].WplanID).then((res1)=>{
          res1.data[0].StatusID==0? setJobrecived(false): setJobrecived(true)
        })
          getPlanWiseMachine(e.target.value)
      
       
      })
    }

    const selectWorkorder=(e)=>{
      
     setInfo(false)
     setWorkOrder([])
     if(e.target.value=='Machine')
     {
      Swal.fire('Yikes!','Please select Machine', 'error')
        return
     }
     const mId=machine.find((m)=> e.target.value==m.MachineNo).MachineID
     setSelectedMachine(mId)
     axios.get('http://localhost:3000/api/pflplannings/LoadMachinWiseWorkOrderForWoven?MachignId='+mId+'&PlanId='+plans[0].WplanID).then((res)=>{
      
      
     setWorkOrder([...res.data])
      
     })

    }

    const getPickCutterByWorkOrder=(e)=>{
         setInfo(false)
        if(e.target.value=='Work Order') {
          Swal.fire('Yikes!','Please select Work Order', 'error')
        return
        }


        const wid=workorder.find((w)=>w.WorkOrderNo===e.target.value).WorkOrderID
        setSelectedWorkOrder(wid)
        axios.get('http://localhost:3000/api/MachineMasters/mcefficiencywovenorderlist?Search='+e.target.value).then((res)=>{
          console.log(res)
          if(res.data.length>0){
            setInfo(true)
            setPick(res.data[0].Pick)
            setCutter(res.data[0].Cutter)
            setSample(res.data[0].SampleName)
            setSampleId(res.data[0].SampleID)
            setPlans([])
          }
        })

    }


    const setShiftForWoven=(e)=>{  
      if(e.target.value=='Shift')
      {
        Swal.fire('Yikes!','Please select a Shift', 'error')
      }
      setSelectedShift(e.target.value) }

    // const setShedForWoven=(e)=>{ setSelectedShed(e.target.value)}
    // const setPlanForWoven=(e)=>{ setSelectedPlan(e.target.value)}
    // const setMachineForWoven=(e)=>{ setSelectedMachine(e.target.value)}
    // const setWorkOrderForWoven=(e)=>{ setSelectedWorkOrder(e.target.value)}
    // const setPickForWoven=(e)=>{ setSelectedPick(e.target.value)}
    // const setCutterForWoven=(e)=>{ setSelectedCutter(e.target.value)}

    const setRepeatForWoven=(e)=>{ 
      console.log(e.target.value)
      setSelectedRepeat(e.target.value)
    }
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



    const SaveButton=()=>{
     const data={
       "SHIFT_ID" : selectedShift,
       "PROD_DATE": format(startDate,'yyyy-MM-dd'),
       "MachineID": selectedMachine,
       "SHED_NAME": selectedShed,
       "OPERATOR_ID": userInfo,
       "ORDER_ID": selectedWorkOrder,
       "SAMPLE_ID": sampleId,
       "CUTTER": cutter,
       "PICK": pick,
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
     axios.post('http://localhost:3000/api/MachineMasters/wovenProductionEffiInsert',data ).then((res)=>{
      Swal.fire('Yikes!','Added Successfully', 'success')
       setInfo(false)
       setMachine([])
       setWorkOrder([])

     })


    }
    

    return (
        <>
        
       <div className="woven backgroundColour container "><h3 align="center">Woven </h3></div>
        {count==0? <div  class="d-flex justify-content-center">< button class="btn btn-outline-dark"  onClick={updateCount} >Start</button></div>: 
        <div className="app-background container">
          <div>
          <table>
            <tr>
              <td>  <select onChange={ShiftWiseMaxPlan} className="b select ">
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
          <div><DatePicker className="c" selected={startDate} onChange={(date) => setStartDate(date)} /></div> <br/>
          </div>
          {plans.length>0 ?<div><h5 className="workOrder" align="center">{plans[plans.length-1].WplanNo}</h5></div> : <label></label>}
          {jobrecived? <label></label>:<div className="wrapper "> <button className="btn btn-outline-secondary"  onClick={JobRecieve} >Recieve</button><br></br></div>}

          <div>
            {machine.length>0 && jobrecived? <div>
            
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
            {workorder.length>0? <div>
            
             <select onChange={getPickCutterByWorkOrder} className="c select">
              <option >Work Order</option>{
                workorder.map((w)=> <option>{w.WorkOrderNo}</option> )
               }</select>
               
             </div>   
          : <label></label>}
          <br></br>
          </div>
          <div>
           {info? <div>

             <table>
               <tr>
                 <td><input type="number" value={pick} className="b textBox" onChange={setPickForWoven}/></td>
                 <td className="a"></td>
                 <td><input type="number" value={cutter} className="b textBox" onChange={setCutterForWoven}/></td>
               </tr>

               <tr>
                 <td> <input type="text" value={sample} className="b textBox"/></td>
                 <td  className="a"></td>
                 <td><input type="number" placeholder="Repeat" onChange={setRepeatForWoven} className="b textBox"/></td>
               </tr>



               <tr>
                 <td><input type="number" placeholder="Warp" onChange={setWarpForWoven} className="b textBox"/></td>
                 <td className="a"></td>
                 <td><input type="number"  className="b textBox" placeholder="Weft" onChange={setWeftForWoven}/></td>
               </tr>

               <tr>
                 <td> <input type="number" placeholder="Eficiency" className="b textBox" onChange={setEficiencyForWoven}/></td>
                 <td  className="a"></td>
                 <td><input type="number" placeholder="Others" className="b textBox" onChange={setOthersForWoven}/></td>
               </tr>


               <tr>
                 <td><input type="number" placeholder="Power" className="b textBox" onChange={setPowerForWoven}/></td>
                 <td className="a"></td>
                 <td><input type="number" placeholder="meintenance" className="b textBox" onChange={setMeintenanceForWoven}/></td>
               </tr>

               <tr>
                 <td> <input type="number" placeholder="No work" className="b textBox" onChange={setNoWorkForWoven}/></td>
                 <td  className="a"></td>
                 {/* <td><input type="text" placeholder="Remarks" className="b textBox" onChange={setRemarksForWoven}/></td> */}
               </tr>
               <tr>
                 <td colSpan="3" ><textarea placeholder="Remarks" className="c" onChange={setRemarksForWoven}>Remarks</textarea></td>
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



