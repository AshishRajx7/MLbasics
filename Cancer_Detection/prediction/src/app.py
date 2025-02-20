from flask import Flask, request, jsonify
from tensorflow import keras
import os
from werkzeug.utils import secure_filename
import pickle
from PIL import Image
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Define paths to your pickled models
MODEL_PATHS = {
    'colon_cancer': 'models/colon_cancer_model.pkl',
    'oral_cancer': 'C:\PROJECT\MODELS\oral_cancer.pkl',
    'eye_cancer': 'C:\PROJECT\MODELS\eye_cancer.pkl',
    'brain_cancer': r'C:\PROJECT\MODELS\brain_cancer.pkl'
}

# Ensure the models are loaded at the start
models = {}

def load_model(disease_type):
    if disease_type in models:
        return models[disease_type]
    with open(MODEL_PATHS[disease_type], 'rb') as model_file:
        model = pickle.load(model_file)
        models[disease_type] = model
    return model

# Preprocessing functions for each disease model
def preprocess_colon_cancer(image_path):
    img = Image.open(image_path).convert('L')  # Convert to grayscale
    img = img.resize((64, 64))  # Resize to match the input shape
    img_array = np.array(img).reshape(1, -1) / 255.0  # Normalize
    return img_array

def preprocess_oral_cancer(image_path):
    img = Image.open(image_path).convert('RGB') 
    img = img.resize((256, 256))
    img = np.array(img)
    img = img / 255.0
    img_array = np.expand_dims(img, axis=0)
    
    return img_array


def preprocess_eye_cancer(image_path):
    img = Image.open(image_path).convert('RGB')  # Convert to RGB
    img = img.resize((224, 224))  # Resize to match the input shape of the model
    img_array = np.array(img).astype(np.float32) / 255.0  # Normalize the image data
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension (1, 224, 224, 3)
    return img_array

def preprocess_brain_cancer(image_path):
    img = Image.open(image_path).convert('RGB')  # Ensure 3 channels (RGB)
    img = img.resize((256, 256))  # Resize to 256x256 as expected by the model
    img = np.array(img).astype(np.float32) / 255.0  # Normalize pixel values to [0, 1]
    
    # Don't flatten, keep the shape as (1, 256, 256, 3) for CNN input
    img_array = np.expand_dims(img, axis=0)  # Add batch dimension (1, 256, 256, 3)
    
    return img_array



# Dictionary to map disease types to their preprocessing functions
PREPROCESSING_FUNCTIONS = {
    'colon_cancer': preprocess_colon_cancer,
    'oral_cancer': preprocess_oral_cancer,
    'eye_cancer': preprocess_eye_cancer,
    'brain_cancer': preprocess_brain_cancer
}

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files or 'disease_type' not in request.form:
        return jsonify({'error': 'No file or disease type provided'}), 400
    
    # Get the file and the disease type
    file = request.files['file']
    disease_type = request.form['disease_type']

    # Ensure a valid disease type is provided
    if disease_type not in MODEL_PATHS:
        return jsonify({'error': 'Invalid disease type'}), 400

    # Save the uploaded file to a temporary location
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)

    try:
        # Preprocess the image using the appropriate function
        preprocess_function = PREPROCESSING_FUNCTIONS[disease_type]
        img_array = preprocess_function(file_path)
        
        # Load the appropriate model based on disease type
        model = load_model(disease_type)
        
        # Make the prediction
        prediction = model.predict(img_array)
        
        # Convert prediction to a scalar value (handling multi-dimensional arrays)
        prediction_value = prediction[0]  # If prediction is a single value array

        # If prediction is still an array (e.g. more than one value), convert to scalar
        if isinstance(prediction_value, (np.ndarray, list)):
            prediction_value = prediction_value[0]  # Use the first element
        
        # Convert the prediction to "Yes" or "No"
        prediction_label = "Positive for cancer" if prediction_value >= 0.565 else "Negetive for cancer"
        
        # Clean up (remove the file after processing)
        os.remove(file_path)
        
        # Return the prediction as JSON
        return jsonify({'prediction': prediction_label}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Ensure the uploads directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    app.run(debug=True) 