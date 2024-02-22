#!/bin/bash

# Function to check if a process is running
function is_process_running {
    pgrep -f "$1" > /dev/null
}

# Function to gracefully stop a process
function stop_process {
    pkill -f "$1"
    while is_process_running "$1"; do
        sleep 1
    done
}

# Function to start Kafka components
function start_kafka_components {
    local component_name="$1"
    local component_command="$2"

    echo "Démarrage de $component_name..."
    eval "$component_command > /dev/null 2>&1 &"
    if [ $? -ne 0 ]; then
        echo "Erreur lors du démarrage de $component_name."
        exit 1
    fi
    sleep 10
}

# Function to start Flask application
function start_flask_app {
    echo "Démarrage de l'application Flask..."
    export FLASK_APP=app.py
    flask run --host=0.0.0.0 &
    FLASK_PID=$!
}

# Function to stop Kafka components
function stop_kafka_components {
    echo "Arrêt de Zookeeper et Kafka..."
    /home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-stop.sh
    /home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-stop.sh
    stop_process "zookeeper"
    stop_process "kafka"
}

# Function to stop Kafka producers and consumers
function stop_kafka_clients {
    echo "Arrêt du consommateur et du producteur Kafka..."
    stop_process "python3 /home/ubuntu/kafkacrypto/backend/kafka/crypto_consumer.py"
    stop_process "python3 /home/ubuntu/kafkacrypto/backend/kafka/crypto_producer.py"
}

# Function to stop all processes
function stop_all_processes {
    stop_kafka_clients
    stop_kafka_components
    if is_process_running "flask run --host=0.0.0.0"; then
        stop_process "flask run --host=0.0.0.0"
    fi
}

# Trap Ctrl+C and stop all processes
trap stop_all_processes SIGINT

# Préparation
echo "Préparation..."
stop_all_processes

# Démarrage de Zookeeper
start_kafka_components "Zookeeper" "/home/ubuntu/kafka_2.12-3.6.1/bin/zookeeper-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/zookeeper.properties"
sleep 8
# Démarrage de Kafka
start_kafka_components "Kafka" "/home/ubuntu/kafka_2.12-3.6.1/bin/kafka-server-start.sh /home/ubuntu/kafka_2.12-3.6.1/config/server.properties"
sleep 8

# Démarrage de l'application Flask
start_flask_app

# Attente de la fin du processus Flask
wait $FLASK_PID
