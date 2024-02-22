from kafka import KafkaProducer
import feedparser 

# Configuration du producteur Kafka
conf = {'bootstrap.servers': "localhost:9092"}

# Création de l'instance du producteur
producer = KafkaProducer(conf)

# URL du flux RSS à récupérer
rss_feed_url = "https://coinjournal.net/fr/actualites/tag/"

# Fonction de publication des messages dans Kafka
def publish_to_kafka(topic, message):
    producer.produce(topic, value=message)
    producer.flush()

# Fonction pour récupérer les entrées du flux RSS et les publier dans Kafka
def fetch_and_publish_rss(rss_feed_url, kafka_topic):
    feed = feedparser.parse(rss_feed_url)
    for entry in feed.entries:
        publish_to_kafka(kafka_topic, entry.title)

# Appel de la fonction pour récupérer et publier les messages
fetch_and_publish_rss(rss_feed_url, "rss-topic")
