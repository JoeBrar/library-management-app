import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate=useNavigate();

  return (
    <div style={{display:'flex',justifyContent:'center',fontSize:27,fontWeight:'bold',backgroundColor:'darkblue',color:'white',padding:'10px 0px'}}>
      <div onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>
        Library Manager
      </div>
    </div>
  )
}

export default Header