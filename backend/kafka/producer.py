import json
# import urllib.request
import time
#
# import six
# import sys

# if sys.version_info >= (3, 12, 0):
#     sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaProducer


import requests
from datetime import datetime
import json
from kafka import KafkaProducer
import time

#import json
import requests
from datetime import datetime
from kafka import KafkaProducer
import time

# Configuration Kafka
topic_name = "btopic1"
kafka_server = 'localhost:9092'
producer = KafkaProducer(bootstrap_servers=[kafka_server],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

def fetch_top_coins(limit=100):
    """
    Récupère les identifiants des 'limit' premières crypto-monnaies par capitalisation boursière.
    """
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1"
    response = requests.get(url)
    #print(response)
    data = response.json()
    return data  # Renvoie directement les données de marché

while True:
    try:
        top_coins_data = fetch_top_coins()
        for coin_data in top_coins_data:
            # Préparation du message avec les données de chaque crypto-monnaie
            message = {
                'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'crypto': {
                    'name': coin_data['name'],
                    'price': coin_data['current_price'],
                    'market_cap': coin_data['market_cap']
                }
            }
            producer.send(topic_name, message)
            print(f"Sent data to Kafka: {message}")
            time.sleep(1)  # Modifiez ce délai si nécessaire pour limiter le taux d'envoi
    except Exception as e:
        print("Error fetching or sending data:", e)
    time.sleep(20)  # Pause entre chaque cycle de requêtes pour ne pas surcharger l'API




