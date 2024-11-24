import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      await axios.post("http://localhost:3000/api/register", {
        username,
        email,
        password
      });
      navigate("/login");
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