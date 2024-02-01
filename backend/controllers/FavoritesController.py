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

