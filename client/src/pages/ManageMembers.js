import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';

const ManageMembers = () => {
  const navigate=useNavigate();
  const [stage,setStage]=useState('currentMembers');
  const [name,setName]=useState('');
  const [age,setAge]=useState('');
  const [email,setEmail]=useState('');
  const [debt,setDebt]=useState(0);
  const [currentMembers,setCurrentMembers]=useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null); // Tracks the row being edited
  const [editData, setEditData] = useState({}); // Stores form data for the editable row
  const [showAlert,setShowAlert]=useState(false);
  const [alertMessage,setAlertMessage]=useState("");
  const [loading,setLoading]=useState(false);

  const displayAlert=(message)=>{
    setAlertMessage(message);
    setShowAlert(true);
  }

  const handleMemberSubmit=()=>{
    if(age==''){
      displayAlert("Please enter a valid age");
      return;
    }
    if(name=="" || age=="" || email==""){
      displayAlert("Please enter the member details");
      return;
    }
    const regex=/^[0-9]*$/ ;
    if(!regex.test(age)){
      displayAlert("Please enter a valid number for age");
      return;
    }
    if(!regex.test(debt)){
      displayAlert("Please enter a valid number for debt");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
      displayAlert("Please enter a valid email address");
      return;
    }

    let sendData={
      name,
      age,
      email,
      debt:debt?debt:0
    }
    fetch(process.env.REACT_APP_api_url+'/addNewMember',{
      method:'POST',
      body:JSON.stringify(sendData)
    })
    .then(response=>{
      if(!response.ok){
        if(response.status==500){
          displayAlert("This member already exists");
        }
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      displayAlert("Member added successfully!");
      getCurrentMembers();
      setStage('currentMembers');
    })
    .catch(err=>{
      console.log("Error - ",err);
    })
  }

  const getCurrentMembers=()=>{
    setLoading(true);
    fetch(process.env.REACT_APP_api_url+'/getCurrentMembers',{
      method:'GET'
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log('current members data -',data);
      setCurrentMembers(data);
      setLoading(false);
    })
    .catch(err=>{
      console.log("Error - ",err);
      setLoading(false);
    })
  }

  const handleEditClick = (user,index) => {
    setEditRowIndex(index);
    setEditData({ ...user }); // Initialize form data with the current row data
    //console.log("user data- ",user);
  };

  const handleEdits=(e)=>{
    setEditData(prev=>({...prev,[e.target.name]:e.target.value}));
  }

  const saveEditedMember=()=>{
    //code...
    if(editData['age']==''){
      displayAlert("Please enter a valid age");
      return;
    }
    if(editData['name']=="" || editData['age']=="" || editData['debt'].toString()==""){
      displayAlert("Please enter all details");
      return;
    }
    const regex=/^[0-9]*$/ ;
    if(!regex.test(editData['age'])){
      displayAlert("Please enter a valid number for age");
      return;
    }
    if(!regex.test(editData['debt'])){
      displayAlert("Please enter a valid number for debt");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(editData['email'])){
      displayAlert("Please enter a valid email address");
      return;
    }

    fetch(process.env.REACT_APP_api_url+'/editMember',{
      method:'POST',
      body:JSON.stringify(editData)
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log('edit member data -',data);
      getCurrentMembers();
      displayAlert("Member has been updated");
    })
    .catch(err=>{
      console.log("Error - ",err);
      displayAlert(`Error - ${err}`);
    })

    setEditRowIndex(null);
    setEditData({});
  }


  useEffect(()=>{
    getCurrentMembers();
  },[])

  return (
    <div>
      <Header/>
      <div style={{display:'flex',justifyContent:'center',marginTop:40}}>
        <div style={{cursor:'pointer',padding:'10px 20px',borderTopLeftRadius:5,borderBottomLeftRadius:5,border:'1px solid darkblue',color:'darkblue', ...(stage=='currentMembers'?{backgroundColor:'darkblue',color:'white'}:{}) }} onClick={()=>{setStage('currentMembers')}}>
          Current Members
        </div>
        <div style={{cursor:'pointer',padding:'10px 20px',borderTopRightRadius:5,borderBottomRightRadius:5,border:'1px solid darkblue',color:'darkblue', ...(stage=='addNewMember'?{backgroundColor:'darkblue',color:'white'}:{}) }} onClick={()=>{setStage('addNewMember')}}>
          Add New Member
        </div>
      </div>
      {stage=="addNewMember" && (
      <>
        <div style={{width:1000,maxWidth:'95%',justifySelf:'center',marginTop:30,display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'aliceblue',padding:'15px 0px'}}>
          <div style={{textAlign:'center',fontSize:22,color:'darkblue',marginBottom:15,textDecoration:'underline'}}>Add New Member</div>
          <div style={{width:245}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div>Name</div>
              <input className="member-input-field" type="text" value={name} onChange={(e)=>{setName(e.target.value)}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div>Age</div>
              <input className="member-input-field" type="number" value={age} onChange={(e)=>{setAge(e.target.value)}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div>Email</div>
              <input className="member-input-field" type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div>Debt</div>
              <input className="member-input-field" disabled={true} type="number" value={debt} onChange={(e)=>{setDebt(e.target.value)}} />
            </div>
          </div>
          <div style={{backgroundColor:'green',color:'white',padding:'5px 25px',borderRadius:5,marginTop:13,cursor:'pointer'}} onClick={handleMemberSubmit}>Submit</div>
        </div>
      </>
      )}
      {stage=='currentMembers' && (
      <>
        <div style={{display:'flex',justifySelf:'center',marginTop:25}}>
          <table className='member-table' style={{borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th>S.no.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Debt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((user,index) => {
                return (
                  <>
                    {editRowIndex==index ? (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleEdits}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="age"
                            value={editData.age}
                            onChange={handleEdits}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="email"
                            value={editData.email}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="debt"
                            value={editData.debt}
                            onChange={handleEdits}
                          />
                        </td>
                        <td>
                          <div onClick={()=>{saveEditedMember()}} style={{backgroundColor:'darkblue',color:'white',padding:'3px 10px',borderRadius:8,cursor:'pointer',fontSize:14}}>Save</div>
                        </td>
                      </tr>
                    ):(
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.age}</td>
                        <td>{user.email}</td>
                        <td>{user.debt}</td>
                        <td>
                          <div onClick={()=>{handleEditClick(user,index)}} style={{backgroundColor:'brown',color:'white',padding:'3px 10px',borderRadius:8,cursor:'pointer',fontSize:14}}>Edit</div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:40}}></div>
      </>
      )}
      {showAlert && (
        <CustomAlert message={alertMessage} setShowAlert={setShowAlert} />
      )}
      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}

export default ManageMembers