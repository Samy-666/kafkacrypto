from kafka import KafkaProducer
import feedparser 
import json
import time

# Configuration Kafka
topic_name = "rss-topic"
kafka_server = 'localhost:9092'
producer = KafkaProducer(bootstrap_servers=[kafka_server],
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

# URL du flux RSS à récupérer
rss_feed_url = "https://coinjournal.net/fr/actualites/feed/"

def fetch_and_publish_rss(rss_feed_url, kafka_topic):
    # Fonction pour récupérer les entrées du flux RSS et les publier dans Kafka
    while True:
        try:
            feed = feedparser.parse(rss_feed_url)
            for entry in feed.entries:
                # Préparation du message avec le titre de chaque entrée du flux RSS
                message = {"title": entry.title}
                producer.send(kafka_topic, value=message)
                print(f"Sent data to Kafka: {message}")
                time.sleep(1)  # Modifiez ce délai si nécessaire
        except Exception as e:
            print("Error fetching or sending data:", e)
        time.sleep(20)  # Pause entre chaque cycle de récupération pour éviter de surcharger l'API

# Appel de la fonction pour récupérer et publier les messages
fetch_and_publish_rss(rss_feed_url, topic_name)
