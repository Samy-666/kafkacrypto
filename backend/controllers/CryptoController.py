import requests
import json
from flask import jsonify, request
from datetime import datetime, timedelta


def get_crypto_value_by_id(id):
    url = 'https://api.coingecko.com/api/v3/coins/'+id
    response = requests.get(url)
    if response.status_code == 200:
        return {'Rank': response.json()['market_cap_rank'],
                'Value': response.json()['market_data']['current_price']['usd'],
                'Name': response.json()['name'],
                'Symbol': response.json()['symbol'],
                'Image': response.json()['image']['large'],
                'Description': response.json()['description']['en'],
                'Website': response.json()['links']['homepage'][0],
                'Genesis Date': response.json()['genesis_date'],
                'Market Cap': response.json()['market_data']['market_cap']['usd'],
                'Circulating Supply': response.json()['market_data']['circulating_supply'],
                'Total Supply': response.json()['market_data']['total_supply'],
                'Max Supply': response.json()['market_data']['max_supply'],
                'All Time High': response.json()['market_data']['ath']['usd'],
                'All Time Low': response.json()['market_data']['atl']['usd'],
                'Price Change 24h': response.json()['market_data']['price_change_24h'],
                'Price Change Percentage 24h': response.json()['market_data']['price_change_percentage_24h'],
                'Price Change Percentage 7d': response.json()['market_data']['price_change_percentage_7d'],
                'Price Change Percentage 14d': response.json()['market_data']['price_change_percentage_14d'],
                'Price Change Percentage 30d': response.json()['market_data']['price_change_percentage_30d'],
                'Price Change Percentage 60d': response.json()['market_data']['price_change_percentage_60d'],
                'Price Change Percentage 200d': response.json()['market_data']['price_change_percentage_200d'],
                'Price Change Percentage 1y': response.json()['market_data']['price_change_percentage_1y'],
                'Market Cap Change 24h': response.json()['market_data']['market_cap_change_24h'],
                'Market Cap Change Percentage 24h': response.json()['market_data']['market_cap_change_percentage_24h'],
                'Price Change Percentage 7d': response.json()['market_data']['price_change_percentage_7d'],
                'Price Change Percentage 14d': response.json()['market_data']['price_change_percentage_14d'],
                'Price Change Percentage 30d': response.json()['market_data']['price_change_percentage_30d'],
                'Price Change Percentage 60d': response.json()['market_data']['price_change_percentage_60d'],
                'Price Change Percentage 200d': response.json()['market_data']['price_change_percentage_200d'],
                'Price Change Percentage 1y': response.json()['market_data']['price_change_percentage_1y'],
                'Market Cap Change 24h': response.json()['market_data']['market_cap_change_24h'],
                'Market Cap Change Percentage 24h': response.json()['market_data']['market_cap_change_percentage_24h'],
                'Circulating Supply': response.json()['market_data']['circulating_supply'],
                'Total Supply': response.json()['market_data']['total_supply'],
                'Max Supply': response.json()['market_data']['max_supply'],
                }, 200
    else:
        return jsonify(message='Crypto not found'), 404



def get_crypto_values():
    url = 'https://api.coingecko.com/api/v3/coins/'
    response = requests.get(url)
    if response.status_code == 200:
        data = []
        for result in response.json():
            data.append({'Rank': result['id'],
                'Value': result['market_data']['current_price']['usd'],
                'Name': result['name'],
                'Image': result['image']['large'],
                })
        return jsonify(data, 200)
    else:
        return jsonify(message='Crypto not found'), 400


def get_data_crypto():
    with open('crypto_data.json') as json_file:
        data = json.load(json_file)
        return data

def get_crypto_list():
        data = get_data_crypto()
        cryptoListData = data["data"][0:100]
        cryptoList = []
        for crypto in cryptoListData:
            cryptoList.append({"id": crypto["id"], "name": crypto["crypto"]} )
        return cryptoList



def get_crypto_market_cap_by_time():
    body = request.get_json()
    id = body["crypto_id"]
    time = body["time_interval"]
    if (not id or not time):
        return jsonify(message='Bad request'), 400 
    data = get_data_crypto()
    dataList = [crypto for crypto in data["data"] if crypto["id"] == id]
    dataMC = []
    
    for crypto in dataList:
        dataMC.append({
            "market_cap": crypto["market_cap"],
            "time": datetime.strptime(crypto["time"], "%Y-%m-%d %H:%M:%S")
        })

    if time == "20s":
        return filter_data_mc_by_time(dataMC, "20s")
    elif time == "40s":
        return filter_data_mc_by_time(dataMC, "40s")
    elif time == "1m":
        return filter_data_mc_by_time(dataMC, "60s")
    elif time == "5m":
        return filter_data_mc_by_time(dataMC, "300s")
    elif time == "10m":
        return filter_data_mc_by_time(dataMC, "600s")
    elif time == "30m":
        return filter_data_mc_by_time(dataMC, "18000s")
    else:
        print("Invalid time interval specified. Please use '20s' or '40s'.")
        return None


def get_crypto_value_by_time():
    body = request.get_json()
    id = body["crypto_id"]
    time = body["time_interval"]
    if (not id or not time):
        return jsonify(message='Bad request'), 400 
    data = get_data_crypto()
    dataList = [crypto for crypto in data["data"] if crypto["id"] == id]
    dataValues = []
    
    for crypto in dataList:
        dataValues.append({
            "value": crypto["crypto"],
            "time": datetime.strptime(crypto["time"], "%Y-%m-%d %H:%M:%S")
        })

    if time == "20s":
        return filter_data_value_by_time(dataValues, "20s")
    elif time == "40s":
        return filter_data_value_by_time(dataValues, "40s")
    elif time == "1m":
        return filter_data_value_by_time(dataValues, "60s")
    elif time == "5m":
        return filter_data_value_by_time(dataValues, "300s")
    elif time == "10m":
        return filter_data_value_by_time(dataValues, "600s")
    elif time == "30m":
        return filter_data_value_by_time(dataValues, "18000s")
    else:
        print("Invalid time interval specified. Please use '20s' or '40s'.")
        return None

def filter_data_value_by_time(data, time_interval):
    
    data_values = []

    # Convertir la chaîne de temps en une durée timedelta
    interval_duration = timedelta(seconds=int(time_interval[:-1]))

    for crypto in data:
        current_time = crypto["time"]

        # Vérifier si l'intervalle de temps est atteint
        if not data_values or current_time - data_values[-1]["time"] >= interval_duration:
            data_values.append({"value": crypto["value"], "time": current_time})

    return data_values

def filter_data_mc_by_time(data, time_interval):
    
    data_mk = []

    # Convertir la chaîne de temps en une durée timedelta
    interval_duration = timedelta(seconds=int(time_interval[:-1]))

    for crypto in data:
        current_time = crypto["time"]

        # Vérifier si l'intervalle de temps est atteint
        if not data_mk or current_time - data_mk[-1]["time"] >= interval_duration:
            data_mk.append({"market_cap": crypto["market_cap"], "time": current_time})

    return data_mk