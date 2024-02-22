from flask import request
import requests
import json
from flask import jsonify


def get_filtred_rss(rss, crypto):
    rss = json.loads(rss)
    filtred_rss = []
    for item in rss['items']:
        if crypto in item['title']:
            filtred_rss.append(item)
    return jsonify(filtred_rss), 200

def get_rss_feed_by_crypto():
    data = request.get_json()
    rss_response = get_rss_feed()
    if rss_response and data and 'crypto' in data:
        crypto = data['crypto']
        rss_content = rss_response
        response = get_filtred_rss(rss_content, crypto)
        return response, 200
    else:
        return jsonify(message='Bad request, data is missing crypto field'), 400
    
   


def get_rss_feed():
    url = "https://coinjournal.net/fr/actualites/feed/"
    
    # Effectuer la requête HTTP GET pour récupérer les données de l'API
    response = requests.get(url)
    
    # Vérifier si la requête a réussi (code de statut HTTP 200)
    if response.status_code == 200:
        # Renvoyer le contenu brut de la réponse
        return response.text
    else:
        # Si la requête a échoué, afficher un message d'erreur
        print(f"Erreur lors de la récupération de l'API : {response.status_code}")
        return None
