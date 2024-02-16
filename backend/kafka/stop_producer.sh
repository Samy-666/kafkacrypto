#!/bin/bash

# Arret du producer Kafka
echo "Arret du producer Kafka..."
pkill -f "python3 backend/kafka/producer.py"
