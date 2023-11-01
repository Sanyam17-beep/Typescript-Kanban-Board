import React, { useEffect, useState } from "react";
import { LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";
import Transition from "../transition/Transition";

import dotenv from "dotenv";




function Update() {
  const [pass,setPass] = useState("");
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState<string>(
    "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Blonde&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Pink&eyeType=Surprised&eyebrowType=AngryNatural&mouthType=Smile&skinColor=Light"
  );
  const [Type, setType] = useState<string>("password");
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");

  const navigateHandler = (path: string) => {
    navigate(path);
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    

    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.readyState === fileReader.DONE) {
          setUserImg(fileReader.result as string);
        }
      };
    }
  }

  useEffect(()=>{
    const userid = localStorage.getItem("userid");
    if(userid==null){
      navigate('/signin');
    }else{
      
    }
  },[]);

  const updateUser = async(event:any)=>{
    event.preventDefault();
    const uid = localStorage.getItem("userid");
    await fetch(`https://test-back-jeji.onrender.com/updateUser/${uid}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({username:name,email:email,password:pass})
    }).then((res)=>{
      alert("updated successfully");
      navigate('/home');
    }).catch((err)=>
      alert("Server error")
    )
  }
  return (
    <>
      <div className="app_nav">
        <h1 onClick={() => navigateHandler("/home")}>KANBAN</h1>
        <LogOut
          height={"30px"}
          width={"30px"}
          onClick={() => navigateHandler("/signin")}
        />
      </div>
      <Transition>   {/*Transition for Fade in effect on page change */}
        <div className="input-user-img">
          <label htmlFor="inputImg" className="labelImg">
            <img
              src={
                userImg
                  ? userImg
                  : "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
              }
            />
          </label>
          <input
            className="inputImg"
            id="inputImg"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="Update-Form">
          <label htmlFor="inputName" className="labelName">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
              className="Form-input"
            />
          </label>
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
              placeholder="New Password"
              value={pass}
              onChange={(e)=>setPass(e.target.value)}
              className="Form-input"
            />{" "}
            <br />
            <div className="Show-Password">
              <input
                type="checkbox"
                id="checkbox"
              
                onClick={() => {
                  if (Type === "password") setType("text");
                  else setType("password");
                }}
              />{" "}
              <span style={{ color: "white" }} >Show Password</span>
            </div>
          </label>
          <label htmlFor="Submit" className="labelSubmit">
            <input type="submit" value="Update" style={{cursor:"pointer"}} onClick={(event)=>updateUser(event)} className="Submit" />
          </label>
        </div>
      </Transition>
      <div className="footer">
        Crafted By Sanyam Sharma for Kraftbase's Assignment
      </div>
    </>
  );
}

export default Update;
