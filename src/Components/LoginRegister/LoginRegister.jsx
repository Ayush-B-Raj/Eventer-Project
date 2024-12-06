import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginRegister.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;

        // Store user data and username (name field) in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("username", user.name);  // Storing the name (username)

        // Navigate based on admin status
        if (user.admin) {
          navigate("/admin"); // Redirect to AdminPage for admin
        } else {
          navigate("/user"); // Redirect to UserPage for regular users
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
