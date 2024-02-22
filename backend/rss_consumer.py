from kafka import KafkaConsumer
import json

# Configuration Kafka
topic_name = "rss-topic"
kafka_server = 'localhost:9092'

consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=[kafka_server],
    auto_offset_reset='earliest',
    group_id='myFirst-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
    consumer_timeout_ms=1000  # Définir le délai d'attente ici
)

# Boucle de consommation des messages
try:
    for msg in consumer:
        print('Received message: {}'.format(msg.value.decode('utf-8')))
except KeyboardInterrupt:
    pass
finally:
    consumer.close()
