// import { ReactDOM } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./pages/Profile";
import ConnectionRequestPage from "./pages/ConnectionRequest";
import ConnectionPage from "./pages/Connection";
import Notfound from "./components/Error/Notfound";
import Logout from "./components/Logout";
import FeedContainer from "./components/Feed/Feed";
import { Toaster } from "./components/ui/toaster";


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
        <Header />
        <main className="main-content mt-16 pb-2 left-0 w-full h-full z-10 border-b">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/header" element={<Header />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/connection/request" element={<ConnectionRequestPage />} />
            <Route path="/connection/list/:id" element={<ConnectionPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Notfound />} />
            <Route path="/feed" element={<FeedContainer feeds={feeds} />} />
          </Routes>
        </main >
      </Router>
      <Toaster />
    </>
  )
}

export default App
