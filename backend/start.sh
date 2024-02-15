#!/bin/bash

# Démarrer Zookeeper
echo "Démarrage de Zookeeper..."
/home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/zookeeper.properties > /dev/null 2>&1 &
ZK_PID=$!

# Démarrer Kafka
echo "Démarrage de Kafka..."

/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/server.properties > /dev/null 2>&1 &
KAFKA_PID=$!

# Démarrer votre application Flask
echo "Démarrage de l'application Flask..."
export FLASK_APP=app.py
flask run --host=0.0.0.0 &

# Attendre que tous les processus se terminent
wait $ZK_PID
wait $KAFKA_PID
