import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [msg, setMsg] = useState("");
  const navigate = useNavigate();


  const Register = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return
    }

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        username,
        email,
        name,
        password
      },
      { 
        withCredentials: true 
      });

      const success = response.data.success;

      if (success){
        navigate("/profile")
      }
      else {
        console.log(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <section>
        <h1>Register</h1>
        <form onSubmit={ Register }>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email"  value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="name">Fullname</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="confirmPassword">Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    </section>
  )
}

export default Register;