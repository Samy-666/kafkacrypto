from flask import Blueprint
from controllers.CryptoController import  get_data_crypto, get_crypto_list, get_crypto_value_by_time, get_crypto_market_cap_by_time
from middleware.auth_middleware import token_required

crypto_bp = Blueprint('crypto_bp', __name__)

@crypto_bp.route('/list', methods=['GET'])
# @token_required
def get_cryptos_list():
    return get_crypto_list()
    
@crypto_bp.route('/data', methods=['GET'])
# @token_required
def get_crypto_data():
    return get_data_crypto()


@crypto_bp.route('/dataValuesByTime', methods=['POST'])
# @token_required
def get_data_values_by_time():
    return get_crypto_value_by_time()


@crypto_bp.route('/dataMCByTime', methods=['POST'])
# @token_required
def get_data_mc_by_time():
    return get_crypto_market_cap_by_time()