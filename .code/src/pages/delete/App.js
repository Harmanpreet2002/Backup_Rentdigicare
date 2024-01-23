import React from 'react';
import './App.css';
import { Link } from "react-router-dom";
import axios from "../api/axios";
function App() {
  const deleteFiles = async () => {
    try {
      const res = await axios.get("/operation");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="App">
      <div className='conatiner'>
        <div>
          <p className='text'>Are you sure you want to delete files?</p>
        </div>
        <div className='btnConatiner'>
          <div className='cancelBtn'> <Link to={"/Login"}>Cancel</Link></div>
          <div className='okBtn' onClick={deleteFiles}>Ok</div>
        </div>
      </div>
    </div>
  );
}

export default App;
