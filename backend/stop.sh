#!/bin/bash

# Arrêter l'application Flask
echo "Arrêt de l'application Flask..."
pkill -f "flask run"

# Arrêter Kafka
echo "Arrêt de Kafka..."
/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-stop.sh

# Arrêter Zookeeper
echo "Arrêt de Zookeeper..."
/home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-stop.sh
