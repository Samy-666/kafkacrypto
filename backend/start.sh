#!/bin/bash

#Appeler le script stop.sh pour s'assurer que tout est arrêté
echo "Préparation ... "
pkill -f "flask run"
/home/ubuntu/kafkacrypto/backend/stop.sh


# Démarrer Zookeeper
echo "Démarrage de Zookeeper..."
/home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/zookeeper.properties > /dev/null 2>&1 &
ZK_PID=$!

sleep 10

# Démarrer Kafka
echo "Démarrage de Kafka..."

/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/server.properties > /dev/null 2>&1 &
KAFKA_PID=$!

sleep 10

# démarre le producteur Kafka
echo "Démarrage du producteur Kafka..."
python3 /home/ubuntu/kafkacrypto/backend/kafka/producer.py &

sleep 5

# demarrer le consommateur Kafka
echo "Démarrage du consommateur Kafka..."
python3 /home/ubuntu/kafkacrypto/backend/kafka/consumer.py &

sleep 5

# Démarrer votre application Flask
echo "Démarrage de l'application Flask..."
export FLASK_APP=app.py
flask run --host=0.0.0.0 --port=5000 &


# Arrêter le consommateur Kafka lorsque l'application Flask se termine
echo "Arrêt du consommateur Kafka..."
pkill -f "python3 /home/ubuntu/kafkacrypto/backend/kafka/consumer.py"

# Arrêter le producteur Kafka si nécessaire
echo "Arrêt du producteur Kafka..."
pkill -f "python3 /home/ubuntu/kafkacrypto/backend/kafka/producer.py"

# Arrêter Zookeeper et Kafka
echo "Arrêt de Zookeeper et Kafka..."
/home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-stop.sh
/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-stop.sh

# Attendre que tous les processus se terminent
wait $ZK_PID
wait $KAFKA_PID
