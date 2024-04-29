from joblib import load
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Conv1D, MaxPooling1D, LSTM, Dense, Attention, Concatenate, Flatten
     


# # Replace 'decision.pkl' with the path to your .joblib file
# joblib_file_path = 'Decision_Tree_model.joblib'

# # Load the contents of the .joblib file
# data = load(joblib_file_path)

# # Print or inspect the loaded data
# print(data)

# import whois
# url = "https://state.bihar.gov.in/urban/CitizenHome.html"
# try:
#    domain_info = whois.whois(url)
#    print(domain_info)
# except Exception as e:
#    print("Error")


model=load('deep_learning_model.joblib')


new_data = ["videosurf.com/pat-patterson-1447461","whttp://style.org.hc360.com/css/detail/mysite/siteconfig/pro_control.css", "http://pastehtml.com/view/blpo63jy9.html"]
sequences = tokenizer.texts_to_sequences(new_data)
padded_sequences = pad_sequences(sequences, maxlen=max_len)
predictions = model.predict(padded_sequences)

print(predictions)