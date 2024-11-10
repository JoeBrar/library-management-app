import React from 'react'

const DeletePopup = ({itemName,onConfirm,onCancel}) => {
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0, 0, 0, 0.34)',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{}}>
			<div style={{backgroundColor:'white',borderRadius:7}} onClick={(e)=>{e.stopPropagation()}}>
        <div style={{padding:'13px 20px',fontSize:17,display:'flex',flexDirection:'column'}}>
          <div style={{color:'darkblue',fontWeight:'bold',fontSize:18}}>
            Delete {itemName}
          </div>
          <div style={{marginTop:15}}>
          Are you sure?
          </div>
          <div style={{color:'red',fontSize:14}}>
            Transactions related to this {itemName.toLowerCase()} will also be deleted
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:20}}>
            <div className='alert-close-btn' onClick={onConfirm}>
              Confirm
            </div>
            <div className='alert-close-btn' onClick={onCancel} >
              Close
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePopup