import requests
import json
from flask import jsonify, request
from datetime import datetime, timedelta


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


def get_crypto_current_info():
    data = get_data_crypto()
    crypto = data["data"]
    return jsonify(crypto)

def get_crypto_market_cap_by_time():
    body = request.get_json()
    id = int(body["crypto_id"])
    time = body["time_interval"]
    # if (not id or not time):
    #     return jsonify(message='Bad request'), 400 
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
    id = int(body["crypto_id"])
    time = body["time_interval"]
    # if (not id or not time):
    #     return jsonify(message='Bad request'), 400 
    data = get_data_crypto()
    dataList = [crypto for crypto in data["data"] if crypto["id"] == id]
    dataValues = []
    
    for crypto in dataList:
        dataValues.append({
            "value": crypto["price"],
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
    datas = []
    # Convertir la chaîne de temps en une durée timedelta
    interval_duration = timedelta(seconds=int(time_interval[:-1]))

    for crypto in data:
        current_time = crypto["time"]

        # Vérifier si l'intervalle de temps est atteint
        if not data_values or current_time - data_values[-1]["time"] >= interval_duration:
            data_values.append({"value": crypto["value"], "time": current_time})

    fistValue = data_values[0]["value"]
    lastValue = data_values[len(data_values)-1]["value"]
    evolution = ((fistValue - lastValue) / fistValue) * 100
    evolution = round(evolution, 3)
    datas.append({"evolution": evolution, "data": data_values})

    return datas

def filter_data_mc_by_time(data, time_interval):
    
    data_mk = []
    datas = []

    # Convertir la chaîne de temps en une durée timedelta
    interval_duration = timedelta(seconds=int(time_interval[:-1]))

    for crypto in data:
        current_time = crypto["time"]

        # Vérifier si l'intervalle de temps est atteint
        if not data_mk or current_time - data_mk[-1]["time"] >= interval_duration:
            data_mk.append({"market_cap": crypto["market_cap"], "time": current_time})

    fistValue = data_mk[0]["market_cap"]
    lastValue = data_mk[len(data_mk)-1]["market_cap"]
    evolution = ((fistValue - lastValue) / fistValue) * 100
    evolution = round(evolution, 3)
    datas.append({"evolution": evolution, "data": data_mk})
    return datas

def calculate_percentage_evolution():
    #defining parameters to test
    data = get_data_crypto()
    crypto_name = 'Bitcoin'
    time_interval = '30m'

    # Convertir les timestamps en datetime
    for record in data:
        record['time'] = datetime.strptime(record['time'], "%Y-%m-%d %H:%M:%S")

    # Filtrer les données pour la cryptomonnaie spécifiée
    filtered_data = [record for record in data if record['crypto'] == crypto_name]
    filtered_data.sort(key=lambda x: x['time'], reverse=True)

    # Trouver les enregistrements dans l'intervalle de temps
    end_time = filtered_data[0]['time']
    start_time = end_time - timedelta(seconds=time_interval)

    start_price = None
    end_price = filtered_data[0]['price']

    for record in filtered_data:
        if record['time'] <= start_time:
            start_price = record['price']
            break

    # Calculer l'évolution en pourcentage
    if start_price and end_price:
        evolution = ((end_price - start_price) / start_price) * 100
        return evolution
    else:
        return "Données insuffisantes"