import { useEffect, useCallback } from "react";
import axios from "axios";
import { useProfile } from "@/context/ProfileContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { refetchProfile, socket } = useProfile(); // Access the socket from the context

  // Function to handle logout
  const logout = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        // Disconnect the socket if it exists
        if (socket) {
          socket.disconnect();
          console.log("Socket disconnected during logout.");
        }

        toast.toast({
          title: "Logout successful",
          description: "Redirecting to the login page...",
          duration: 2000,
        });
        refetchProfile();
        navigate("/login");
      } else {
        toast.toast({
          title: "Logout failed",
          description: res.data.message || "An unknown error occurred.",
          duration: 3000,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error during logout:", err);
      toast.toast({
        title: "Logout error",
        description: "An error occurred. Please try again.",
        duration: 3000,
        variant: "destructive"
      });
    }
  }, [navigate, refetchProfile, socket, toast]);

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default Logout;