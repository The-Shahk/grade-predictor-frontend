import './login.css';
import {useState, React} from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";



export default function Login() {
  const [loginSuccess, setLoginSuccess] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidPassword, setInvalidPassword] = useState('');
  const navigate = useNavigate();



  const usernameChange = (event) => { //called when a change is made to the email field on the form
    setEmail(event.target.value);
    if (!(email.includes("@")) || email[email.length-1] === ('@') || !email.includes(".") || email[email.length-1] === ('.') || email.includes(",") || email.includes('"') || email.includes("'") ) {
      setInvalidEmail("Email not Valid") //if the email is invalid, display an error message to the user before the submit the form
    } else {
      setInvalidEmail("") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  const passwordChange = (event) => { //called when a change is made to the password field on the form
    setPassword(event.target.value);
    if (password.length < 8 || !(/\d/.test(password)) || password.includes(",") || password.toUpperCase() === password || password.toLowerCase() === password || password.includes('"') || password.includes("'") ){ //if the password is invalid, display an error message to the user before the submit the form
      setInvalidPassword("Password not valid")
    } else {
      setInvalidPassword("") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  function handleSubmit(event)  { 
    event.preventDefault()
    setEmail(email)
    return axios.post(`https://grade-predictor-4a15a7937c4a.herokuapp.com/login`,{
            'method':'post',
             headers : {
            'Content-Type':'application/json',
      },
            username: email,
            password: password}
      ).then(response => {
         setLoginSuccess(response.data)
         if (response.data === "" || response.data === undefined || !response.data){//if the token was blank, the user information was not valid and this is returned
          alert('Email or password is incorrect')
         } else {
          setInvalidEmail('successful login')
          sessionStorage.setItem("token", response.data)
          navigate("/");
          window.location.reload();
         }
      })
  }


  function submitted (event) { //called when submit button is pressed
    event.preventDefault()
    let invalid = ''
    if (!(email.includes("@")) || email[email.length-1] === ('@') || !email.includes(".") || email.includes(",") || email.includes('"') || email.includes("'") || email[email.length-1] === ('.')) {
      invalid += "Email"
      //if the email doens't contain an '@' or a '.' and neither of these are the final character, appends to the error message to be displayed
      setInvalidEmail("Email not Valid")
    } else {
      setInvalidEmail("")
    }
    
    if (password.length < 8 || password.includes(",") || password.toUpperCase() === password || password.toLowerCase() === password || password.includes('"') || password.includes("'") ){
      if (invalid.length > 0) {
        invalid += " and "
      }
      invalid += "Password"
      //adds to the above error message that password is not valid when it doens't contain a digit, doesn't have a capital letter and is not at least 8 characters long
      setInvalidPassword("Password not valid")
    } else {
      setInvalidPassword("")
    }

    if (invalid.length > 0) {
      //when an issue is found, the issue(s) are alerted to the user for amendment
      alert(invalid + ' not valid')
    } else {
      //otherwise the inputs are prepared to be posted to the backend
      handleSubmit(event)
    }

  };

  function forgotPassword() {
    if (window.confirm("Do you want to reset your password")) {
      window.alert("Email Sent")
    } else {
      window.alert("Email not sent")
    }
    
  };

  return (
    <div className="Login">
      <form name="loginform" className="mainbody" onSubmit={submitted}> {/*when the form is submited, check if the entered data is valid*/}
        <div className="loginbox" >
          
          <h3> Welcome to the login page </h3>
          <div className = "section" >
            <div className= 'text' >
              Your email
            </div>
            
            <div className = "inputbox" >
              <img src="images/avatar.png" className = "images" styles = "transparent" alt="imgs" />
              <input class="inputs" onChange={usernameChange} name="email" placeholder="hello@example.com"/> {/*allows user to enter email, and whenever this is changed, updates the email variable*/}
            </div>

            <div style={{fontSize: 15, color: "red"}}>
            {invalidEmail} {/*if the email is incorrect, an appropriate error message is displayed in red*/}
            </div>
          </div>

          <div className = "section" >

            <div className= 'text' >
              Your password
            </div>

            <div className = "inputbox" >
              <img src="images/padlock.png" className = "images" styles="transparent" alt="imgs" />
              <input className="inputs" onChange={passwordChange} name = "password" type="password" placeholder="Password with minimum length 8"/> {/*allows user to enter password, and whenever this is changed, updates the email variable*/}
            </div>

            <div style={{fontSize: 15, color: "red"}}>
            {invalidPassword} {/*if the pasword is incorrect, an appropriate error message is displayed*/}
            </div>

          </div>

          <div className="horizontal">
          <div className="makepointer" onClick={forgotPassword}>
            Forgot your password?
          </div>
          <button type='submit' className='submit'>
          </button>          
          <a className='makepointer' href="/register">
            Don't have an account? {/*link to the registration page if user doesn't have an account*/}
          </a>

          </div>
        </div>
        </form>
      </div>
  );
}
