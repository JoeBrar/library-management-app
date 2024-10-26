import './App.css';
import Home from './pages/Home';
import {Routes,Route} from 'react-router-dom';
import ManageBooks from './pages/ManageBooks';
import ManageMembers from './pages/ManageMembers';
import BookIssue from './pages/BookIssue';
import BookReturn from './pages/BookReturn';

function App() {
  return (
    <Routes>
      <Route index element={<Home/>} />
      <Route path='/manageBooks' element={<ManageBooks/>} />
      <Route path='/manageMembers' element={<ManageMembers/>} />
      <Route path='/bookIssue' element={<BookIssue/>} />
      <Route path='/bookReturn' element={<BookReturn/>} />
    </Routes>
  );
}

export default App;
