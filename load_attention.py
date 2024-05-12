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

# Define the Lambda layer function
# lambda_func = lambda x: tf.reduce_mean(x, axis=1)
# joblib_file_path = 'CNN_LSTM_TCN_attention_model.pkl'
# def lambda_func(x):
#     return tf.reduce_mean(x, axis=1)

# CNN_model1 = load(joblib_file_path)
# CNN_model1 = keras.models.load_model('CNN_LSTM_TCN_attention_model.h5')
# x = layers.Lambda(lambda_func)(attentioned_features)

average_length_hostname=21.090288713910763
average_url=61.12668416447944
average_nb_dots=2.4807524059492563
average_nb_hyphens=0.9975503062117236
average_nb_slash=4.289588801399825
average_ratio_digits_url=0.053137301645581766
average_nb_subdomains=2.23167104111986

def analyze_phishing_hints(url):
    # Placeholder function to analyze phishing hints
    # Example: check if the URL contains suspicious keywords
    suspicious_keywords = ['login', 'password', 'verify', 'account']
    print("from analyze_phishing_hints")
    for keyword in suspicious_keywords:
        if keyword in url:
            return 0  # Phishing hint detected
    return 1  # No phishing hint detected


def count_redirections(url):
    try:
        print("from count_redirections")
        response = requests.head(url, allow_redirects=True)
        return len(response.history)  # Number of redirections
    except requests.RequestException:
        return -1  # Error occurred during request
    except:
        return -1
    
def count_external_redirections(url):
    try:
        print("from count_externanl_redirections")
        response = requests.head(url, allow_redirects=True)
        redirection_urls = [urlparse(r.url) for r in response.history]
        original_domain = urlparse(url).netloc
        return sum(1 for redirect_url in redirection_urls if redirect_url.netloc != original_domain)
    except requests.RequestException:
        return -1  # Error occurred during request
    except:
        return -1
    
def count_char_repeats(url):
    try:
        repeat_count = 0
        prev_char = ''
        for char in url:
            if char == prev_char:
                repeat_count += 1
            else:
                prev_char = char
        return repeat_count
    except:
        return -1
    
    
brand_names = [
    "Google", "Apple", "Microsoft", "Amazon", "Facebook", "Coca-Cola", "Disney", "Toyota", "Samsung", "IBM",
    "McDonald's", "Nike", "Intel", "Mercedes-Benz", "BMW", "Louis Vuitton", "Sony", "Honda", "Cisco", "Adidas",
    "Pepsi", "Verizon", "Audi", "Volkswagen", "HP", "Panasonic", "Ford", "Oracle", "Dell", "AT&T",
    "General Electric", "IBM", "IKEA", "Tesla", "Netflix", "Adobe", "Huawei", "Xiaomi", "Siemens", "Instagram",
    "Twitter", "Airbnb", "Uber", "Lyft", "PayPal", "Airbnb", "Spotify", "WhatsApp", "Pinterest", "Snapchat",
    "FedEx", "UPS", "DHL", "Bank of America", "JPMorgan Chase", "Wells Fargo", "Goldman Sachs", "Morgan Stanley",
    "Citigroup", "HSBC", "Barclays", "Deutsche Bank", "Santander", "BBVA", "BNP Paribas", "ING Group", "UBS",
    "Credit Suisse", "Société Générale", "Capital One", "American Express", "Discover Financial Services", "Visa",
    "Mastercard", "PayPal", "Western Union", "MoneyGram", "TransferWise", "Remitly", "WorldRemit", "Ria Money Transfer",
    "Payoneer", "Skrill", "Venmo"
]
domain=''
def get_domain_name(url):
    try:
        print("from get_domain_name")
        domain = whois.whois(url).domain
        return domain
    except:
        return -1

def is_domain_in_brand(url, brand_names):
    domain=get_domain_name(url)
    print("from is domain in brand")
    try:
        for brand in brand_names:
            if brand.lower() in domain.lower():
                return 0
        return 1
    except:
        return -1  # Error occurred during processing
    

def brand_in_path(url, brand_names):
    parsed_url = urlparse(url)
    path = parsed_url.path
    print("from brand in path")
    for brand in brand_names:
        if brand.lower() in path.lower():
            return 0
    
    return 1


def calculate_external_redirection_ratio(url):
    try:
        response = requests.head(url, allow_redirects=True)
        redirections = response.history
        
        num_external_redirections = sum(1 for redirect in redirections if urlparse(redirect.url).netloc != urlparse(url).netloc)
        total_redirections = len(redirections)
        
        if total_redirections > 0:
            ratio_external_redirections = num_external_redirections / total_redirections
        else:
            ratio_external_redirections = 0.0
        
        return ratio_external_redirections
    except Exception as e:
        print("Error:", e)
        return 0.0
    
    
