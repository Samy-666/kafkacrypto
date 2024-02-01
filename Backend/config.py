import os

SECRET_KEY = "b'5\x0b\xedWe\xbfx\xe1\xab\x85X\xea\x88\xe8s%\xa8\x01/~0\xea4\x1b\xf5i,\xf9~9\xf1\xbf'"


#Database 
DB_NAME = "cryptoviz"

DB_USERNAME = "postgres"

DB_PASSWORD = "root"

DB_PORT = "5432"

DB_HOST = "localhost"

# Connect to the database
SQLALCHEMY_DATABASE_URI = 'postgresql://'+DB_USERNAME+':'+DB_PASSWORD+'@'+DB_HOST+':'+DB_PORT+'/'+DB_NAME


# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__)) 

# Enable debug mode.
DEBUG = True

# Turn off the Flask-SQLAlchemy event system and warning
SQLALCHEMY_TRACK_MODIFICATIONS = False