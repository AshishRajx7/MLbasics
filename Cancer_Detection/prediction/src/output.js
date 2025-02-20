import React from 'react';
import './styles.css';
import './scripts.js';
import { useLocation, Link } from 'react-router-dom';

const PredictionResult = () => {
  const location = useLocation();
  const { prediction } = location.state || { prediction: 'No prediction available' };

  return (
    <div className="content">
      <h1>Prediction Result</h1>
      <h2>Prediction: {prediction}</h2>
      <Link to="/predict">Test Again</Link>
    </div>
  );
};

export default PredictionResult;
