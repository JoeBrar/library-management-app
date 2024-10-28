import React, { useState, useEffect } from 'react'
import Header from '../components/Header'

const Transactions = () => {
  const [allTransactions,setAllTransactions]=useState([]);
  const [loading,setLoading]=useState(false);

  const getAllTransactions=()=>{
    setLoading(true);
    fetch(process.env.REACT_APP_api_url+'/getAllTransactions',{
      method:'GET'
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log('getAllTransactions data -',data);
      setAllTransactions(data);
      setLoading(false)
    })
    .catch(err=>{
      console.log("Error - ",err);
      setLoading(false);
    })
  }

  useEffect(()=>{
    getAllTransactions();
  },[])


  return (
	<>
    <Header/>
    <div style={{width:800, maxWidth:'95%',justifySelf:'center',marginTop:40}}>
      <div style={{textAlign:'center',fontSize:24,fontWeight:'bold',color:'darkblue',marginBottom:20}}>
        Transactions
      </div>
      {allTransactions.map((txn,index)=>(
        <div style={{backgroundColor:'#CAFFD0',borderRadius:7,marginBottom:7,padding:'5px 7px'}}>
          <div style={{backgroundColor:''}}>
            <div style={{fontWeight:'bold'}}>{txn.title}</div>
            <div style={{fontSize:13,marginBottom:5}}>by {txn.authors}</div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{marginRight:70}}>Book ID</div>
              <div>{txn.book_id}</div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{marginRight:70}}>Rented by</div>
              <div>{txn.name}</div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{marginRight:70}}>Member email</div>
              <div>{txn.email}</div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{marginRight:70}}>Issue Date</div>
              <div>{txn.issue_date}</div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{marginRight:70}}>Rent per day</div>
              <div>{txn.rent_per_day}</div>
            </div>
            {txn.is_returned=="yes"?(
              <>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{marginRight:70}}>Return date</div>
                  <div>{txn.return_date}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{marginRight:70}}>Total book rent</div>
                  <div>{txn.total_rent}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{marginRight:70}}>Amount paid by member during return</div>
                  <div>{txn.amount_paid}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{marginRight:70}}>Outstanding debt of member after return</div>
                  <div>{txn.amount_paid}</div>
                </div>
              </>
            ):
              <div style={{color:'red',textAlign:'center',marginTop:8}}>This book has not been returned</div>
            }
          </div>
        </div>
      ))}
    </div>
    <div style={{marginTop:50}}></div>
    {loading && (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )}
	</>
  )
}

export default Transactions

