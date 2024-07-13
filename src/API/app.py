from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

svm_model = joblib.load('svm_model.joblib')

def preprocess_input(pressure, max_temp, min_temp, wind, humidity):
    
    feature_columns = ['MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine',
                       'WindGustSpeed', 'WindSpeed9am', 'WindSpeed3pm', 'Humidity9am',
                       'Humidity3pm', 'Pressure9am', 'Pressure3pm', 'Cloud9am', 'Cloud3pm',
                       'Temp9am', 'Temp3pm', 'RainToday_No', 'RainToday_Yes', 'WindGustDir_E',
                       'WindGustDir_ENE', 'WindGustDir_ESE', 'WindGustDir_N', 'WindGustDir_NE',
                       'WindGustDir_NNE', 'WindGustDir_NNW', 'WindGustDir_NW', 'WindGustDir_S',
                       'WindGustDir_SE', 'WindGustDir_SSE', 'WindGustDir_SSW', 'WindGustDir_SW',
                       'WindGustDir_W', 'WindGustDir_WNW', 'WindGustDir_WSW', 'WindDir9am_E',
                       'WindDir9am_ENE', 'WindDir9am_ESE', 'WindDir9am_N', 'WindDir9am_NE',
                       'WindDir9am_NNE', 'WindDir9am_NNW', 'WindDir9am_NW', 'WindDir9am_S',
                       'WindDir9am_SE', 'WindDir9am_SSE', 'WindDir9am_SSW', 'WindDir9am_SW',
                       'WindDir9am_W', 'WindDir9am_WNW', 'WindDir9am_WSW', 'WindDir3pm_E',
                       'WindDir3pm_ENE', 'WindDir3pm_ESE', 'WindDir3pm_N', 'WindDir3pm_NE',
                       'WindDir3pm_NNE', 'WindDir3pm_NNW', 'WindDir3pm_NW', 'WindDir3pm_S',
                       'WindDir3pm_SE', 'WindDir3pm_SSE', 'WindDir3pm_SSW', 'WindDir3pm_SW',
                       'WindDir3pm_W', 'WindDir3pm_WNW', 'WindDir3pm_WSW']
    df = pd.DataFrame(columns=feature_columns)
    df.loc[0] = np.zeros(len(feature_columns))  # Initialize with zeros

    # hardcoded values
    df.loc[0, 'MinTemp'] = 19.5
    df.loc[0, 'MaxTemp'] = 22.4
    df.loc[0, 'Rainfall'] = 0
    df.loc[0, 'Evaporation'] = 6.2
    df.loc[0, 'Sunshine'] = 13.1
    df.loc[0, 'WindGustDir_W'] = 1
    df.loc[0, 'WindGustSpeed'] = 41
    df.loc[0, 'WindDir9am_S'] = 0
    df.loc[0, 'WindDir3pm_SSW'] = 1
    df.loc[0, 'WindSpeed9am'] = 17
    df.loc[0, 'WindSpeed3pm'] = 20
    df.loc[0, 'Humidity9am'] = 60
    df.loc[0, 'Humidity3pm'] = 70
    df.loc[0, 'Pressure9am'] = 1017.6
    df.loc[0, 'Pressure3pm'] = 1017.4
    df.loc[0, 'Cloud9am'] = 8
    df.loc[0, 'Cloud3pm'] = 5
    df.loc[0, 'Temp9am'] = 20.7
    df.loc[0, 'Temp3pm'] = 26.9
    df.loc[0, 'RainToday_No'] = 1
    df.loc[0, 'RainToday_Yes'] = 0

    # live data
    df.loc[0, 'Pressure9am'] = pressure
    df.loc[0, 'Pressure3pm'] = pressure
    df.loc[0, 'MaxTemp'] = max_temp
    df.loc[0, 'MinTemp'] = min_temp
    df.loc[0, 'Humidity9am'] = humidity
    df.loc[0, 'Humidity3pm'] =  humidity


    return df.values

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  
        min_temp = data['min_temp']
        humidity = data['humidity']
        wind = data['wind']  
        max_temp = data['max_temp']
        pressure = data['pressure']  
        
        
        features = preprocess_input(max_temp, min_temp, wind, humidity, pressure)
        prediction = svm_model.predict(features)[0]  

        
        result = "Yes" if prediction == 1 else "No"
        return jsonify({'prediction': result})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
