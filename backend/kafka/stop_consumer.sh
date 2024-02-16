#!/bin/bash

# Arret du consommateur Kafka
echo "Arrêt du consommateur Kafka..."
pkill -f "python /home/ubuntu/kafkacrypto/backend/kafka/consumer.py"
