import React, { useState,useRef, useEffect, useLayoutEffect } from 'react'
import Header from '../components/Header'
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../components/CustomAlert';

const ManageBooks = () => {
  const [numBooksInput,setNumBooksInput]=useState('');
  const [titleInput,setTitleInput]=useState('');
  const [curTitleInput,setCurTitleInput]=useState('');
  const [authorInput,setAuthorInput]=useState('');
  const [curAuthorInput,setCurAuthorInput]=useState('');
  const [fetchedBooks,setFetchedBooks]=useState([]);
  const [allBooksBackup,setAllBooksBackup]=useState([]);
  const [currentBooks,setCurrentBooks]=useState([]);
  const [stage,setStage]=useState('currentBooks');
  const [advancedSearch,setAdvancedSearch]=useState(false);
  const [searchBy,setSearchBy]=useState('title');
  const [curSearchBy,setCurSearchBy]=useState('all');
  const tableEndRef = useRef(null);
  const [availBooksWarn,setAvailBooksWarn]=useState(false);
  const [editStockInputs,setEditStockInputs]=useState({});
  const [showAlert,setShowAlert]=useState(false);
  const [alertMessage,setAlertMessage]=useState("");
  const [loading,setLoading]=useState(false);

  const displayAlert=(message)=>{
    setAlertMessage(message);
    setShowAlert(true);
  }

  const curSearchHandle=()=>{
    if(curSearchBy=='title'){
      if(!curTitleInput){
        displayAlert("Please enter a value");
        return;
      }
      let filteredBooks=[...allBooksBackup];
      filteredBooks=filteredBooks.filter(book=>book.title.toLowerCase().includes(curTitleInput.toLowerCase()));
      setCurrentBooks(filteredBooks);
    }
    else if(curSearchBy=='author'){
      if(!curAuthorInput){
        displayAlert("Please enter a value");
        return;
      }
      let filteredBooks=[...allBooksBackup];
      filteredBooks=filteredBooks.filter(book=>book.authors.toLowerCase().includes(curAuthorInput.toLowerCase()));
      setCurrentBooks(filteredBooks);
    }
  }

  const newSearchHandle=()=>{
    const regex = /^\d+$/;
    if(!regex.test(numBooksInput)){
      displayAlert("Enter a valid number");
      return;
    }
    if(numBooksInput<=0){
      displayAlert("Enter a number greater than 0");
      return;
    }
    setAvailBooksWarn(false);
    let sendData={
      numBooks:numBooksInput,
      title:titleInput,
      author:authorInput
    }
    fetch(process.env.REACT_APP_api_url+'/fetchNewBooks',{
      method:'POST',
      body:JSON.stringify(sendData)
    })
    .then((response)=>{
      if(!response.ok){
        throw new Error('Server response was not ok')
      }
      return response.json();
    })
    .then((data)=>{
      data=data.map(bookItem=>({...bookItem,available_stock:1}))
      //console.log('data - ',data);
      setFetchedBooks(data);
      if(data.length==0){
        displayAlert("No books are avaialbe for given parameters")
      }
      else if(data.length<numBooksInput){
        setAvailBooksWarn(true);
      }
      tableEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    })
    .catch((err)=>{
      console.error("Error - ",err);
    })
  }

  const addConfirmPressed=()=>{
    let sendData=fetchedBooks
    fetch(process.env.REACT_APP_api_url+'/addBooks',{
      method:'POST',
      body:JSON.stringify(sendData)
    })
    .then((response)=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then((data)=>{
      //console.log('data - ',data);
      displayAlert("Books added successfully!");
      getCurrentBooks();
      setStage("currentBooks");
    })
    .catch((err)=>{
      console.error(err);
      displayAlert("Error - ",err) ;
    })
  }

  const getCurrentBooks=()=>{
    setLoading(true);
    fetch(process.env.REACT_APP_api_url+'/getCurrentBooks',{
      method:'GET'
    })
    .then(response=>{
      if(!response.ok){
        throw new Error("Server response was not ok");
      }
      return response.json();
    })
    .then(data=>{
      //console.log("getCurrentBooks - ",data);
      let editStockValues={};
      data=data.map(book=>{
        editStockValues[book.id]=book.available_stock;
        return {...book,editStock:false}
      })
      setEditStockInputs(editStockValues);
      setCurrentBooks(data);
      setAllBooksBackup(data);
      setLoading(false);
    })
    .catch(err=>{
      console.log("Error - ",err);
      setLoading(false);
    })
  }

  const toggleStockEdit=(index)=>{
    const currentBooksCopy=[...currentBooks];
    currentBooksCopy[index].editStock=!currentBooksCopy[index].editStock;
    setCurrentBooks(currentBooksCopy);
  }

  const stockEditConfirm=(bookId,index)=>{
    if(editStockInputs[bookId]==''){
      displayAlert("Enter a valid number");
      return;
    }
    let regex=/^[0-9]*$/ ;
    if(!regex.test(editStockInputs[bookId])){
      displayAlert("Enter a valid number");
      return;
    }
    let sendData={
      bookId:bookId,
      newStock:editStockInputs[bookId]
    }
    fetch(process.env.REACT_APP_api_url+'/stockEdit',{
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
      //console.log("stock edit data -",data);
      displayAlert("Stock updated successfully!");
      let updatedBooks=[...currentBooks];
      updatedBooks.forEach(book=>{
        if(book.id==bookId){
          book.available_stock=parseInt(editStockInputs[bookId]);
        }
      })
      setCurrentBooks(updatedBooks);
      toggleStockEdit(index);
    })
    .catch(err=>{
      console.log("Error - ",err);
    })
  }

  useEffect(()=>{
    tableEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[fetchedBooks])

  useEffect(()=>{
    if(curSearchBy=='all'){
      setCurrentBooks(allBooksBackup);
    }
  },[curSearchBy])

  useEffect(()=>{
    getCurrentBooks();
  },[])

  return (
    <div>
      <Header/>
      <div style={{display:'flex',justifyContent:'center',marginTop:40}}>
        <div style={{cursor:'pointer',padding:'10px 20px',borderTopLeftRadius:5,borderBottomLeftRadius:5,border:'1px solid darkblue',color:'darkblue', ...(stage=='currentBooks'?{backgroundColor:'darkblue',color:'white'}:{}) }} onClick={()=>{setStage('currentBooks')}}>
          Current Books
        </div>
        <div style={{cursor:'pointer',padding:'10px 20px',borderTopRightRadius:5,borderBottomRightRadius:5,border:'1px solid darkblue',color:'darkblue', ...(stage=='addNewBooks'?{backgroundColor:'darkblue',color:'white'}:{}) }} onClick={()=>{setStage('addNewBooks')}}>
          Add New Books
        </div>
      </div>
      {stage=="addNewBooks" && (
      <>
        <div style={{display:'flex',justifyContent:'center',marginTop:30}}>
          <div style={{width:'95%',maxWidth:1000,display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'aliceblue',padding:'15px 0px'}}>
            <div style={{}}>
              <div style={{textAlign:'center',fontSize:22,color:'darkblue',marginBottom:15,textDecoration:'underline'}}>Add New Books</div>
              <div style={{marginBottom:10,display:'flex',gap:20,alignItems:'center'}}>
                <div>Number of books</div>
                <input className='add-book-input' type="number" value={numBooksInput} onChange={(e)=>{setNumBooksInput(e.target.value)}} style={{width:60,fontSize:17}} />
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>
                  <p>Advanced Search</p>
                  <p style={{fontSize:13}}>(Optional)</p>
                </div>
                <div style={{display:'flex',alignItems:'center'}}>
                  <div>
                    <label className="switch">
                      <input type="checkbox" checked={advancedSearch} onChange={(e)=>{setAdvancedSearch(e.target.checked)}} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              {advancedSearch && (
                <>
                <div style={{display:'flex',flexDirection:'column',marginTop:15,marginBottom:15,fontSize:15,gap:3,justifyContent:'center'}}>
                  <label>
                    <input
                      type="radio"
                      value="title"
                      checked={searchBy === 'title'}
                      onChange={(e)=>{setSearchBy(e.target.value);setAuthorInput('');}}
                    />
                    <span style={{marginLeft:4}}>
                      Search by Title
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="author"
                      checked={searchBy === 'author'}
                      onChange={(e)=>{setSearchBy(e.target.value);setTitleInput('');}}
                    />
                    <span style={{marginLeft:4}}>
                      Search by Author
                    </span>
                  </label>
                </div>
                {searchBy=='title' && (
                  <input className="adv-search-input" type="text" value={titleInput} onChange={(e)=>{setTitleInput(e.target.value)}} placeholder='Enter title'/>
                )}
                {searchBy=='author' && (
                  <input className='adv-search-input' type="text" value={authorInput} onChange={(e)=>{setAuthorInput(e.target.value)}} placeholder='Enter author'/>
                )}
                </>
              )}
   
              <div style={{backgroundColor:'green',color:'white',padding:'4px 10px',borderRadius:4,textAlign:'center',marginTop:15,cursor:'pointer'}} onClick={newSearchHandle}>Search</div>
            </div>
          </div>
        </div>
        {fetchedBooks.length>0 && (
        <>
          <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:'95%',width:1000}}>
              <div style={{marginTop:30}}>
                <h3 style={{color:'darkblue'}}>Results ({fetchedBooks.length})</h3>
                {availBooksWarn && (
                  <div style={{fontSize:12}}>Only {fetchedBooks.length} books were available for the given parameters</div>
                )}
                <div style={{marginTop:13}}>
                  {fetchedBooks.map((book,index)=>(
                    <div style={{backgroundColor:'#CAFFD0',borderRadius:7,marginBottom:7,padding:'5px 7px'}}>
                      <div style={{fontWeight:'bold'}}>{book.title}</div>
                      <div>by {book.authors}</div>
                      <div style={{marginTop:10}}>
                        <div className='book-info-tag'>Language : {book.language_code}</div>
                        <div className='book-info-tag'>Pages : {book["num_pages"]}</div>
                        <div className='book-info-tag'>Rating : {book.average_rating}</div>
                        <div className='book-info-tag'>ISBN : {book.isbn}</div>
                        <div className='book-info-tag'>Publisher : {book.publisher}</div>
                      </div>
                      <div style={{clear:'both'}}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
        )}

        {fetchedBooks.length>0 && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:20}}>
            <div style={{fontSize:20}}>
              Are you sure you want to add the above books?
            </div>
            <div style={{fontSize:12,color:'red',marginTop:3}}>Books that are already present will be ignored</div>
            <div style={{marginTop:20,background:'green',color:'white',padding:'10px 20px',fontSize:18,borderRadius:6,cursor:'pointer'}} onClick={addConfirmPressed}>
              Confirm
            </div>
          </div>
        )}
        <div style={{marginTop:50}} ref={tableEndRef}></div>
      </>
      )}
      
      {stage=="currentBooks" && (
      <>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'#D7E5F5',width:400,justifySelf:'center',marginTop:10,borderRadius:8}}>
          <div style={{display:'flex',flexDirection:'column',margin:'5px 0px',fontSize:15,gap:3,justifyContent:'center'}}>
            <label>
              <input
                type="radio"
                value="all"
                checked={curSearchBy === 'all'}
                onChange={(e)=>{setCurSearchBy(e.target.value)}}
              />
              <span style={{marginLeft:4}}>
                All books
              </span>
            </label>
            <label>
              <input
                type="radio"
                value="title"
                checked={curSearchBy === 'title'}
                onChange={(e)=>{setCurSearchBy(e.target.value)}}
              />
              <span style={{marginLeft:4}}>
                Search by Title
              </span>
            </label>

            <label>
              <input
                type="radio"
                value="author"
                checked={curSearchBy === 'author'}
                onChange={(e)=>{setCurSearchBy(e.target.value)}}
              />
              <span style={{marginLeft:4}}>
                Search by Author
              </span>
            </label>
          </div>
          {curSearchBy=='title' && (
            <>
              <input className='book-search-input' type="text" value={curTitleInput} onChange={(e)=>{setCurTitleInput(e.target.value)}} placeholder='Enter title'/>
              <div style={{backgroundColor:'green',color:'white',padding:'5px 10px',borderRadius:5,marginTop:8,fontSize:15,marginBottom:5,cursor:'pointer'}} onClick={curSearchHandle}>Search</div>
            </>
          )}
          {curSearchBy=='author' && (
            <>
              <input className='book-search-input' type="text" value={curAuthorInput} onChange={(e)=>{setCurAuthorInput(e.target.value)}} placeholder='Enter author'/>
              <div style={{backgroundColor:'green',color:'white',padding:'5px 10px',borderRadius:5,marginTop:8,fontSize:15,marginBottom:5,cursor:'pointer'}} onClick={curSearchHandle}>Search</div>
            </>
          )}
        </div>
        <div style={{width:1000,maxWidth:'95%',justifySelf:'center',marginTop:25,marginBottom:30}}>
          {currentBooks.map((book,index)=>(
            <div style={{backgroundColor:'#CAFFD0',borderRadius:7,marginBottom:7,padding:'5px 7px'}} key={index}>
              <div style={{fontWeight:'bold'}}>{book.title}</div>
              <div>by {book.authors}</div>
              <div style={{marginTop:10}}>
                <div className='book-info-tag'>Language : {book.language_code}</div>
                <div className='book-info-tag'>Pages : {book["num_pages"]}</div>
                <div className='book-info-tag'>Rating : {book.average_rating}</div>
                <div className='book-info-tag'>ISBN : {book.isbn}</div>
                <div className='book-info-tag'>Publisher : {book.publisher}</div>
              </div>
              <div style={{clear:'both'}}></div>
              {!book.editStock &&
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div>Available Stock : {book.available_stock}</div>
                  <div style={{cursor:'pointer',display:'flex'}} onClick={()=>{toggleStockEdit(index)}}>
                    <FaRegEdit />
                  </div>
                </div>
              }
              {book.editStock && (
                // <StockEdit bookId={book.id} currentStock={book.available_stock} />
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <div>Available Stock : </div>
                      <input 
                        type="number" 
                        value={editStockInputs[book.id]} 
                        onChange={(e)=>{setEditStockInputs(prev=>({...prev, [book.id]:e.target.value}))}}
                        style={{width:60,padding:'3px 6px',fontSize:17}}
                      />
                    </div>
                    <div style={{display:'flex',justifyContent:'center',gap:10,marginLeft:10}}>
                      <div style={{backgroundColor:'darkblue',border:'1px solid darkblue',color:'white',padding:'2px 15px',borderRadius:5,cursor:'pointer'}} onClick={()=>{stockEditConfirm(book.id,index)}}>Save</div>
                      <div style={{backgroundColor:'white',border:'1px solid darkblue',color:'darkblue',padding:'2px 8px',borderRadius:5,cursor:'pointer'}} onClick={()=>{toggleStockEdit(index)}}>Cancel</div>
                    </div>
                  </div>
                </div>
              )} 
            </div>
          ))}
        </div>
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

export default ManageBooks