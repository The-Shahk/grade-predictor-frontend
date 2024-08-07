import './register.css';
import {useState, React} from 'react';
import axios from 'axios'

 

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [student, setStudent] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState();
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidPassword, setInvalidPassword] = useState('');


  const usernameChange = (event) => {
    setEmail(event.target.value);
    if (!(email.includes("@", 0)) || email[email.length-1] === ('@') || !email.includes(".", 0) || email[email.length-1] === ('.')) {
      setInvalidEmail("Email not Valid") //if the email is invalid, display an error message to the user before the submit the form
    } else {
      setInvalidEmail("") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
    if (password.length < 8){ //if the password is invalid, display an error message to the user before the submit the form
      setInvalidPassword("Password not valid")
    } else {
      setInvalidPassword("") //otherwise, reset the invalid message so that nothing is displayed if it is correct
    }
  };

  const studentChange = (event) => {
    setStudent(event.target.value);
  };

  function handleSubmit(event)  { 
    setEmail(email)
    return axios.post(`https://grade-predictor-4a15a7937c4a.herokuapp.com/register`,{
            'method':'post',
             headers : {
            'Content-Type':'application/json'
      },
            username: email,
            password: password,
            student: student,
          }
      ).then(response => {
        setRegistrationSuccess(response.data)
        if (!response.data){
         alert('User already exists with this username')
        } else {
          setInvalidEmail('successful registration')
         }
     })
  }

  function submitted (event) {
    event.preventDefault()
    let invalid = ''
    if (!(email.includes("@", 0)) || email[email.length-1] === ('@') || !email.includes(".", 0) || email[email.length-1] === ('.') || email.includes('"', 0) || email.includes("'", 0)) {
      invalid += "Email"
    }
    
    if (password.length < 8 || password.includes('""') || password.includes("''")){
      if (invalid.length > 0) {
        invalid += " and "
      }
      invalid += "Password"
    }

    if (student === 'base'){
      if (invalid.length > 0) {
        invalid += " and "
      }
      invalid += "Level of education"
    }

    if (invalid.length > 0) {
      alert(invalid + " not valid")
    } else {
      handleSubmit(event)
    }
  };


  return (
    <div className="Register">
      <form name="loginform" className="mainbody" onSubmit={submitted}>
        <div className="registerbox" >
          <h3> Welcome to the registration page </h3>
          <div className = "section" >
            <div className= 'text' >
              Your email
            </div>
            
            <div className = "inputbox" >
              <img src="images/avatar.png" className = "images" styles = "transparent" alt="imgs" />
              <input class="inputs" onChange={usernameChange} name="email" placeholder="hello@example.com"/>
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
              <img src="images/padlock.png" className = "images" styles = "transparent" alt="imgs" />
              <input class="inputs" onChange={passwordChange} name = "password" type="password" placeholder="Password with minimum length 8"/>
            </div>

            <div style={{fontSize: 15, color: "red"}}>
            {invalidPassword} {/*if the password is incorrect, an appropriate error message is displayed in red*/}
            </div>

          </div>

          <div className = "section dropdown" >
              <select name="student" onChange={studentChange}>
                <option value="base"> Select Student or Teacher </option>
                <option value="student"> Student </option>
                <option value="teacher"> Teacher </option>
              </select>

          </div>

          <input type='submit' className='submit' value="Submit">
          </input>

          <div className="horizontal">

          <a href="/login">
            Already have an account?
          </a>
          </div>

          <div className="horizontal">
          <input type="button" className='submit' value="Next" onClick={submitted}>
          </input>

          <input type="button" className='submit' value="Back" onClick={submitted}>
          </input>

          </div>
        </div>
        </form>
      </div>
  );
}

