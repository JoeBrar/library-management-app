import React, {useState} from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../components/CustomAlert';

const Home = () => {
  const navigate=useNavigate();
  const [showAlert,setShowAlert]=useState(false);
  const [alertMessage,setAlertMessage]=useState("");

  const displayAlert=(message)=>{
    setAlertMessage(message);
    setShowAlert(true);
  }

  return (
    <div>
      <Header/>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center', marginTop:40}}>
        <div className='nav-item' onClick={()=>{navigate('/manageBooks')}}>Manage Books</div>
        <div className='nav-item' onClick={()=>{navigate('/manageMembers')}}>Manage Members</div>
        <div className='nav-item' onClick={()=>{navigate('/bookIssue')}}>Book Issue</div>
        <div className='nav-item' onClick={()=>{navigate('/bookReturn')}}>Book Return</div>
        <div className='nav-item' onClick={()=>{navigate('/transactions')}}>See Transactions</div>
      </div>
      {showAlert && (
        <CustomAlert message={alertMessage} setShowAlert={setShowAlert} />
      )}
      
    </div>
  )
}

export default Home