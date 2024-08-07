import './account.css';
import {React, useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function Account (){
  
  //gets the token from session storage when the page is loaded
  const token = sessionStorage.getItem("token");

  //creates useState hooks for all fields in the table, as well as the password value which is recieved from the backend
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [student, setStudent] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const [invalidEmail, setInvalidEmail] = useState('black');
  const [invalidStudent, setInvalidStudent] = useState('black');
  const [invalidClass, setInvalidClass] = useState('black');


  const [resettingPassword, setResettingPassword] = useState(false);

  //this navigate function is required to send the user to the login page if the token is invalid
  const navigate = useNavigate();


  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const[oldPasswordColour, setOldPasswordColour] = useState('black');
  const[newPasswordColour, setNewPasswordColour] = useState('black');
  const[confirmPasswordColour, setConfirmPasswordColour] = useState('black');


  //this reacts to all instances where an update is made to the page
  useEffect(() => {
    const handleLoad = () => {
      //ensures that request can only be made if the user is authenticated
      if (token) {
        axios.get('https://grade-predictor-4a15a7937c4a.herokuapp.com/getAccountInformation',{
          'method':'get',
          headers : {
          'Content-Type':'application/json',
          //provides the authentication required for the request and indicates which user is creating the request through the token
          Authorization : "Bearer " + sessionStorage.getItem("token")
        }})
          //using the data returned from this request, the variables used for each input element are set to the values returned
          .then((response) => {
            console.log(response.data);
            setEmail(response.data.email);
            setPassword(response.data.password);
            setClassNumber(response.data.classNumber);
            setStudent(response.data.student);
            console.log(email)
            
            //for the password, rather than using the actual password, a new message containing *s for the length of the password is created
            var tempText = ''
            for (let i = 0; i < response.data.password.length; i++) {
              tempText += '*'
            };
            setPasswordMessage(tempText)
          })
          .catch(function(error) {
            if (error.response.status===401) {
              navigate("/login");
              window.location.reload();
            }
          })
    }}
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  function updateData(event) {
    //ensures that page doesn't reload before request is complete
    event.preventDefault();
    console.log(email, student, String(classNumber));
    console.log(invalidStudent === "black")
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);

    //only makes request when all data is valid
    if (invalidEmail === "black" && invalidStudent === "black" && invalidClass === "black") {
      return axios.post(
        'https://grade-predictor-4a15a7937c4a.herokuapp.com/updateAccountInformation',
        {
          //returns the email, student, and class number entered (or kept the same)
          username: email,
          student: student,
          classNumber: String(classNumber)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }
        //if the function returned false then alert this issue
      ).then((response) => {
        if (!response.data) {
          alert("Invalid login");
        }
      }).catch(function(error) {
        //if the user isnt authenticated then send them to the login page
        if (error.response.status === 401) {
          navigate("/login");
          window.location.reload();
        }
      })

    } else {
      alert("Data given is not valid")
    }
    
  }

  function checkLength(event){
    if(event.target.value.length === 7) {
      event.stopPropagation();
      event.preventDefault();
      event.target.value = event.target.value.substring(0,5)
    }
    return true;
  }

  function resetPassword(event){
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);
    if (confirmPasswordColour === 'black' && newPasswordColour ==='black' && oldPasswordColour === 'black') {
      return axios.post(
        'https://grade-predictor-4a15a7937c4a.herokuapp.com/resetPassword',
        {
          newPassword: newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }
      );
    } else {
      alert("Data entered is not valid")
    }
    
  }

  function showPasswordReset () {
    setResettingPassword(true)
  }

  const usernameChange = (event) => { //called when a change is made to the email field on the form
    setEmail(event.target.value);
    let tempVal = event.target.value
    if (!(email.includes("@")) || tempVal[tempVal.length-1] === ('@') || !tempVal.includes(".") || tempVal[tempVal.length-1] === ('.') || tempVal.includes(",") || tempVal.includes('"') || tempVal.includes("'") ) {
      setInvalidEmail("red") //if the email is invalid, display an error message to the user before the submit the form
    } else {
      setInvalidEmail("black") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  const studentChange = (event) => { //called when a change is made to the password field on the form
    setStudent(event.target.value);
    if (event.target.value === 'base') {
      setInvalidStudent('red')
    }
    else {
      setInvalidStudent('black')
    }
  };

  const classNumberChange = (event) => { //called when a change is made to the password field on the form
    setClassNumber(event.target.value);
    if (event.target.value.length < 6){ //if the password is invalid, display an error message to the user before the submit the form
      setInvalidClass("red")
    } else {
      setInvalidClass("black") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  const oldPasswordChange = (event) => { //called when a change is made to the old password field on the form
    setOldPassword(event.target.value);
    let tempVal = event.target.value
    //ensures that value entered is valid
    if (tempVal.length < 8 || !(/\d/.test(tempVal)) || tempVal.includes(",") || tempVal.toUpperCase() === tempVal || password.toLowerCase() === tempVal || tempVal.includes('"') || tempVal.includes("'") ){
      //changes colour of text to indicate that data is invalid
      setOldPasswordColour('red')
    } else {
      //changes colour of text to indicate that data is valid
      setOldPasswordColour('black')
    }
  };


  const newPasswordChange = (event) => { //called when a change is made to the new password field on the form
    setNewPassword(event.target.value);
    let tempVal = event.target.value
    if (tempVal.length < 8 || !(/\d/.test(tempVal)) || tempVal.includes(",") || tempVal.toUpperCase() === tempVal || password.toLowerCase() === tempVal || tempVal.includes('"') || tempVal.includes("'") || (tempVal !== confirmPassword && confirmPassword.length > 0)){
      //changes colour of text to indicate that data is invalid
      setNewPasswordColour('red')
    } else {
      //changes colour of text to indicate that data is valid
      setNewPasswordColour('black')
    }
  };

  const confirmPasswordChange = (event) => { //called when a change is made to the password confirmation field on the form
    setConfirmPassword(event.target.value);
    let tempVal = event.target.value
    if (tempVal.length < 8 || !(/\d/.test(tempVal)) || tempVal.includes(",") || tempVal.toUpperCase() === tempVal || password.toLowerCase() === tempVal || tempVal.includes('"') || tempVal.includes("'") || tempVal !== newPassword){
      //changes colour of text to indicate that data is invalid
      setConfirmPasswordColour('red')
    } else {
      //changes colour of text to indicate that data is valid
      setConfirmPasswordColour('black')
    }
  };
  




  return (
    <div className="Account">
      {!token || token === "" || token === undefined ? ( //this checks that the token was blank (users is not logged in)
        <div className = "mainbody" >
          You must first login before accessing your account
        </div>

      ) : (

      <div className = "mainbody" >
        <h1> Welcome to the account page </h1>

        <div className='tableBox' >
        <div className = "tableRow">
          <div className='tableItem' style={{color: invalidEmail}}> Email </div>
          <div className='tableItem'> <input type="text" defaultValue={email} onChange={usernameChange}/> </div>
        </div>
        
        <div className = "tableRow">
          <div className='tableItem'> Password </div>
          <div className='tableItem'> {passwordMessage} </div>
        </div>

        <div className = "tableRow">
          <div className='tableItem' style={{color: invalidStudent}}> Student/Teacher </div>
          <div className='tableItem' > <select name="studentSelect" value={student} onChange={studentChange}>
                <option value="base"> Select Student or Teacher </option>
                <option value="student"> Student </option>
                <option value="teacher"> Teacher </option>
              </select> </div>
        </div>

        <div className = "tableRow">
          <div className='tableItem' style={{color: invalidClass}}> Class </div>
          <div className='tableItem'> <input type="number" defaultValue={classNumber} classname="textinput" onChange={classNumberChange}/> </div>
        </div>

        <div className = "tableRow">
          <div className='tableItem'> <input type="button" value="Update Data" onMouseDown={updateData} onKeyDown={checkLength}/> </div>
          <div className='tableItem'> <input type="button" value="Reset Password" onMouseDown={showPasswordReset}/> </div>
        </div>

        </div>

        {resettingPassword ? (
          <div className='tableBox' >
          <div className = "tableRow">
          <div> Reset your password below </div>

        </div>
        <div className = "tableRow">
          <div className='tableItem' style={{color: oldPasswordColour}}> Previous Password </div>
          <div className='tableItem'> <input type="password" defaultValue={oldPassword} onChange={oldPasswordChange}/> </div>
        </div>
        
        <div className = "tableRow">
          <div className='tableItem' style={{color: newPasswordColour}}> New Password </div>
          <div className='tableItem'> <input type="password" defaultValue={newPassword} onChange={newPasswordChange}/> </div>
        </div>

        <div className = "tableRow">
          <div className='tableItem' style={{color: confirmPasswordColour}}> Reenter new password </div>
          <div className='tableItem'> <input type="password" defaultValue={confirmPassword} onChange={confirmPasswordChange}/> </div>
        </div>

        <div className='tableItem'> <input type="button" value="Confirm Reset" onMouseDown={resetPassword}/> </div>

        </div>
            ) : (
            <div />
            )}

      </div>      
      )    
    }
    </div>
  );
}
