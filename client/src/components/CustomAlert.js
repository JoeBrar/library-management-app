import React from 'react'

const CustomAlert = ({message,setShowAlert}) => {
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0, 0, 0, 0.34)',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{setShowAlert(false)}}>
			<div style={{backgroundColor:'white',borderRadius:7}} onClick={(e)=>{e.stopPropagation()}}>
        <div style={{padding:'20px 20px',fontSize:17,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div>
          {message}
          </div>
          <div className='alert-close-btn' onClick={()=>{setShowAlert(false)}} >
            Close
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert