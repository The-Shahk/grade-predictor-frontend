import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

function App() {
  const [getMessage, setGetMessage] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(()=>{
    axios.get('http://localhost:5000/flask/hello').then(response => {
      console.log("SUCCESS", response)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    })

  }, [])

  const usernameChange = (event) => {
    setUsername(event.target.value);

  };

  const passwordChange = (event) => {
    setPassword(event.target.value);

  };

  function handleSubmit(event)  { 
    event.preventDefault()
    setUsername(username)
    return axios.post(`http://localhost:5000/flask/hello`,{
            'method':'post',
             headers : {
            'Content-Type':'application/json'
      },
            username: username,
            password: password}
      )
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>React + Flask Tutorial</p>
        <div>{getMessage.status === 200 ? 
          <h3>{getMessage.data.message}</h3>
          :
          <h3>LOADING</h3>}</div>
          <form onSubmit={handleSubmit}
            
            method= "post">
                    <input type="text" id='startDate' onChange={usernameChange}/>
                    <br></br>
                    <input type="text" id='endDate' onChange={passwordChange}/>
                    <br></br>
                    <input type='submit' value='submit' />
          </form>
      </header>
    </div>
  );
}

export default App;