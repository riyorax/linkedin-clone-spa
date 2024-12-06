// import { ReactDOM } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Profile from "./pages/Profile";
import ConnectionRequestPage from "./pages/ConnectionRequest";
import ConnectionPage from "./pages/Connection";
import Notfound from "./components/Error/Notfound";
import Logout from "./components/Logout";
import Feed from "./pages/Feed";
import ChatPage from "./pages/Chat";
import { Toaster } from "./components/ui/toaster";
import { ProfileProvider } from "@/context/ProfileContext";

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Header />
        <main className="main-content mt-16 pb-2 left-0 w-full h-full z-10 border-b">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/header" element={<Header />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" />
            <Route path="/profile/:id" element={<Profile />} />
            <Route
              path="/connection/request"
              element={<ConnectionRequestPage />}
            />
            <Route path="/connection/list/:id" element={<ConnectionPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Notfound />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </Router>
      <Toaster />
    </ProfileProvider>
  );
}

export default App;
