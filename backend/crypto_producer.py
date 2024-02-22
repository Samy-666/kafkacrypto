import six
import sys
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves
import requests
from datetime import datetime
import json
from kafka import KafkaProducer
import time
 
 
topic_name = "datacrypto"
kafka_server = 'localhost:9092'
 
producer = KafkaProducer(bootstrap_servers=[kafka_server],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))
 
def fetch_top_coins(limit=10):
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1"
    response = requests.get(url, )
    return response.json()  # Directly return market data
 
while True:
    try:
        messages = []
        top_coins_data = fetch_top_coins()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if not top_coins_data:
            print("Aucune donnée reçue de l'API.")
            continue  # Saute à la prochaine itération de la boucle
        for id, coin_data in enumerate(top_coins_data):
           
            message = {
                'id': id,
                'crypto': coin_data['name'],
                'time': timestamp,
                'price': coin_data['current_price'],
                'market_cap': coin_data['market_cap']
            }
            messages.append(message)
    except Exception as e:
        print(f"Erreur lors de la récupération des données: {str(e)}")
    # Send messages as a batch
    producer.send(topic_name, {"coins": messages})
    print(f"Sent batch of {len(messages)} coins to Kafka.")
    time.sleep(20)  # Throttle API calls