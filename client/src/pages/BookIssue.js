import React, { useState,useEffect } from 'react'
import Header from '../components/Header'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CustomAlert from '../components/CustomAlert';

const BookIssue = () => {
  const [currentBooks,setCurrentBooks]=useState([]);
  const [currentMembers,setCurrentMembers]=useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [rentPerDay,setRentPerDay]=useState('');
  const [issueDate, setIssueDate] = useState(null);
  const [showAlert,setShowAlert]=useState(false);
  const [alertMessage,setAlertMessage]=useState("");
  const [loading,setLoading]=useState(false);

  const displayAlert=(message)=>{
    setAlertMessage(message);
    setShowAlert(true);
  }


  const getAvailableBooks=()=>{
    fetch(process.env.REACT_APP_api_url+'/getAvailableBooks',{
      method:'GET'
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log('current book data -',data);
      setCurrentBooks(data);
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

  const handleSubmitPress=()=>{
    if(selectedMember==''){
      displayAlert("Please select a member");
      return;
    }
    if(selectedBook==''){
      displayAlert("Please select a book");
      return;
    }
    const regex=/^[0-9]+$/ ;
    if(!regex.test(rentPerDay)){
      displayAlert("Please enter a valid number for rent");
      return;
    }
    
    //const formattedDate = issueDate.toISOString().split('T')[0];
    let formattedDate = issueDate.toLocaleDateString('en-CA');
    let sendData={
      selectedMember,
      selectedBook,
      rentPerDay,
      issueDate:formattedDate
    }
    setLoading(true);
    fetch(process.env.REACT_APP_api_url+'/bookIssue',{
      method:'POST',
      body:JSON.stringify(sendData)
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log('bookIssue data -',data);
      getAvailableBooks();
      setLoading(false);
      displayAlert("The book has been issued successfully!");
    })
    .catch(err=>{
      console.log("Error - ",err);
      setLoading(false);
    })
  }

  useEffect(()=>{
    getAvailableBooks();
    getCurrentMembers();
  },[])

  return (
  <>
    <Header/>
    <div style={{width:'95%',maxWidth:1000,display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'aliceblue',padding:'15px 0px',justifySelf:'center',marginTop:20}}>
      <div style={{}}>
        <div style={{textAlign:'center',fontSize:22,color:'darkblue',marginBottom:15,textDecoration:'underline'}}>Issue a Book</div>
        
        <div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <label>Select Member:</label>
            <select onChange={(e) => setSelectedMember(e.target.value)} value={selectedMember} style={{width:250, padding:'5px 5px',marginTop:3}}>
              <option value="">--Choose a member--</option>
              {currentMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',marginTop:10}}>
            <label>Available Books:</label>
            <select onChange={(e) => setSelectedBook(e.target.value)} value={selectedBook} style={{width:250, padding:'5px 5px',marginTop:3}}>
              <option value="">--Choose a book--</option>
              {currentBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          <div style={{marginTop:10}}>
            <div>Issue Date</div>
            <DatePicker
              selected={issueDate}
              onChange={(date) => setIssueDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className='date-picker'
              maxDate={new Date()}
            />
          </div>
          <div style={{marginTop:10}}>
            <div>Enter Rent (per day)</div>
            <input type="number" value={rentPerDay} onChange={(e)=>{setRentPerDay(e.target.value)}} style={{width:70,padding:'5px 5px',marginTop:3,fontSize:15}} />
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{backgroundColor:'green',color:'white',padding:'5px 18px',borderRadius:5,marginTop:18,cursor:'pointer'}} onClick={handleSubmitPress}>Submit</div>
          </div>
        </div>

      </div>
    </div>
    {showAlert && (
      <CustomAlert message={alertMessage} setShowAlert={setShowAlert} />
    )}
    {loading && (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )}
  </>
  )
}

export default BookIssue