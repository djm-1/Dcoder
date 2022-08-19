import { useEffect, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { io } from "socket.io-client";
import "./Editor.css";
import People from "./People";
import { useLocation, useParams,Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Editor() {
  const { fileId } = useParams();
  const location = useLocation();
  const [socket, setsocket] = useState();
  const [theme, settheme] = useState("monokai");
  const [editor, seteditor] = useState();
  const [copybtn, setcopybtn] = useState("fa-copy");
  const [code, setcode] = useState(`  #include<bits/stdc++.h>
  using namespace std;
  typedef long long int ll;
  ll mod=1000000007;
  ll inf=INT_MAX;
  
  // template created by Dcoder at ${new Date().toLocaleString("en-IN")}
  
  // write functions here
  
  
  
  
  //main driver code 
  int main()
  {
  
  }`);
  const [people, setpeople] = useState([]);

  const copylink=()=>{
    setcopybtn("fa-check");
    document.getElementById('file-link').select();
    document.execCommand('copy');
    setTimeout(() => {
      setcopybtn("fa-copy");
    }, 1000);     
  }
  const changeTheme = () => {
    const target = document.getElementById("dropdown-theme").value;
    settheme(target);

    let elems = document.getElementsByClassName("CodeMirror");
    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.add(`cm-s-${target}`);
    }
  };


  useEffect(() => {
    
      const ex=document.getElementById("editor");
    const cm = CodeMirror.fromTextArea(ex,{
      mode: "text/x-c++src",
      theme: theme,
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      value:code
    });
    
    cm.setSize("100%", "100vh");
    cm.setOption("value", code);
    seteditor(cm);  
    },[])
  

  
  useEffect(() => {
    const s = io(`/:${process.env.PORT}/`);
    setsocket(s);
    //when I join a room
    s.emit("join", {
      fileId,
      username: location.state?.User,
    });
    s.on("joined", ({ clients, username, socketId }) => {
      //console.log(clients)
      playAudio();
      toast(`${username} has joined Dcoder`);
      setpeople(clients);
    });
    s.on("disconnected", ({ socketId, username }) => {
      toast(`${username} has left Dcoder`);
      setpeople((prev) => {
        return prev.filter((client) => client.socketId !== socketId);
      });
    });
    
    return () => {
      //init();
      playAudio();
      s.disconnect();
     };
  }, []);

  const playAudio = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/dabykheek/video/upload/v1660758372/Dcoder/Ping_baht2d.mp3"
    );
    audio.play();
  };

  const upcode = () => {
    const tick = document.getElementById("upcode-done");
    const spin = document.getElementById("upcode");

    tick.style.display = "none";
    spin.style.display = "inline-block";
    setTimeout(() => {
      tick.style.display = "inline";
      spin.style.display = "none";
    }, 1500);
  };

  // when I change code on editor
  useEffect(() => {
    if (socket == null || editor == null) return;
    editor.on("change", (instance, changes) => {
      const { origin } = changes;
      if (origin !== "setValue") {
        setcode(instance.getValue());
        upcode();
        socket.emit("send-changes", instance.getValue());
      }
    });
    return () => {};
  }, [socket]);

  // when I receive changed code
  useEffect(() => {
    if (socket == null || editor == null) return;

    socket.on("receive-changes", (text) => {
      upcode();
      editor.setValue(text);
      setcode(text);
    });
    return () => {};
  }, [socket]);

  // code download button
  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "code.txt";
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    if (socket == null || editor == null) return;

    socket.once("load-file", (document) => {
      if (document !== "") {
        editor.setValue(document);
      }
    });

    socket.emit("get-file", fileId);
  }, [fileId, socket, editor]);

  useEffect(() => {
    if (socket == null || editor == null) return;
    const interval = setInterval(() => {
      socket.emit("save-file", editor.getValue());
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, editor]);


  if(!location.state)
  {
    return(
      <Navigate to="/"/>
    )
  }
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/${theme}.min.css`}
      />
      {/* header section */}
      <div
        className="px-3 pt-2"
        style={{ backgroundColor: "#EBEBE3", display: "flex" }}
      >
        <span
          className="dot px-1"
          style={{ backgroundColor: "#FF605C" }}
        ></span>
        <span
          className="dot px-1"
          style={{ backgroundColor: "#FFBD44" }}
        ></span>
        <span
          className="dot px-1"
          style={{ backgroundColor: "#00CA4E" }}
        ></span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "Comfortaa",
          }}
        >
          Dcoder [id: {fileId}]
        </span>
        <span
          style={{
            marginLeft: "auto",
            marginRight: "0px",
            marginBottom: "2px",
          }}
        >
          <span className="mx-1"> Theme:</span>
          <select
            id="dropdown-theme"
            className="browser-default custom-select"
            onChange={changeTheme}
          >
            <option value="monokai">monokai</option>
            <option value="abbott">abbott</option>
            <option value="eclipse">eclipse</option>
            <option value="material-ocean">material</option>
            <option value="dracula">dracula</option>
            <option value="neat">neat</option>
            <option value="yonce">yonce</option>
          </select>
        </span>
      </div>

      <div className="row m-0">
        {/* joined people portion */}
        <div className="col-md-2">
          <div className="my-4 text-center">
            <span
              style={{
                fontFamily: "Comfortaa",
              }}
            >
              Participants
            </span>
          </div>
          <div className="clientList">
            {people.map((single) => (
              <People key={single.socketId} username={single.username} />
            ))}
          </div>
        </div>

        {/* code portion */}
        <div className="col-md-10 px-0">
          <textarea
            id="editor"
            style={{
              fontSize: "20px",
            }}
          ></textarea>
        </div>
      </div>

      {/* footer section */}
      <div
        className="p-2"
        style={{ backgroundColor: "#EBEBE3", display: "flex" }}
      >
        <span
          style={{
            marginLeft: "0px",
            marginRight: "auto",
            paddingTop: "6px",
          }}
        >
          Code saved to server
          <span
            class="spinner-border text-primary spinner-border-sm"
            role="status"
            id="upcode"
            style={{
              display: "none",
              marginLeft: "2px",
            }}
          >
            <span class="visually-hidden">Loading...</span>
          </span>
          <span
            id="upcode-done"
            className="text-primary"
            style={{
              marginLeft: "2px",
              fontWeight: "900",
            }}
          >
            &#10003;
          </span>
        </span>
        <button
          className="btn btn-md btn-light"
          id="share-code"
          data-mdb-toggle="modal"
          data-mdb-target="#exampleModal"
          style={{
            marginLeft: "auto",
            marginRight: "5px",
          }}
        >
          <i class="fa fa-share" aria-hidden="true"></i>
        </button>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style={{
              backgroundColor:'rgba(255,255,255,0.1)',
              color:'white'
            }}>
              <div class="modal-header" style={{
                borderBottom:'0px'
              }}>
                <h5 class="modal-title" id="exampleModalLabel" style={{
                  fontFamily: "Comfortaa",
                }}>
                  Share file Id to collaborate with others
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-mdb-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    aria-describedby="button-addon2"
                    readOnly
                    value={fileId}
                    id="file-link"
                  />
                  <button
                    class="btn btn-primary"
                    type="button"
                    id="button-addon2"
                    data-mdb-ripple-color="dark"
                    onClick={copylink}
                  >
                    <i class={`fa ${copybtn}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-md btn-dark"
          id="downloadcode"
          data-mdb-toggle="tooltip"
          data-mdb-placement="top"
          title="Download Code"
          style={{
            marginRight: "0px",
          }}
          download="code.txt"
          onClick={downloadCode}
        >
          <i class="fa fa-download" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
}
