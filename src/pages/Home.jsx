import './home.css';

export default function Home() {
  const token = sessionStorage.getItem("token");
  return (
    
    
    <div className="Home">
      <div className = "mainbody" >
        {token ? (
          <div className = "loggedInText" >
            <p> You are logged in </p>
          </div>

        ) : (
        <div></div>
        )
        }
        <p> Welcome to the A Level Grade Predictor </p>
        <br></br>
        <p> Choose a page from the navigation bar above  </p>
        <br></br>
        <p> You can calculate a set of A-Level grades without having an account, but won't be able to access them in the future. </p>
        </div>

    </div>
  );
}

