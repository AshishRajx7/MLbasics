// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form'; // Import the Form component
import './styles.css'; // Import the CSS file

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const loginResponse = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await loginResponse.json();

    if (loginResponse.ok) {
      // Store the JWT token in local storage
      localStorage.setItem('access_token', data.access_token);
      // Navigate to /predict upon successful login
      navigate('/predict');
    } else {
      alert(data.message || 'Login failed, please try again.');
    }
  };

  return (
    <div className="content">
      <Form title="Login" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-box"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-box"
          required
        />
        <div className="button-group">
          <button type="submit">Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </Form>
    </div>
  );
}

export default Login;