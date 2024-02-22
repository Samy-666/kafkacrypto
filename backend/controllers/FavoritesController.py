from flask import request
import json
from flask import jsonify
from models.Models import Favorites, db



def index():
    favorites = Favorites.query.all()
    return ([favorite.serialize for favorite in favorites]), 200


def get_users_favorites(current_user):
    user_id = current_user.id
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    if favorites:
        return jsonify(favorites[0].serialize), 200
    else:
        # Si l'utilisateur n'a pas de favoris, retourner une liste vide
        return jsonify([]), 200



def add_item_to_favorites(current_user):
    data = request.get_json()
    if data and all(key in data for key in ('id', 'name')):  # Vérifier si les clés requises sont présentes
        user_id = current_user.id
        favorite = Favorites.query.filter_by(user_id=user_id).first()
        if favorite:
            # Si un favori existe déjà, nous vérifions si l'objet correspond au format attendu
            if set(data.keys()) == {'id', 'name'}:
                crypto_list = json.loads(favorite.crypto_list)
                new_crypto = {"id": data['id'], "name": data['name']}
                if new_crypto not in crypto_list:
                    crypto_list.append(new_crypto)
                    favorite.crypto_list = json.dumps(crypto_list)
                    db.session.commit()
                    return jsonify(message='Favorite updated'), 202
                else:
                    return jsonify(message='Crypto already exists in favorites'), 400
            else:
                return jsonify(message='Bad request, data format is not valid'), 400
        else:
            # Si le favori n'existe pas, nous vérifions si l'objet correspond au format attendu
            if set(data.keys()) == {'id', 'name'}:
                new_favorite = Favorites(user_id=user_id, crypto_list=[data])
                db.session.add(new_favorite)
                db.session.commit()
                return jsonify(message='Favorite created'), 201
            else:
                return jsonify(message='Bad request, data format is not valid'), 400
    else:
        return jsonify(message='Bad request, data is missing id or name field'), 400

    
    
    
def remove_item_from_favorites(current_user):
    data = request.get_json()
    if data:
        user_id = current_user.id
        favorite = Favorites.query.filter_by(user_id=user_id).first()
        if favorite:
            crypto_list = json.loads(favorite.crypto_list)  # Convertir la chaîne JSON en liste Python
            if data in crypto_list:  # Vérifier si l'élément à supprimer est dans la liste
                crypto_list.remove(data)  # Supprimer l'élément de la liste
                favorite.crypto_list = json.dumps(crypto_list)  # Enregistrer la liste mise à jour en tant que chaîne JSON
                db.session.commit()
                return jsonify(message='Favorite updated'), 202
            else:
                return jsonify(message='Crypto not found in favorites'), 400
        else:
            return jsonify(message='Favorite not found'), 400
    else:
        return jsonify(message='Bad request'), 400
    

