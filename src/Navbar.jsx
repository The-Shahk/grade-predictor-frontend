import {React} from "react";
import './navbar.css';


function Navbar() {

    // gets the token value to indicate if the user is logged in
    const token = sessionStorage.getItem("token");

    // when the user logs out, the token is removed which ends the session and then the page is reloaded
    function onLogout () {
        sessionStorage.removeItem("token")
        window.location.reload();
    }

  return (
        <div className = "topbar">
            <a href="/" >
            <div className = "logo" >
            </div>
            </a>
            
            <div className = "topbarspace">
            </div>

            <a href="/calculate" className="links">
            <div className = "topbarelem1">
                <text className="linkText"> Calculate </text>
            </div>
            </a>

            <a href="/account" className="links">
            <div className = "topbarelem1">
                <text className="linkText"> Account </text>
            </div>
            </a>
            
            {/* if the user is logged in, the logout button is displayed otherwise login button is displayed */}
            {token ? (
                <button className="buttonStyling links" onMouseDown={onLogout}> Logout </button>
            ) : (

            <a href="/login" className="links">
            <div className = "topbarelem1">
                <text className="linkText"> Login </text>
            </div>
            </a>  
            
            )}

        </div>
  );
}

export default Navbar;