def calculate_internal_error_ratio(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        internal_error_count = 0
        total_hyperlink_count = 0
        
        base_url = urlparse(url).scheme + "://" + urlparse(url).netloc
        
        for tag in soup.find_all('a', href=True):
            href = tag['href']
            if href.startswith('/'):
                href = urljoin(base_url, href)
            elif not urlparse(href).scheme:
                href = "http://" + href  # Assuming http, you can use https as well
            if urlparse(href).netloc == urlparse(url).netloc:
                total_hyperlink_count += 1
                try:
                    hyperlink_response = requests.head(href, allow_redirects=True)
                    if hyperlink_response.status_code >= 500:
                        internal_error_count += 1
                except requests.RequestException as e:
                    print("Error while checking hyperlink:", e)
        
        if total_hyperlink_count > 0:
            ratio_internal_errors = internal_error_count / total_hyperlink_count
        else:
            ratio_internal_errors = 0.0
        
        return ratio_internal_errors
    except requests.RequestException as e:
        print("Request Error:", e)
        return 0.0
    except Exception as e:
        print("Error:", e)
        return 0.0
    
    
def has_links_in_tags(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all tags that may contain links
        tags_with_links = soup.find_all(['a', 'img', 'script', 'link'])
        
        if tags_with_links:
            return 0
        else:
            return 1
    except Exception as e:
        print("Error:", e)
        return 0
    
def ratio_intMedia(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all media elements (e.g., <img>, <video>, <audio>)
        media_elements = soup.find_all(['img', 'video', 'audio'])
        
        # Count the number of internal media elements
        internal_media_count = 0
        parsed_url = urlparse(url)
        base_domain = parsed_url.netloc
        
        for element in media_elements:
            src = element.get('src')
            if src:
                parsed_src = urlparse(src)
                if not parsed_src.netloc or parsed_src.netloc == base_domain:
                    internal_media_count += 1
        
        # Calculate the ratio of internal media content
        total_media_count = len(media_elements)
        if total_media_count > 0:
            ratio = internal_media_count / total_media_count
        else:
            ratio = 0.0
        
        return ratio
    except Exception as e:
        print("Error:", e)
        return 0.0
    
def ratio_extMedia(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all media elements (e.g., <img>, <video>, <audio>)
        media_elements = soup.find_all(['img', 'video', 'audio'])
        
        # Count the number of external media elements
        external_media_count = 0
        parsed_url = urlparse(url)
        base_domain = parsed_url.netloc
        
        for element in media_elements:
            src = element.get('src')
            if src:
                parsed_src = urlparse(src)
                if parsed_src.netloc and parsed_src.netloc != base_domain:
                    external_media_count += 1
        
        # Calculate the ratio of external media content
        total_media_count = len(media_elements)
        if total_media_count > 0:
            ratio = external_media_count / total_media_count
        else:
            ratio = 0.0
        
        return ratio
    except Exception as e:
        print("Error:", e)
        return 0.0
    
def is_domain_in_title(html_content, domain):
    soup = BeautifulSoup(html_content, 'html.parser')
    title_tag = soup.find('title')
    if title_tag is None:
        return 0  # Title tag not present
    else:
        title_text = title_tag.text.lower()
        if domain in title_text:
            return 1
        
def is_domain_in_title(url, domain):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        title_tag = soup.find('title')
        if title_tag is None:
            return 0  # Title tag not present
        else:
            title_text = title_tag.text.lower()
            if domain in title_text:
                return 1
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return 0  # Return False if there's an error fetching the URL
    except:
        return 0
    
def has_copyright_notice(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Check for common copyright phrases or patterns in the HTML content
        copyright_phrases = ['copyright', 'all rights reserved', '©']
        for phrase in copyright_phrases:
            if phrase in html_content.lower():
                return 1
        
        return 0  # If no copyright notice found
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return 0 # Return False if there's an error fetching the URL
    except:
        return 0
    
def is_domain_registered(domain):
    try:
        domain_info = whois.whois(domain)
        
        # Check if creation date is available (indicating the domain is registered)
        if domain_info.creation_date is not None:
            return 1
        else:
            return 0
        
    except whois.parser.PywhoisError as e:
        print(f"WHOIS lookup failed: {e}")
        return 0  # Return False if WHOIS lookup fails
    except:
        return 0
    
def get_domain_registration_length(domain):
    try:
        domain_info = whois.whois(domain)
        
        # Check if creation date and expiration date are available
        if domain_info.creation_date is not None and domain_info.expiration_date is not None:
            # Calculate registration length in days
            registration_length = (domain_info.expiration_date - domain_info.creation_date).days
            return registration_length
        else:
            return 0  # Return None if creation or expiration date is not available
        
    except whois.parser.PywhoisError as e:
        print(f"WHOIS lookup failed: {e}")
        return 0  # Return None if WHOIS lookup fails
    except:
        return 0
    
def get_domain_age(domain):
    try:
        domain_info = whois.whois(domain)
        
        # Check if creation date is available
        if domain_info.creation_date is not None:
            # Calculate domain age in days
            current_date = datetime.now()
            domain_age = (current_date - domain_info.creation_date).days
            return domain_age
        else:
            return 0  # Return None if creation date is not available
        
    except whois.parser.PywhoisError as e:
        print(f"WHOIS lookup failed: {e}")
        return 0  # Return None if WHOIS lookup fails
    except:
        return 0
    
    
def has_dns_records(domain):
    try:
        answers = dns.resolver.resolve(domain, 'A')
        return 1  # DNS records found
    except dns.resolver.NoAnswer:
        return 0  # No DNS records found
    except dns.resolver.NXDOMAIN:
        return 0  # Domain does not exist
    except dns.exception.Timeout:
        return 0  # DNS lookup timed out
    except dns.resolver.NoNameservers:
        return 0  # No DNS servers available
    except Exception as e:
        print(f"Error occurred during DNS lookup: {e}")
        return 0  # Other error occurred
    
    
def retrieve_html_content(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            print(f"Failed to retrieve HTML content from {url}. Status code: {response.status_code}")
            return 0
    except Exception as e:
        print(f"An error occurred while retrieving HTML content from {url}: {str(e)}")
        return 0
    
def count_hyperlinks(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Count the number of anchor tags in the parsed HTML
        num_hyperlinks = len(soup.find_all('a'))
        return num_hyperlinks
    except Exception as e:
        print("Error:", e)
        return 0
    
def is_ip(url):
    try:
        parsed_url = urlparse(url)
        hostname=parsed_url.hostname
        socket.inet_aton(hostname)
        return 1
    except socket.error:
        return 0
    except:
        return 0
    

def extract_features_from_url(url):
    # Parse the URL
    parsed_url = urlparse(url)
    html_content = retrieve_html_content(url)


    # Basic Features
    features = {}

    # length_url
    features['length_url'] = 1 if len(url) > average_url else 0

    # length_hostname
    hostname = parsed_url.hostname if parsed_url.hostname else ""
    features['length_hostname'] = 1 if len(hostname) > average_length_hostname else 0

    # ip
    features['ip'] = bool(re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname))

    # nb_dots
    features['nb_dots'] = 1 if hostname.count('.') > average_nb_dots else 0

    # nb_hyphens
    features['nb_hyphens'] = 1 if hostname.count('-') > average_nb_hyphens else 0

    # nb_at
    features['nb_at'] = url.count('@')

    # nb_qm
    features['nb_qm'] = url.count('?')

    # nb_and
    features['nb_and'] = url.count('&')

    # nb_or
    features['nb_or'] = url.count('|')

    # nb_eq
    features['nb_eq'] = url.count('=')

    # nb_underscore
    features['nb_underscore'] = url.count('_')

    # nb_tilde
    features['nb_tilde'] = url.count('~')

    # nb_percent
    features['nb_percent'] = url.count('%')

    # nb_slash
    features['nb_slash'] = 1 if url.count('/') > average_nb_slash else 0

    # nb_star
    features['nb_star'] = url.count('*')

    # nb_colon
    features['nb_colon'] = url.count(':')

    # nb_www
    features['nb_www'] = 1 if 'www' in hostname else 0

    # nb_com
    features['nb_com'] = 1 if '.com' in hostname else 0

    # nb_dslash
    features['nb_dslash'] = url.count('//')

    # http_in_path
    features['http_in_path'] = 1 if 'http://' in parsed_url.path else 0

    # https_token
    features['https_token'] = 0 if 'https' in url else 1

    # ratio_digits_url
    features['ratio_digits_url'] = sum(c.isdigit() for c in url) / len(url)

    # ratio_digits_host
    features['ratio_digits_host'] = sum(c.isdigit() for c in hostname) / len(hostname) if len(hostname) > 0 else 0

    # port
    features['port'] = parsed_url.port if parsed_url.port else 0

    # abnormal_subdomain
    features['abnormal_subdomain'] = 0 if parsed_url.netloc.count('.') >= 3 else 1

    # nb_subdomains
    features['nb_subdomains'] = parsed_url.netloc.count('.')

    # prefix_suffix
    features['prefix_suffix'] = 0 if '-' in hostname or '_' in hostname else 1

    # random_domain
    features['random_domain'] = 0 if len(hostname) > 15 else 1

    # nb_redirection
    features['nb_redirection'] = count_redirections(url)  # Placeholder, this would be determined through checking redirects

    # nb_external_redirection
    features['nb_external_redirection'] = count_external_redirections(url)  # Placeholder, this would be determined through checking redirects

    # length_words_raw
    words_raw = url.split('/')
    features['length_words_raw'] = len(words_raw)

    # char_repeat
    features['char_repeat'] = count_char_repeats(url)  # Placeholder, this would be determined through checking repeating characters

    # shortest_words_raw
    shortest_words_raw = min(words_raw, key=len)
    features['shortest_words_raw'] = len(shortest_words_raw)

    # shortest_word_host
    features['shortest_word_host'] = len(min(hostname.split('.'), key=len))

    # shortest_word_path
    shortest_word_path = min(words_raw, key=len)
    features['shortest_word_path'] = len(shortest_word_path)

    # longest_words_raw
    longest_words_raw = max(words_raw, key=len)
    features['longest_words_raw'] = len(longest_words_raw)

    # longest_word_host
    features['longest_word_host'] = len(max(hostname.split('.'), key=len))

    # longest_word_path
    longest_word_path = max(words_raw, key=len)
    features['longest_word_path'] = len(longest_word_path)

    # avg_words_raw
    avg_words_raw = sum(len(word) for word in words_raw) / len(words_raw) if len(words_raw) > 0 else 1
    features['avg_words_raw'] = avg_words_raw

    # avg_word_host
    avg_word_host = sum(len(word) for word in hostname.split('.')) / len(hostname.split('.')) if len(hostname.split('.')) > 0 else 1
    features['avg_word_host'] = avg_word_host

    # avg_word_path
    avg_word_path = sum(len(word) for word in words_raw) / len(words_raw) if len(words_raw) > 0 else 1
    features['avg_word_path'] = avg_word_path

    # domain_in_brand
    features['domain_in_brand'] = is_domain_in_brand(url, brand_names)  # Placeholder, this would be determined through brand analysis

    # brand_in_path
    features['brand_in_path'] = brand_in_path(url, brand_names)  # Placeholder, this would be determined through brand analysis


    # nb_hyperlinks
    features['nb_hyperlinks'] = count_hyperlinks(url)  # Placeholder, this would be determined through parsing HTML

    # links_in_tags
    features['links_in_tags'] = has_links_in_tags(url)  # Placeholder, this would be determined through parsing HTML

    # ratio_intMedia
    features['ratio_intMedia'] = ratio_intMedia(url)  # Placeholder, this would be determined through parsing HTML

    # ratio_extMedia
    features['ratio_extMedia'] = ratio_extMedia(url)  # Placeholder, this would be determined through parsing HTML

    # domain_in_title
    features['domain_in_title'] = is_domain_in_title(url, domain)  # Placeholder, this would be determined through parsing HTML

    # domain_with_copyright
    features['domain_with_copyright'] = has_copyright_notice(url)  # Placeholder, this would be determined through parsing HTML

    # domain_registration_length
    features['domain_registration_length'] = get_domain_registration_length(domain)  # Placeholder, this would be determined through WHOIS lookup

    # domain_age
    features['domain_age'] = get_domain_age(domain)  # Placeholder, this would be determined through WHOIS lookup

    # dns_record
    features['dns_record'] = has_dns_records(domain)  # Placeholder, this would be determined through DNS lookup

    # status
#     features['status'] = 0  # Placeholder, this would be determined through checking HTTP status

    return features



# Function to preprocess data
def preprocess_data(features):
    # Convert features dictionary to numpy array
    feature_array = np.array([[feature for feature in features.values()]])
    # Reshape array to match model input shape (assuming 87 features)
    feature_array = feature_array.reshape(1, 52, 1)
    return feature_array



# Example URL
# url = "https://www.youtube.com/"

# # Extract features from URL
# url_features = extract_features_from_url(url)

# # Preprocess the data
# preprocessed_data = preprocess_data(url_features)

# predictions = CNN_model1.predict(preprocessed_data)

# nearest_prediction=int(round(predictions[0][0]))

# print("predicted value:, ", nearest_prediction)                                                                                
    