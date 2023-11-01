import React, { useState } from "react";
import { LogOut } from "react-feather";
import "../App.css";
import { useNavigate, Link, Outlet } from "react-router-dom";
import Transition from '../transition/Transition';

interface AuthSigninProps {}

function AuthSignin(props: AuthSigninProps) {
  const navigate = useNavigate();
  const [Type, setType] = useState("password");
  const [pass,setPass] = useState("");
  const [email, setemail] = useState("");
  const signIn = async(event:any)=>{
    event.preventDefault();
    const UserData = {username:email,password:pass};
    const res = await fetch("https://test-back-jeji.onrender.com/signin",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(UserData)
    });
    
    if(res.status===201){
      const data = await res.json();
      
      localStorage.setItem("userid",data.userid._id);
      navigate("/home");
      
    }else{
      alert("Try again please");
    }
  }
  const navigateHandler = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="app_nav">
        <h1 onClick={() => navigateHandler('/home')}>KANBAN</h1>
        <button className="SignButton" onClick={() => navigateHandler('/signup')} style={{cursor: "pointer" }}>Sign-Up</button>
      </div>
      <Transition>  {/*Transition for Fade in effect on page change */}
        <div className='Sign'>
          <form>
            <fieldset>
              <legend>Sign-In</legend>
              <div className="Form-container">
                <label htmlFor="inputEmail" className="labelEmail">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                    className="Form-input"
                  />
                </label>
                <label htmlFor="inputPassword" className="labelPassword">
                  <input
                    type={Type}
                    placeholder="Password"
                    className="Form-input"
                    value={pass}
                    onChange={(e)=>setPass(e.target.value)}
                  /> <br />
                  <div className="Show-Password">
                    <input
                      type="checkbox"
                      id="checkbox"
                      onClick={() => {
                        if (Type === "password") setType("text");
                        else setType("password");
                      }}
                    /> <span style={{ color: "white" }}>Show Password</span>
                  </div>
                </label>
                <label htmlFor="Button-section" className="ButtonSection">
                  <button className="Sign-button" style={{cursor: "pointer" }} onClick={(event)=>signIn(event)}>Sign-in</button>
                  <div className="Change">New User?
                    <span className="Signuplink" style={{ color: "greenyellow", cursor: "pointer" }} onClick={() => navigateHandler('/signup')}>
                      <i>Sign-up</i>
                    </span>
                  </div>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
      </Transition>
      <div className="footer">Crafted By Sanyam Sharma for Kraftbase's Assignment</div>
    </>
  );
}

export default AuthSignin;
