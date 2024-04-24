from joblib import load

# Replace 'decision.pkl' with the path to your .joblib file
joblib_file_path = 'Decision_Tree_model.joblib'

# Load the contents of the .joblib file
data = load(joblib_file_path)

# Print or inspect the loaded data
print(data)
