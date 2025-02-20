import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import './scripts.js';

const Home = () => {
  return (
    
    <div>
      <h1>Welcome to Multimodal Cancer Prediction</h1>
      <nav>
        <ul>
        <div className="content">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/predict">Predict</Link></li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
