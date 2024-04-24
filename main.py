from flask import Flask, request, jsonify
from joblib import load
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer,CountVectorizer
import requests


app = Flask(__name__)

decisionTree_model = load('Decision_Tree_model.joblib')
vectorizer = load('vectorizer.pkl')
label_encoder = load('label_encoder.pkl')



@app.route('/receive_url', methods=['POST'])
def receive_url():
    url_data = request.json.get('url')
    print("Received URL:", url_data)
    new_urls = [url_data]
    X_new = vectorizer.transform(new_urls)
    predicted_labels = decisionTree_model.predict(X_new)
    decoded_labels = label_encoder.inverse_transform(predicted_labels)
    print("Predicted labels for new URLs:", decoded_labels[0])
    
    response_data = {'message': decoded_labels[0]}

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)
