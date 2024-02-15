#!/bin/bash
echo "Création du topic Kafka..."
/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 2 --topic datarypto