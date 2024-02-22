from kafka import KafkaConsumer, KafkaError

# Configuration du consommateur Kafka
conf = {'bootstrap.servers': "localhost:9092",
        'group.id': "my_consumer_group",
        'auto.offset.reset': 'earliest'}

# Création de l'instance du consommateur
consumer = KafkaConsumer(conf)

# Abonnement au topic Kafka
consumer.subscribe(['rss-topic'])

# Boucle de consommation des messages
while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
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
