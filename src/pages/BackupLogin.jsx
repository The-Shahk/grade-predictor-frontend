import './login.css';
import {useState, React} from 'react';



 

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState('');
  var valid_email = "hi";


  const usernameChange = (event) => {
    setEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const submitted = (event) => {
    setValid('submitted')
    if ((email.length = 0)) {
      setValid('Email is not valid')
    }
    else {
      setValid('')
    }
    alert(valid)

  };

  return (
    <div className="Login">
    
      <div className = "mainbody" >
        <div className="loginbox" >
          Welcome to the login page
          
          <div className = "section" >

            <div className= 'text' >
              Your email
            </div>
            
            <div className = "inputbox" >
              <img src="images/avatar.png" className = "images" styles = "transparent" alt="imgs" />
              <input class="inputs" onChange={usernameChange} name="email" placeholder="hello@example.com"/>
            </div>

            <div className= 'text' >
              {valid}
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

          </div>

          <button className='submit' onClick={submitted}>
          
          </button>
        </div>
      </div>

    </div>
  );
}

export default Login;
