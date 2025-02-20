// src/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form'; // Import the Form component
import './styles.css'; // Import the CSS file
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', {
        username,
        password
      });
      alert('User registered successfully');
    } catch (error) {
      alert('Error registering user');
    }
    console.log("Registering", username, password);
  };

  return (
    <div className="container">
      <Form title="Register" onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </Form>
    </div>
  );
}

export default Register;
