import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Retrieve data from SQLite database
connection = sqlite3.connect("biometrics.db")
cursor = connection.cursor()
cursor.execute("SELECT age, cholesterol, blood_pressure FROM patient_data")
data = cursor.fetchall()
connection.close()

# Organize data into features and labels
features = [(age, cholesterol) for age, cholesterol, _ in data]
blood_pressures = [blood_pressure.split('/') for _, _, blood_pressure in data]
systolic_labels = [int(systolic) for systolic, _ in blood_pressures]
diastolic_labels = [int(diastolic) for _, diastolic in blood_pressures]

# Split data into training and testing sets
#Systolic and diastolic features added too
X_train, X_test, systolic_train, systolic_test, diastolic_train, diastolic_test = train_test_split(
    features, systolic_labels, diastolic_labels, test_size=0.2, random_state=42
)

# Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Model Selection and Training (Linear Regression for systolic values)
systolic_model = LinearRegression()
systolic_model.fit(X_train_scaled, systolic_train)

# Model Evaluation
systolic_pred = systolic_model.predict(X_test_scaled)
mse_systolic = mean_squared_error(systolic_test, systolic_pred)
print("Mean Squared Error (Systolic):", mse_systolic)

# Similar steps for diastolic values...

# Prediction for new data
new_age = 18
new_cholesterol = 116

new_data_point = [(new_age, new_cholesterol)]
new_data_point_scaled = scaler.transform(new_data_point)

# Making predictions using the trained model
predicted_systolic = systolic_model.predict(new_data_point_scaled)

# Printing the predicted systolic blood pressure
print("Predicted Systolic Blood Pressure:", predicted_systolic)

