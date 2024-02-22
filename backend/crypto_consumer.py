import six
import sys
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves
from kafka import KafkaConsumer
import json
import os
 
kafka_server = 'localhost:9092'
topic_name = 'datacrypto'
 
consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=[kafka_server],
    auto_offset_reset='earliest',
    group_id='crypto-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)
 
json_path = "./data.json"
 
def append_to_json_file(path, new_data):
    # Vérifier si le fichier existe et a du contenu
    if os.path.exists(path) and os.path.getsize(path) > 0:
        with open(path, 'r+') as file:
            try:
                file_data = json.load(file)  # Charger les données existantes
            except json.JSONDecodeError:
                file_data = {}  # Si le fichier n'est pas un JSON valide, créer un dictionnaire vide
               
            # Vérifier si la clé 'data' existe, sinon la créer
            if 'data' not in file_data:
                file_data['data'] = []
               
            file_data['data'].extend(new_data)  # Ajouter les nouvelles données
           
            file.seek(0)  # Retour au début du fichier
            file.truncate()  # Supprimer le contenu existant
            json.dump(file_data, file, indent=4)  # Réécrire les données combinées
    else:
        # Si le fichier n'existe pas ou est vide, créer un nouveau dictionnaire avec 'data'
        with open(path, 'w') as file:
            json.dump({"data": new_data}, file, indent=4)
 
try:
    for message in consumer:
        coins_data = message.value["coins"]  # Directly access the list
        if coins_data:
            append_to_json_file(json_path, coins_data)
            print(f"Appended batch of {len(coins_data)} coins to JSON.")
except KeyboardInterrupt:
    print("Stopping consumer...")
finally:
    consumer.close()
    print("Consumer stopped.")
 