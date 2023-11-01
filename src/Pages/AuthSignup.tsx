import React, { useState } from "react";
import { LogOut } from "react-feather";
import "../App.css";
import { useNavigate, Link, Outlet } from "react-router-dom";
import Transition from '../transition/Transition';

interface AuthSignupProps {}

function AuthSignup(props: AuthSignupProps) {
  const navigate = useNavigate();
  const [Type, setType] = useState("password");
  const [pass,setPass] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const signUp = async(event:any)=>{
    event.preventDefault();
    const userData = {username:name,password:pass,email:email};
    const res = await fetch("https://test-back-jeji.onrender.com/signup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(userData)
    })
    if(res.status===201){
      alert("User created successfully");
      res.json().then((data)=>{
        const uid = data.userid;
        fetch(`https://test-back-jeji.onrender.com/setImage/${uid}`,{
          method:"POST",
          body:JSON.stringify({url:"https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Blonde&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Pink&eyeType=Surprised&eyebrowType=AngryNatural&mouthType=Smile&skinColor=Light"})
        })
      })
      fetch("https://test-back-jeji.onrender.com/")
      navigate("/signin");
    }else{
      alert("Username or email already exists Try again!");
    }
  }
  const navigateHandler = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="app_nav">
        <h1 onClick={() => navigateHandler('/home')}>KANBAN</h1>
        <button className="SignButton" onClick={() => navigateHandler('/signin')} style={{cursor: "pointer" }}>Sign-In</button>
      </div>
      <Transition>  {/*Transition for Fade in effect on page change */}
        <div className='Sign'>
          <form>
            <fieldset>
              <legend>Sign-Up</legend>
              <div className="Form-container">
                <label htmlFor="inputName" className="labelName">
                  <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => { setname(e.target.value); }}
                    className="Form-input"
                  />
                </label>
                <label htmlFor="inputEmail" className="labelEmail">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setemail(e.target.value); }}
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
                  <button className="Sign-button" style={{cursor: "pointer" }} onClick={(event)=>signUp(event)}>Sign-up</button>
                  <div className="Change">Already User?
                    <span className="Signuplink" style={{ color: "greenyellow", cursor: "pointer" }} onClick={() => navigateHandler('/signin')}>
                      <i>Sign-in</i>
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

export default AuthSignup;
