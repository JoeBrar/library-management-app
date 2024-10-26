import React, {useState,useEffect} from 'react'
import Header from '../components/Header'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaRegEdit } from "react-icons/fa";

const BookReturn = () => {
  const [returnableBooks,setReturnableBooks]=useState([]);
	const [currentMembers,setCurrentMembers]=useState([]);
  const [selectedMember, setSelectedMember] = useState("");
	const [selectedBookInfo,setSelectedBookInfo]=useState(null);
	const [returnDate,setReturnDate]=useState(null);
	const [paymentDetailsPopup,setPaymentDetailsPopup]=useState(false);
	const [daysOfRent,setDaysOfRent]=useState(null);
	const [validReturn,setValidReturn]=useState(false);
	const [paymentAmount,setPaymentAmount]=useState('');
	const [amountSaved,setAmountSaved]=useState(false);
	const [debtWarning,setDebtWarning]=useState(false);

	const getReturnableBooks=(id)=>{
		let sendDate={
			memberId:id
		}
    fetch(process.env.REACT_APP_api_url+'/getReturnableBooks',{
      method:'POST',
			body:JSON.stringify(sendDate)
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      console.log('getReturnableBooks data -',data);
      setReturnableBooks(data);
    })
    .catch(err=>{
      console.log("Error - ",err);
    })
  }
  
  const getCurrentMembers=()=>{
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
      console.log('current members data -',data);
      setCurrentMembers(data);
    })
    .catch(err=>{
      console.log("Error - ",err);
    })
  }

	const handleProceedPress=()=>{
		if(!selectedMember){
      alert("Please select a member");
      return;
    }
    if(!selectedBookInfo){
      alert("Please select a book");
      return;
    }
		if(!returnDate){
			alert("Please select a return date");
			return;
		}
		let formattedReturnDate = returnDate.toLocaleDateString('en-CA');
		const returnDateObj = new Date(formattedReturnDate);
		const issueDateObj = new Date(selectedBookInfo['issue_date']);
		// Calculate the time difference in milliseconds
		const timeDifference = returnDateObj - issueDateObj;
		// Convert milliseconds to days
		const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
		console.log("dayDifference - ",dayDifference); 
		if(dayDifference<0){
			alert("Return date cannot be earlier than issue date");
			return;
		}
		setDaysOfRent(dayDifference);
		setPaymentDetailsPopup(true);

		console.log("all ok");
	}

	const memberSelectHandle=(e)=>{
		console.log(e.target.value);
		setSelectedMember(e.target.value);
		setSelectedBookInfo(null);
		setReturnDate('');
		if(e.target.value){
			getReturnableBooks(e.target.value);
		}else{
			setReturnableBooks([]);
		}
	}

	const bookSelectHandle=(e)=>{
		let txnId=e.target.value
		if(!txnId){
			setSelectedBookInfo(null);
		}
		for(let i=0;i<returnableBooks.length;i++){
			console.log(returnableBooks[i].id);
			if(returnableBooks[i].id && returnableBooks[i].id==txnId){
				setSelectedBookInfo(returnableBooks[i]);
				break;
			}
		}
	}

	const paymentSaveHandle=()=>{
		const regex=/^[0-9]+$/ ;
		if(!regex.test(paymentAmount)){
			alert("Enter a valid amount")
			return;
		}
		let previousDebt=parseInt(selectedBookInfo['debt']);
		let totalDebt = parseInt(selectedBookInfo['rent_per_day'])*parseInt(daysOfRent) + previousDebt;
		let paymentAmountInt=parseInt(paymentAmount);
		if(totalDebt-paymentAmountInt < 0){
			alert(`Payment cannot be greater than your total debt value of ${totalDebt}`);
			return;
		}
		else if(totalDebt-paymentAmount<=500){
			setValidReturn(true);
		}
		else if(totalDebt-paymentAmount>500){
			setValidReturn(false);
			setDebtWarning(true)
		}
		setAmountSaved(true);
	}

	const paymentEditHandle=()=>{
		setAmountSaved(false);
		setValidReturn(false);
		setDebtWarning(false);
	}

	const paymentAmountInput=(e)=>{
		const regex=/^[0-9]*$/ ;
		if(regex.test(e.target.value)){
			setPaymentAmount(e.target.value);
		}
	}

	useEffect(()=>{
		getCurrentMembers();
	},[])

	return (
	<>
		<Header/>
    <div style={{width:'95%',maxWidth:1000,display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'aliceblue',padding:'15px 0px',justifySelf:'center',marginTop:20}}>
      <div style={{}}>
        <div style={{textAlign:'center',fontSize:22,color:'darkblue',marginBottom:15,textDecoration:'underline'}}>Return a Book</div>
        
        <div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <label>Select Member:</label>
            <select onChange={memberSelectHandle} value={selectedMember} style={{width:250, padding:'5px 5px',marginTop:3}}>
              <option value="">--Choose a member--</option>
              {currentMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',marginTop:10}}>
            <label>Select book for return:</label>
            <select onChange={bookSelectHandle} value={selectedBookInfo?.id || ""} style={{width:250, padding:'5px 5px',marginTop:3}}>
              <option value="">--Choose a book--</option>
              {returnableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
						{selectedBookInfo && (
							<div>
								<div style={{color:'#555',fontSize:13,marginTop:2,marginBottom:2}}>
									Issue date : {selectedBookInfo['issue_date']}
								</div>
								<div style={{color:'#555',fontSize:13}}>
									Rent per day : {selectedBookInfo['rent_per_day']}
								</div>
							</div>
						)}
          </div>
          <div style={{marginTop:10}}>
            <div>Return Date</div>
            <DatePicker
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className='date-picker'
              maxDate={new Date()}
            />
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{backgroundColor:'green',color:'white',padding:'5px 18px',borderRadius:5,marginTop:18}} onClick={handleProceedPress}>Proceed</div>
          </div>
        </div>

      </div>
    </div>

		{paymentDetailsPopup && (
			<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0, 0, 0, 0.286)',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{setPaymentDetailsPopup(false)}}>
				<div style={{backgroundColor:'white',padding:20,borderRadius:7}} onClick={(e)=>{e.stopPropagation()}}>
					<div style={{fontSize:19,color:'darkblue',marginBottom:5,textAlign:'center',backgroundColor:'#1E874F',color:'white',padding:'5px 0px',marginBottom:10}}>
						Payment Details
					</div>
					<div style={{fontSize:15}}>
						<div style={{display:'flex',justifyContent:'space-between'}}>
							<div>Book Rent <span style={{fontSize:15}}>(per day)</span></div>
							<div>{selectedBookInfo['rent_per_day']}</div>
						</div>
						<div style={{display:'flex',justifyContent:'space-between'}}>
							<div>Number of Days</div>
							<div>{daysOfRent}</div>
						</div>
						<div style={{display:'flex',justifyContent:'space-between'}}>
							<div>Total Rent</div>
							<div>{parseInt(selectedBookInfo['rent_per_day']) * parseInt(daysOfRent)}</div>
						</div>
						<div style={{border:'0px solid #555',borderTopWidth:1,height:1,width:'80%',justifySelf:'center',marginTop:8,marginBottom:7}}></div>
						<div style={{display:'flex',justifyContent:'space-between'}}>
							<div style={{marginRight:100}}>Previous Outstanding Debt</div>
							<div>{selectedBookInfo['debt']}</div>
						</div>
						<div style={{display:'flex',justifyContent:'space-between',marginTop:4,}}>
							<div>
								<div>Total Debt</div>
								<div style={{fontSize:12}}>(rent + previous debt)</div>
							</div>
							<div>{ parseInt(selectedBookInfo['rent_per_day'])*parseInt(daysOfRent) + selectedBookInfo['debt'] }</div>
						</div>
						<div style={{border:'0px solid #555',borderTopWidth:1,height:1,width:'80%',justifySelf:'center',marginTop:8,marginBottom:7}}></div>
						<div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:15}}>
							<div>Amount paid by the member during return</div>
							<div style={{display:'flex',alignItems:'center',marginTop:5}}>
								<input 
									type="number" 
									disabled={amountSaved?true:false}
									value={paymentAmount} 
									onChange={paymentAmountInput} 
									placeholder='Enter amount' 
									style={{padding:'3px 5px',width:120,fontSize:15}}
								/>
								{!amountSaved && 
									<div style={{backgroundColor:'darkgreen',color:'white',padding:'4px 8px',cursor:'pointer'}} onClick={paymentSaveHandle}>Save</div>
								}
								{amountSaved && 
									<div style={{backgroundColor:'white',color:'black',padding:'0px 5px',cursor:'pointer',fontSize:18}} onClick={paymentEditHandle}><FaRegEdit /></div>
								}
							</div>
						</div>
						
						{amountSaved && (
							<div style={{backgroundColor:'#C2E0D5',padding:'5px 5px',borderRadius:7,marginTop:10}}>
								<div style={{display:'flex',justifyContent:'space-between',marginTop:4,}}>
									<div>New Outstanding Debt</div>
									<div>{ parseInt(selectedBookInfo['rent_per_day'])*parseInt(daysOfRent) + selectedBookInfo['debt'] - paymentAmount}</div>
								</div>
							</div>
						)}
						{debtWarning && (
							<>
								<div style={{color:'red',textAlign:'center',justifySelf:'center',marginTop:10,fontSize:14}}>Outstanding debt must be less than 500</div>
								<div style={{color:'red',textAlign:'center',justifySelf:'center',fontSize:14}}>Please increase the amount</div>
							</>
						)}
						
					</div>
					
					<div style={{display:'flex',justifyContent:'center'}}>
						<div onClick={()=>{;}} style={{marginTop:14,background:(amountSaved && validReturn)?'darkblue':'#A3A3A3',color:'white',padding:'7px 16px',borderRadius:5,cursor:(amountSaved && validReturn)?'pointer':'default'}}>
							Confirm
						</div>
					</div>
				</div>
			</div>
		)}
	</>
  )
}

export default BookReturn