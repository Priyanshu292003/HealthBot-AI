from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app)

# Load model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return jsonify({'message': 'HealthBot AI Backend is running 🚀'})

def match_symptom(user_input, keyword):
    """Check if user input contains or roughly matches a keyword."""
    return keyword in user_input or fuzz.partial_ratio(user_input, keyword) > 80

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        text = data.get('text', '').lower()

        # Match symptoms with fuzzy logic
        fever = 1 if match_symptom(text, "fever") else 0
        cough = 1 if match_symptom(text, "cough") else 0
        fatigue = 1 if match_symptom(text, "tired") or match_symptom(text, "fatigue") else 0
        headache = 1 if match_symptom(text, "headache") else 0
        sore_throat = 1 if match_symptom(text, "throat") else 0
        body_pain = 1 if match_symptom(text, "body pain") or match_symptom(text, "ache") else 0
        loss_of_smell = 1 if match_symptom(text, "smell") else 0

        # Predict
        features = np.array([[fever, cough, fatigue, headache, sore_throat, body_pain, loss_of_smell]])
        prediction = model.predict(features)[0]
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    print("🚀 Starting HealthBot AI Backend...")
    app.run(debug=True)
