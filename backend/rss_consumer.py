from kafka import KafkaConsumer
import os

# Configuration Kafka
topic_name = "rssfeed"
kafka_server = 'localhost:9092'
consumer = KafkaConsumer(topic_name, bootstrap_servers=[kafka_server],
                         value_deserializer=lambda v: v.decode('utf-8'))

# Emplacement du fichier de sauvegarde
file_path = "./rss_feed.xml"

# Fonction pour lire les messages Kafka et sauvegarder dans un fichier
def consume_and_save_to_file(consumer, file_path):
    try:
        for message in consumer:
            # Récupérer le contenu du message
            feed_content = message.value
            
            # Effacer le contenu existant du fichier
            with open(file_path, 'w') as file:
                file.write(feed_content)
            
            print("Saved data to file")
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

# Appel de la fonction pour consommer et sauvegarder les messages
consume_and_save_to_file(consumer, file_path)