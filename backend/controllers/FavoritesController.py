import sys
from flask import render_template, redirect, url_for, request, abort
import json
from flask import jsonify
from models.Models import Favorites, db
from flask_sqlalchemy import SQLAlchemy

def index():
    favorites = Favorites.query.all()
    return ([favorite.serialize for favorite in favorites]), 200


def get_favorite_by_id(id):
    favorite = Favorites.query.get(id)
    if favorite:
         return jsonify(favorite.serialize), 200
    else:
         return jsonify(message='Favorite not found'), 404

def create_favorite():
    data = request.get_json()
    if data:
        user_id = data['user_id']
        crypto_list = data['crypto_list']
        new_favorite = Favorites(user_id=user_id, crypto_list=crypto_list)
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(message='Favorite created'), 201
    else:
        return jsonify(message='Bad request'), 400

def update_favorite(id):
    favorite = Favorites.query.get(id)
    if favorite:
        data = request.get_json()
        if data:
            favorite.user_id = data['user_id']
            favorite.crypto_list = data['crypto_list']
            db.session.commit()
            return jsonify(message='Favorite updated'), 202
        else:
            return jsonify(message='Bad request'), 400  
    else:
        return jsonify(message='Favorite not found'), 404

def delete_favorite(id):
    favorite = Favorites.query.get(id)
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify(message='Favorite deleted'), 202
    else:
        return jsonify(message='Favorite not found'), 404


def get_users_favorites(current_user):
    user_id = current_user.id
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    if favorites:
        return jsonify(favorites[0].serialize), 200
    else:
        return jsonify(message='Favorites not found'), 400

def create_favorites(current_user):
    data = request.get_json()
    if data:
        user_id = current_user.id
        crypto_list = data['crypto_list']
        new_favorite = Favorites(user_id=user_id, crypto_list=crypto_list)
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(message='Favorite created'), 201
    else:
        return jsonify(message='Bad request'), 400


def add_item_to_favorites(current_user):
    data = request.get_json()
    if data:
        user_id = current_user.id
        favorite = Favorites.query.filter_by(user_id=user_id).first()
        if favorite:
            crypto_list = json.loads(favorite.crypto_list)
            crypto_list.append(data['crypto_list'])
            favorite.crypto_list = json.dumps(crypto_list)
            db.session.commit()
            return jsonify(message='Favorite updated'), 202
        else:
            # Si le favori n'existe pas, nous le créons avec la liste initiale de cryptos
            new_favorite = Favorites(user_id=user_id, crypto_list=[data['crypto_list']])
            db.session.add(new_favorite)
            db.session.commit()
            return jsonify(message='Favorite created'), 201
    else:
        return jsonify(message='Bad request'), 400
    
def remove_item_from_favorites(current_user):
    data = request.get_json()
    if data:
        user_id = current_user.id
        favorite = Favorites.query.filter_by(user_id=user_id).first()
        if favorite:
            crypto_list = json.loads(favorite.crypto_list)  # Convertir la chaîne JSON en liste Python
            if data['crypto_list'][0] in crypto_list:  # Vérifier si l'élément à supprimer est dans la liste
                crypto_list.remove(data['crypto_list'][0])  # Supprimer l'élément de la liste
                favorite.crypto_list = json.dumps(crypto_list)  # Enregistrer la liste mise à jour en tant que chaîne JSON
                db.session.commit()
                return jsonify(message='Favorite updated'), 202
            else:
                return jsonify(message='Crypto not found in favorites'), 400
        else:
            return jsonify(message='Favorite not found'), 400
    else:
        return jsonify(message='Bad request'), 400