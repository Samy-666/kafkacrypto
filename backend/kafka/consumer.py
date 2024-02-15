import six

import sys
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves
from kafka import KafkaConsumer
import json
import os

# Configuration Kafka
kafka_server = 'localhost:9092'
topic_name = 'datarypto'

# Créer un consommateur Kafka
consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=[kafka_server],
    auto_offset_reset='earliest',
    group_id='myFirst-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

print(f"Listening to topic {topic_name} on {kafka_server}...")

# Initialiser la liste pour accumuler les données et l'identifiant
data_accumulator = []
id = 0
json_path = "crypto_data.json"

# Boucle infinie pour lire les messages du topic
try:
    for message in consumer:
        data = message.value
        # Supposition que 'crypto' est un dictionnaire directement sous la racine de 'data'
        crypto_info = data['crypto']  # Directement accéder à 'crypto' au lieu de 'data['info']'
        record = {
            'id': id,
            'crypto': crypto_info['name'],  # Utiliser 'name' au lieu de 'crypto'
            'time': data['time'],  # 'time' est directement sous la racine de 'data'
            'price': crypto_info['price'],
            'market_cap': crypto_info['market_cap']
        }
        data_accumulator.append(record)
        id += 1  # Incrémenter l'identifiant

        # Réinitialiser l'identifiant après 100 messages
        if id >= 100:
            id = 0
        
        # Sauvegarder dans un JSON après avoir reçu 100 messages
        if len(data_accumulator) >= 100:
            with open(json_path, 'w' if not os.path.exists(json_path) else 'a') as file:
                json.dump({'data': data_accumulator}, file, indent=4)
            data_accumulator.clear()  # Vider la liste pour les prochains messages


except KeyboardInterrupt:
    print("Stopping consumer...")
finally:
    consumer.close()
    # Sauvegarder les données restantes lors de la fermeture
    if data_accumulator:
        with open(json_path, 'a') as file:
            json.dump({'data': data_accumulator}, file, indent=4)
