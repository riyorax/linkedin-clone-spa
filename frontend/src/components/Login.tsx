import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [msg, setMsg] = useState("");
    const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/login", {
        email: email,
        password: password
      },
      { 
        withCredentials: true 
      });
        navigate("/profile");
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <section>
        <h1>Login</h1>
        <form onSubmit={ Auth }>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    </section>
  )
}

export default Login;