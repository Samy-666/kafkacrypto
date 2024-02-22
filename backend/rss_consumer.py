from kafka import KafkaConsumer
import json
import time

# Configuration Kafka
topic_name = "rss-topic"
kafka_server = 'localhost:9092'

# Chemin du fichier XML pour stocker les messages
xml_path = "./rss.xml"

# Créer le fichier XML s'il n'existe pas
with open(xml_path, 'a') as file:
    file.write('[]')

# Ajouter les droits au fichier
import os
os.chmod(xml_path, 0o777)

# Créer un consommateur Kafka
consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=[kafka_server],
    auto_offset_reset='earliest',
    group_id='myFirst-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
    consumer_timeout_ms=1000 
)

# Ouvrir un fichier en mode écriture pour stocker les messages
with open(xml_path, 'w') as file:
    # Boucle de consommation des messages
    try:
        for msg in consumer:
            message = msg.value.decode('utf-8')
            print('Received message: {}'.format(message))
            # Écrire le message dans le fichier
            file.write(message + '\n')
            time.sleep(1)  # Modifiez ce délai si nécessaire pour limiter le taux d'écriture
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
