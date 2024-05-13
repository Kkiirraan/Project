from flask import Flask, request, jsonify,render_template,redirect
from joblib import load
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer,CountVectorizer
import requests
from flask_cors import CORS
import whois
from load_attention import analyze_phishing_hints,average_length_hostname,average_nb_dots,average_nb_hyphens,average_nb_slash,average_nb_subdomains,average_ratio_digits_url,average_url,brand_in_path,brand_names,calculate_external_redirection_ratio,calculate_internal_error_ratio,classification_report,count_char_repeats,count_external_redirections,count_hyperlinks,count_redirections,extract_features_from_url,get_domain_age,get_domain_name,get_domain_registration_length,has_copyright_notice,has_dns_records,has_links_in_tags,is_domain_in_brand,is_domain_in_title,is_domain_registered,is_ip,preprocess_data,ratio_extMedia,ratio_intMedia,retrieve_html_content
import numpy as np 
import pandas as pd 
import tensorflow as tf 
from tensorflow import keras 
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report,ConfusionMatrixDisplay
from urllib.parse import urlparse,urljoin
import urllib.parse
import requests
import whois
import datetime
from bs4 import BeautifulSoup
import re
from datetime import datetime
import dns.resolver
import socket
from joblib import load
import requests
from tensorflow.keras import layers

#['phishing', 'benign', 'defacement', 'malware']


app = Flask(__name__)
CORS(app)

CNN_model1 = keras.models.load_model('CNN_LSTM_TCN_attention_model.h5')

# decisionTree_model = load('Decision_Tree_model.joblib')
# vectorizer = load('vectorizer.pkl')
# label_encoder = load('label_encoder.pkl')

blocked_urls = []

# model=load('deep_learning_model.joblib')




@app.route('/receive_url', methods=['POST'])
def receive_url():
    url_data = request.json.get('url')
    print("Received URL:", url_data)
    print(blocked_urls)
    block_url = False
    if url_data in blocked_urls:
          print("url data is blocked")
          print(blocked_urls)
          # return redirect('/warning-page')
          block_url = True

    # new_urls = [url_data]
    # X_new = vectorizer.transform(new_urls)
    # predicted_labels = decisionTree_model.predict(X_new)
    # decoded_labels = label_encoder.inverse_transform(predicted_labels)
    # print("Predicted labels for new URLs:", decoded_labels[0])
    url_features = extract_features_from_url(url_data)
    preprocessed_data = preprocess_data(url_features)
    predictions = CNN_model1.predict(preprocessed_data)
    nearest_prediction=int(round(predictions[0][0]))
    print("predicted value:", nearest_prediction)
    response_data = {'message': nearest_prediction,"block_url":block_url}
#     response_data = {'message': "phishing","block_url":block_url}
    

    return jsonify(response_data)
# @app.route("/",methods=["GET", "POST"])
# def home():
#     return render_template('popup.html')

@app.route('/check_url', methods=['POST'])
def check_url():
  data = request.get_json()
  url = data.get('url')
  print(url)
  if url in blocked_urls:
        blockedTrue=True;
        print(blockedTrue)
  else:
    blockedTrue=False;      
  domain_data = {}
  # new_urls = [url]
  # X_new = vectorizer.transform(new_urls)
  # predicted_labels = decisionTree_model.predict(X_new)
  # decoded_labels = label_encoder.inverse_transform(predicted_labels)
  # print("Predicted from website:",decoded_labels[0])
  url_features = extract_features_from_url(url)
  preprocessed_data = preprocess_data(url_features)
  predictions = CNN_model1.predict(preprocessed_data)
  nearest_prediction=int(round(predictions[0][0]))
  print("predicted value: ", nearest_prediction)
  response_data = {'detected_message': nearest_prediction}  
#   response_data = {'detected_message': "defacement"}  #['phishing', 'benign', 'defacement', 'malware']
  try:
   domain_info = whois.whois(url)
   domain_data = {
    "domain_name": domain_info.domain_name,
    "registrar": domain_info.registrar,
    "creation_date": domain_info.creation_date,
    "expiration_date": domain_info.expiration_date,
    "name_servers": domain_info.name_servers,
    "emails": domain_info.emails,
    "dnssec": domain_info.dnssec,
    "org": domain_info.org,
    "state": domain_info.state,
    "country": domain_info.country,
     }
   print("domain data",domain_data)
   domain_details=jsonify({'detected_message':response_data,"domain_data":domain_data,"blockedTrue":blockedTrue})
   json_string = domain_details.get_data(as_text=True)
   print(json_string)
   return domain_details
  except Exception as e:
   print("Error")
   domain_details=jsonify({'detected_message':response_data,"domain_data":domain_data,"blockedTrue":blockedTrue})
   json_string = domain_details.get_data(as_text=True)
   print(json_string)
   return domain_data
  return domain_data

@app.route('/warning-page',methods=['GET', 'POST'])
def warning_page():
        return render_template("warning_page.html")


@app.route('/block_url',methods=['GET', 'POST'])
def block_url():
  data = request.get_json()
  url = data.get('url')
  buttonText=data.get('buttonText')
  print(buttonText)
  if url in blocked_urls and buttonText=='UnBlock':
        blocked_urls.remove(url)
        return jsonify({'success': 'Ablock'})
  else:
        print("blocked")
        blocked_urls.append(url)
  print(url)

  return jsonify({'success': 'Sblock'})


if __name__ == '__main__':
    app.run(debug=True)
