import { useEffect } from 'react';
import axios from 'axios';

const Logout = () => {
    // Function to retrieve all users
    const logout = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/logout");
            console.log(res.data); // Log the data to verify
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // Use useEffect to call the function on component mount
    useEffect(() => {
        logout();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            <h1>Backdoor</h1>
            <p>Check console for retrieved user data.</p>
        </div>
    );
};

export default Logout;