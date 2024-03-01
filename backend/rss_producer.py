import requests
from kafka import KafkaProducer
import time

# Configuration Kafka
topic_name = "rssfeed"
kafka_server = 'localhost:9092'
producer = KafkaProducer(bootstrap_servers=[kafka_server],
                         value_serializer=lambda v: v.encode('utf-8'))

# URL du flux RSS à récupérer
rss_feed_url = "https://coinjournal.net/fr/actualites/feed/"

def fetch_and_publish_rss(rss_feed_url, kafka_topic):
    # Fonction pour récupérer les entrées du flux RSS et les publier dans Kafka
    while True:
        try:
            # Effectuer une requête GET pour récupérer le contenu du flux RSS
            response = requests.get(rss_feed_url)
            if response.status_code == 200:
                feed_content = response.text
                
                # Envoyer le contenu récupéré dans Kafka
                producer.send(kafka_topic, value=feed_content)
                print("Sent data to Kafka")
            else:
                print(f"Failed to fetch RSS feed. Status code: {response.status_code}")
            
            time.sleep(1800)  # Modifiez ce délai si nécessaire
            
        except Exception as e:
            print("Error fetching or sending data:", e)
        
        time.sleep(30)  # Pause 30 min entre chaque cycle de récupération pour éviter de surcharger l'API

# Appel de la fonction pour récupérer et publier les messages
fetch_and_publish_rss(rss_feed_url, topic_name)