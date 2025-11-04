import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle

# -------------------------------
# 🧩 Expanded Symptom Dataset
# -------------------------------
data = {
    'fever':        [1, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    'cough':        [1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
    'fatigue':      [1, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    'headache':     [1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    'sore_throat':  [1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
    'body_pain':    [1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    'loss_of_smell':[1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    'disease': [
        'Flu', 'Flu', 'Cold', 'Healthy', 'COVID', 
        'Healthy', 'Migraine', 'Cold', 'COVID', 'Flu'
    ]
}

df = pd.DataFrame(data)

# -------------------------------
# ⚙️ Train the model
# -------------------------------
X = df.drop('disease', axis=1)
y = df['disease']

model = DecisionTreeClassifier()
model.fit(X, y)

# -------------------------------
# 💾 Save trained model
# -------------------------------
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model trained successfully with extended dataset!")
