// import { ReactDOM } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Error/Notfound";
import Logout from "./components/Logout";
import FeedContainer from "./components/Feed/FeedContainer";
import FeedInput from "./components/Feed/FeedInput";


function App() {
  const feeds = [
    {
      user_name: "John Doe",
      user_profile: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      content: "Excited to share my first post here! 🌟",
    },
    {
      user_name: "Jane Smith",
      user_profile: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      content: "Just completed my latest project. Feeling proud! 🚀",
    },
    {
      user_name: "Michael Brown",
      user_profile: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      content: "Had a great weekend hiking with friends! 🏞️",
    },
    {
      user_name: "Emma Wilson",
      user_profile: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      content: "Learning React is so much fun! 💻",
    },
    {
      user_name: "Liam Johnson",
      user_profile: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      content: "Exploring new ideas for my startup. Stay tuned! 💡",
    },
  ];
  
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
          <Route path="/feed" element={<FeedInput/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
