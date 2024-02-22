from flask import Flask, render_template
from flask_migrate import Migrate
from models.Models import db
from config import SECRET_KEY
import os

from routes.user_bp import user_bp
from routes.favorites_bp import favorites_bp
from routes.crypto_bp import crypto_bp
from routes.rss_bp import rss_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object('config')

# Initialisez l'instance SQLAlchemy avec l'application Flask
db.init_app(app)

app.config['SECRET_KEY'] = SECRET_KEY


# lancer le producer kafka
os.system('python3 crypto_producer.py &')

# lancer le consumer kafka
os.system('python3 crypto_consumer.py &')

# # lancer le producer kafka rss
# os.system('python3 rss_producer.py &')

# # lancer le consumer kafka rss
# os.system('python3 rss_consumer.py &')

# Initialisez l'extension Flask-Migrate
migrate = Migrate(app, db)

# Créez les tables dans la base de données (avant d'enregistrer les blueprints)
with app.app_context():
    db.create_all()

# Enregistrez le blueprint
app.register_blueprint(user_bp, url_prefix='/users')

app.register_blueprint(favorites_bp, url_prefix='/favorites')

app.register_blueprint(crypto_bp, url_prefix='/crypto')

app.register_blueprint(rss_bp, url_prefix='/rss')


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.debug = True
    app.run()