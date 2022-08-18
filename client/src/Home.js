import React, { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./Editor.css";
import toast from'react-hot-toast'

export default function Home() {
  const navigate = useNavigate();
  const [fileId, setfileId] = useState("");
  const [User, setUser] = useState("");

  const JoinFile = (e) => {
    e.preventDefault();
    if(fileId=="" && User=="")
    {
      toast('Please enter your user name and file Id')
      return;
    }
    if(fileId=="")
    {
      toast('Please enter file Id or create new file')
      return;
    }
    if(User=="")
    {
      toast('Please enter your user name')
      return;
    }

    navigate(`/editor/${fileId}`, {
      state: {
        User,
      },
    });
  };

  const CreateNewFile = (e) => {
    e.preventDefault();
    const id = uuidv4();
    //console.log(id);
    setfileId(id);
  };
  useEffect(() => {
    let date = new Date();
    date.toLocaleTimeString('en-IN',{hour: '2-digit', minute: '2-digit'});
    const time=document.getElementById('time');
    time.innerText=date;
    return () => {
    }
  }, [])
  
  return (
    <div className="home">
      <nav class="tbar">
        <i class="fas fa-wifi"></i>
        <span class="time" id="time"></span>
      </nav>

      <div class="content">
        <div class="input-wrap">
          <div class="pic"></div>
          <div class="wrap">
            <h3 class="name">&lt;Dcoder/&gt;</h3>
          </div>
          <form>
          <div className="form-outline mb-3">
              <input
                type="text"
                id="password"
                placeholder="Enter Username"
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
            <div className="form-outline mb-3">
              <input
                type="text"
                id="username"
                value={fileId}
                placeholder="Enter File ID"
                onChange={(e) => setfileId(e.target.value)}
                required
              />
            </div>
            

            <div class="btn-group" role="group" aria-label="Basic example">
            <a
              class="btn btn-sm btn-light"
              href="/"
              onClick={CreateNewFile}
            >
              Create new <i class="fa-solid fa-circle-plus"></i>
            </a>
            <button
              type="submit"
              class="btn btn-dark btn-sm"
              onClick={JoinFile}
            >
              Open File <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button> 
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
