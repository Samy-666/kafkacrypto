import sys
from flask import render_template, redirect, url_for, request, abort
import json
from flask import jsonify
from models.Models import User, db
from flask_sqlalchemy import SQLAlchemy
import jwt
from config import SECRET_KEY


def index():
    users = User.query.all()
    return ([user.serialize for user in users]), 200

def create_user():
    data = request.get_json()
    if data:
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        age = data['age']
        address = data['address']
        new_user = User(first_name=first_name, last_name=last_name, password=password, email=email, age=age, address=address)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(message='User created'), 201
    else:
        return jsonify(message='Bad request'), 400

def get_user_by_id(id):
    user = User.query.get(id)
    if user:
        return jsonify(user.serialize), 200
    else:
        return jsonify(message='User not found'), 400

def get_user_infos():
    token = request.headers.get('Authorization').split()[1]
    try:
         user_id = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])['user_id']
         user = User.query.get(user_id)
         if user:
              return jsonify(user.serialize), 200
         else:
              return jsonify(message='User not found'), 400
    except Exception as e:
         print(e)
         return jsonify(message='Invalid token'), 401


def update_user(id):
    user = User.query.get(id)
    if user:
        data = request.get_json()
        if data:
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.password = data['password']
            user.email = data['email']
            user.age = data['age']
            user.address = data['address']
            db.session.commit()
            return jsonify(message='User updated'), 202
        else:
            return jsonify(message='Bad request'), 400  
    else:
        return jsonify(message='User not found'), 400

def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify(message='User deleted'), 202
    else:
        return jsonify(message='User not found'), 400
        
def login():
    data = request.get_json()
    if data:
        email = data.get('email')  
        password = data.get('password')  
        user = User.query.filter_by(email=email).first()
        if user:
            if password == user.password:
                try:
                    token = jwt.encode(
                        {"user_id": user.id}, 
                        SECRET_KEY,
                        algorithm="HS256"
                    )
                    user.token = token 
                    db.session.commit()
                    return {
                        "message": "Successfully fetched auth token",
                        "token": token  
                    }, 200
                except Exception as e:
                    print(e)
                    return jsonify(message='Error in generating token'), 500
            else:
                return jsonify(message='Incorrect password'), 401
        else:
            return jsonify(message='User not found'), 400
    else:
        return jsonify(message='Bad request'), 400


def register():
    data = request.get_json()
    if data:
        email = data.get('email')  
        password = data.get('password')
        age = data.get('age')
        address = data.get('address')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify(message='User already exists'), 409
        else:
            new_user = User(email=email, password=password, age=age, address=address, first_name=first_name, last_name=last_name)
            db.session.add(new_user)
            db.session.commit()
            return jsonify(message='User created'), 201
    else:
        return jsonify(message='Bad request'), 400