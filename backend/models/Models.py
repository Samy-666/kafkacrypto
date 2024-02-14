from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    password = db.Column(db.Text)
    email = db.Column(db.String)
    age = db.Column(db.String(120))
    address = db.Column(db.String(120))
    @property
    def serialize(self):
        return {
            'id': self.id, 
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
            'email': self.email,
            'age': self.age,
            'address': self.address,
        }
    @classmethod
    def get_by_id(self, user_id):
        return self.query.filter_by(id=user_id).first()
    

class Favorites(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    crypto_list = db.Column(db.String)  # Colonne pour stocker les données JSON sous forme de chaîne

    def __init__(self, user_id, crypto_list):
        self.user_id = user_id
        self.crypto_list = json.dumps(crypto_list)  # Convertir la liste en format JSON

    @property
    def deserialize_crypto_list(self):
        return json.loads(self.crypto_list)  # Convertir la chaîne JSON en liste

    @property
    def serialize(self):
        return {
            'id': self.id, 
            'user_id': self.user_id,
            'crypto_list': self.deserialize_crypto_list  # Utiliser la méthode pour récupérer la liste
        }

