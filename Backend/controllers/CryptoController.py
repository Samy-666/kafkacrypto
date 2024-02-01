import requests
import json
import csv
from flask import jsonify

def get_crypto_list():
    url = 'https://api.coingecko.com/api/v3/coins/list'
    response = requests.get(url)
    if response.status_code == 200:
        return {'crypto_list': response.json()}, 200
    else:
        return jsonify(message='Crypto list not found'), 404


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
                # 'Symbol': result['symbol'],
                'Image': result['image']['large'],
                # 'Description': result['description']['en'],
                # 'Website': result['links']['homepage'][0],
                # 'Genesis Date': result['genesis_date'],
                # 'Market Cap': result['market_data']['market_cap']['usd'],
                # 'Circulating Supply': result['market_data']['circulating_supply'],
                # 'Total Supply': result['market_data']['total_supply'],
                # 'Max Supply': result['market_data']['max_supply'],
                # 'All Time High': result['market_data']['ath']['usd'],
                # 'All Time Low': result['market_data']['atl']['usd'],
                # 'Price Change 24h': result['market_data']['price_change_24h'],
                # 'Price Change Percentage 24h': result['market_data']['price_change_percentage_24h'],
                # 'Price Change Percentage 7d': result['market_data']['price_change_percentage_7d'],
                # 'Price Change Percentage 14d': result['market_data']['price_change_percentage_14d'],
                # 'Price Change Percentage 30d': result['market_data']['price_change_percentage_30d'],
                # 'Price Change Percentage 60d': result['market_data']['price_change_percentage_60d'],
                # 'Price Change Percentage 200d': result['market_data']['price_change_percentage_200d'],
                # 'Price Change Percentage 1y': result['market_data']['price_change_percentage_1y'],
                # 'Market Cap Change 24h': result['market_data']['market_cap_change_24h'],
                # 'Market Cap Change Percentage 24h': result['market_data']['market_cap_change_percentage_24h'],
                # 'Price Change Percentage 7d': result['market_data']['price_change_percentage_7d'],
                # 'Price Change Percentage 14d': result['market_data']['price_change_percentage_14d'],
                # 'Price Change Percentage 30d': result['market_data']['price_change_percentage_30d'],
                # 'Price Change Percentage 60d': result['market_data']['price_change_percentage_60d'],
                # 'Price Change Percentage 200d': result['market_data']['price_change_percentage_200d'],
                # 'Price Change Percentage 1y': result['market_data']['price_change_percentage_1y'],
                # 'Market Cap Change 24h': result['market_data']['market_cap_change_24h'],
                # 'Market Cap Change Percentage 24h': result['market_data']['market_cap_change_percentage_24h'],
                # 'Circulating Supply': result['market_data']['circulating_supply'],
                # 'Total Supply': result['market_data']['total_supply'],
                # 'Max Supply': result['market_data']['max_supply']
                })
        # with open('crypto_data.csv', 'w', newline='') as file:
        #     writer = csv.writer(file)
        #     header = ["Rank", "Value", "Name", "Image"]
        #     writer.writerow(header)
        #     for crypto in data:
        #         row = [crypto["Rank"], crypto["Value"], crypto["Name"], crypto["Image"]]
        #         writer.writerow(row)
        return jsonify(data, 200)
    else:
        return jsonify(message='Crypto not found'), 400



