
import six
import sys
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves
from kafka import KafkaConsumer
import json

# Configuration Kafka
kafka_server = 'localhost:9092'
topic_name = 'datacrypto'

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
json_path = "./data.json"


# add rights to the file
import os
os.chmod(json_path, 0o777)


# Boucle infinie pour lire les messages du topic
try:
    for message in consumer:
        try:
            data = message.value
            # Vérifier la structure des données reçues
            if 'crypto' in data and 'time' in data:
                crypto_info = data['crypto']
                record = {
                    'id': id,
                    'crypto': crypto_info['name'],
                    'time': data['time'],
                    'price': crypto_info['price'],
                    'market_cap': crypto_info['market_cap']
                }
                data_accumulator.append(record)
                id += 1
                print(f"Consumer", record)

                # Sauvegarder dans un JSON après avoir reçu 100 messages
                if len(data_accumulator) >= 100:
                    try:
                        with open(json_path, 'a') as file:
                            json.dump({'data': data_accumulator}, file, indent=4)
                            file.write('\n')
                            file.flush()
                    except Exception as e:
                        print("Error writing data:", e)
                    data_accumulator.clear()
                if id == 100:
                   id = 0   
        except Exception as e:
            print("Error processing message:", e)
except KeyboardInterrupt:
    print("Stopping consumer...")
finally:
    consumer.close()
    # Sauvegarder les données restantes lors de la fermeture
    if data_accumulator:
        try:
            with open(json_path, 'a') as file:
                json.dump({'data': data_accumulator}, file, indent=4)
                file.write('\n')
                file.flush()
        except Exception as e:
            print("Error writing data:", e)
    
    print("Consumer stopped.")

# Lire les données du fichier JSON
with open(json_path, 'r') as file:
    data = json.load(file)

# Vérifier si le premier élément de "data" est un tableau vide
if len(data["data"]) > 0:
    if not data["data"][0]:
        # Si c'est le cas, supprimer le premier élément
        data["data"].pop(0)

# Écrire les données modifiées dans le fichier JSON
with open(json_path, 'w') as file:
    json.dump(data, file, indent=4)

