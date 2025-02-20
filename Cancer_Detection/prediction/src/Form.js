// src/Form.js
import React from 'react';
import './styles.css'; // Import the CSS file

function Form({ title, onSubmit, children }) {
  return (
    <div className="form-container">
      <h1>{title}</h1>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}

export default Form;
