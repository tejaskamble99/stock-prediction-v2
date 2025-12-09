import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM
import json
import datetime

def lstm_prediction(se, stock_symbol):
    
    def fetch_stock_data(se, stock_symbol):
        """fetch stock data"""
        if se == 'NSE': 
            stock_symbol += ".NS"
        
        # Download data
        df = yf.download(stock_symbol, period="5y", progress=False)
        
        # FIX: Flatten MultiIndex columns (This fixes the "Close": null issue)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
            
        # Ensure we only work with the 'Close' column
        return df[['Close']]

    og_df = fetch_stock_data(se, stock_symbol)
    
    if og_df.empty:
        return json.dumps({"error": "No data found for this symbol"})

    # Reset index to get Date as a column
    todataframe = og_df.reset_index()

    # Dataframe creation
    new_seriesdata = pd.DataFrame()
    new_seriesdata['Date'] = todataframe['Date']
    new_seriesdata['Close'] = todataframe['Close']
    
    # Set index
    new_seriesdata.index = new_seriesdata['Date']
    new_seriesdata.drop('Date', axis=1, inplace=True)
    
    # Process Data
    myseriesdataset = new_seriesdata.values
    scalerdata = MinMaxScaler(feature_range=(0, 1))
    scale_data = scalerdata.fit_transform(myseriesdataset)
    
    x_totrain, y_totrain = [], []
    length_of_totrain = len(myseriesdataset)
    
    for i in range(60, length_of_totrain):
        x_totrain.append(scale_data[i - 60:i, 0])
        y_totrain.append(scale_data[i, 0])
        
    x_totrain, y_totrain = np.array(x_totrain), np.array(y_totrain)
    x_totrain = np.reshape(x_totrain, (x_totrain.shape[0], x_totrain.shape[1], 1))
    
    # LSTM model
    lstm_model = Sequential()
    lstm_model.add(LSTM(units=50, return_sequences=True, input_shape=(x_totrain.shape[1], 1)))
    lstm_model.add(LSTM(units=50))
    lstm_model.add(Dense(1))
    lstm_model.compile(loss='mean_squared_error', optimizer='adadelta')
    
    lstm_model.fit(x_totrain, y_totrain, epochs=50, batch_size=32, verbose=0)
    
    # Predict
    myinputs = new_seriesdata[len(new_seriesdata) - 160:].values
    myinputs = myinputs.reshape(-1, 1)
    myinputs = scalerdata.transform(myinputs)
    
    tostore_test_result = []
    for i in range(60, myinputs.shape[0]):
        tostore_test_result.append(myinputs[i - 60:i, 0])
        
    tostore_test_result = np.array(tostore_test_result)
    tostore_test_result = np.reshape(tostore_test_result, (tostore_test_result.shape[0], tostore_test_result.shape[1], 1))
    
    myclosing_priceresult = lstm_model.predict(tostore_test_result)
    myclosing_priceresult = scalerdata.inverse_transform(myclosing_priceresult)

    # Combine Results
    datelist = pd.date_range(pd.Timestamp.now().date(), periods=len(myclosing_priceresult) + 1)[1:]
    predicted_df = pd.DataFrame(myclosing_priceresult, columns=['Close'], index=datelist)
    
    og_df_close = og_df[['Close']]
    result_df = pd.concat([og_df_close, predicted_df])
    result_df = result_df.reset_index()
    result_df.columns = ['Date', 'Close']

    def get_json(df):
        # FIX: Convert to object to handle None/NaN safely
        df = df.astype(object).where(pd.notnull(df), None)

        def convert_timestamp(item_date_object):
            if isinstance(item_date_object, (datetime.date, datetime.datetime)):
                return item_date_object.strftime("%Y-%m-%d")
            if isinstance(item_date_object, (np.int64, np.float64)):
                 return int(item_date_object)

        dict_ = df.to_dict(orient='records')
        return json.dumps(dict_, default=convert_timestamp, allow_nan=False)

    return get_json(result_df)