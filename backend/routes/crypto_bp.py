from flask import Blueprint
from controllers.CryptoController import get_crypto_value_by_id, get_crypto_list, get_crypto_values
from middleware.auth_middleware import token_required

crypto_bp = Blueprint('crypto_bp', __name__)

@crypto_bp.route('/list', methods=['GET'])
@token_required
def get_cryptos_list(current_user):
    return get_crypto_list()

@crypto_bp.route('/values/<id>', methods=['GET'])
@token_required
def get_crypto(current_user, id):
    return get_crypto_value_by_id(id)

@crypto_bp.route('/values', methods=['GET'])
@token_required
def get_cryptos(current_user):
    return get_crypto_values()
    