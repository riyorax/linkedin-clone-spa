import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header/Header";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Profile from "@/pages/Profile";
import ConnectionRequestPage from "@/pages/ConnectionRequest";
import ConnectionPage from "@/pages/Connection";
import ListUserPage from "@/pages/ListUsers";
import Logout from "@/pages/Logout";
import Feed from "@/pages/Feed";
import ChatPage from "./pages/Chat";
import { Toaster } from "@/components/ui/toaster";
import { NotFoundPage } from "@/components/Error/NotFoundPage"
import { ProfileProvider } from "@/context/ProfileContext";
import { useEffect } from "react";
import { initPushNotif } from "./utils/webpush";

function App() {
  useEffect(() => {
    initPushNotif()
  }, []) 
  return (
    <ProfileProvider>
      <Router>
        <Header />
        <main className="main-content mt-16 pb-2 left-0 w-full h-full z-10 border-b">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route
              path="/connection/request"
              element={<ConnectionRequestPage />}
            />
            <Route path="/connection/list/:id" element={<ConnectionPage />} />
            <Route path="/users" element={<ListUserPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFoundPage />} />
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
