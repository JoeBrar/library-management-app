import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate();

  return (
    <div>
      <Header/>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center', marginTop:40}}>
        <div className='nav-item' onClick={()=>{navigate('/manageBooks')}}>Manage Books</div>
        <div className='nav-item' onClick={()=>{navigate('/manageMembers')}}>Manage Members</div>
        <div className='nav-item' onClick={()=>{navigate('/bookIssue')}}>Book Issue</div>
        <div className='nav-item'>Book Return</div>
        <div className='nav-item'>See Transactions</div>
      </div>
    </div>
  )
}

export default Home