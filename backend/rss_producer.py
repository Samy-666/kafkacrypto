from kafka import KafkaProducer
import feedparser 
import json
import time

# Configuration du producteur Kafka
# Configuration Kafka
topic_name = "rss-topic"
kafka_server = 'localhost:9092'
producer = KafkaProducer(bootstrap_servers=[kafka_server],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))
# URL du flux RSS à récupérer
rss_feed_url = "https://coinjournal.net/fr/actualites/feed/"

# Fonction de publication des messages dans Kafka
def publish_to_kafka(topic, message):
    producer.produce(topic, value=message)
    producer.flush()

# Fonction pour récupérer les entrées du flux RSS et les publier dans Kafka
def fetch_and_publish_rss(rss_feed_url, kafka_topic):
    feed = feedparser.parse(rss_feed_url)
    for entry in feed.entries:
        message = {"title": entry.title}  # Créer un dictionnaire avec le titre du message
        producer.send(kafka_topic, value=message) 
        print(f"Sent data to Kafka: {message}")
        time.sleep(100) 
    producer.flush()  # Assurer que tous les messages sont envoyés avant de quitter

# Appel de la fonction pour récupérer et publier les messages
fetch_and_publish_rss(rss_feed_url, "rss-topic")
