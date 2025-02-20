import React, { useState } from 'react';
import './styles.css';
import { Link, useNavigate } from 'react-router-dom';

const Predict = () => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [diseaseType, setDiseaseType] = useState(''); // State for the dropdown
  const [error, setError] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewSrc(event.target.result); // Set preview image
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDiseaseTypeChange = (e) => {
    setDiseaseType(e.target.value); // Update disease type selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    if (!file) {
      setError('Please select a file.');
      return;
    }

    if (!diseaseType) {
      setError('Please select a disease type.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('disease_type', diseaseType); // Include the disease type

    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        navigate('/result', { state: { prediction: data.prediction } });
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (error) {
      setError('Error connecting to the server');
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>Cancer detection system</h1>
          <nav>
            <button className="nav-toggle" onClick={toggleNav}>
              <div className="hamburger"></div>
              <div className="hamburger"></div>
              <div className="hamburger"></div>
            </button>
            <ul className={`nav-links ${isNavOpen ? 'open' : ''}`}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/predict">Predict</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <div className="content">
          <h2>Upload an Image and Select Disease Type</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" name="file" onChange={handleFileChange} required />
            <label htmlFor="disease_type">Select Disease Type:</label>
            <select name="disease_type" value={diseaseType} onChange={handleDiseaseTypeChange} required>
              <option value="">--Select Disease Type--</option>
              <option value="oral_cancer">Oral cancer</option>
              <option value="eye_cancer">Eye Cancer</option>
              <option value="brain_cancer">Brain cancer</option>
            </select>
            <input type="submit" value="Predict" />
          </form>
          {/* Image preview */}
          {previewSrc && <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
        </div>
      </main>
    </div>
  );
};

export default Predict;