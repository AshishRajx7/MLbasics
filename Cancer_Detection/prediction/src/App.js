import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Predict from './prediction.js';
import PredictionResult from './output.js';
import Login from './Login.js';
import Register from'./Register.js';
import './styles.css';
import './scripts.js';
import Home from'./Home.js';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/result" element={<PredictionResult prediction="Prediction goes here" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
