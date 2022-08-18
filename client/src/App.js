import Editor from "./Editor";
import Home from "./Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
    <div>
      <Toaster position='top-center' toastOptions={{
        style:{
          color:'white',
          backgroundColor:'rgba(0,0,0,0.5)'
        }
      }}/>
    </div>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}>
        </Route>
        <Route path="/editor/:fileId" element={<Editor/>} >
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
