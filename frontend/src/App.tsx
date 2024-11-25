// import { ReactDOM } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Error/Notfound";
import Logout from "./components/Logout";



function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile"/>
          <Route path="/logout" element={<Logout/>} />
          <Route path="*" element={<Notfound/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
