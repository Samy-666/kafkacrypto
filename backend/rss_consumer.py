from kafka import KafkaConsumer
import json
# Configuration du consommateur Kafka

# Configuration Kafka
topic_name = "rss-topic"
kafka_server = 'localhost:9092'

consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=[kafka_server],
    auto_offset_reset='earliest',
    group_id='myFirst-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)
# Abonnement au topic Kafka
consumer.subscribe(['rss-topic'])

# Boucle de consommation des messages
while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == 'PARTITION_EOF':
            # Fin de la partition, continuons
            continue
        else:
            # Erreur irrécupérable, arrêtons le consommateur
            print(msg.error())
            break
    # Affichage du message
    print('Received message: {}'.format(msg.value().decode('utf-8')))

# Fermeture du consommateur Kafka
consumer.close()
