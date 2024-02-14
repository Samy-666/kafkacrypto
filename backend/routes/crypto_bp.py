from flask import Blueprint, jsonify
from controllers.CryptoController import  get_data_crypto,calculate_percentage_evolution, get_crypto_current_info, get_crypto_list, get_crypto_value_by_time, get_crypto_market_cap_by_time
from middleware.auth_middleware import token_required


crypto_bp = Blueprint('crypto_bp', __name__)

@crypto_bp.route('/list', methods=['GET'])
@token_required
def get_cryptos_list(current_user):
    return get_crypto_list()
    
@crypto_bp.route('/data', methods=['GET'])
@token_required
def get_crypto_data(current_user):
    return get_data_crypto()


@crypto_bp.route('/dataValuesByTime', methods=['POST'])
@token_required
def get_data_values_by_time(current_user):
    return get_crypto_value_by_time()


@crypto_bp.route('/dataMCByTime', methods=['POST'])
@token_required
def get_data_mc_by_time(current_user):
    return get_crypto_market_cap_by_time()

@crypto_bp.route('/cryptoCurrentInfo', methods=['POST'])
@token_required
def get_crypto_current_infos(current_user):
    return get_crypto_current_info()

@crypto_bp.route('/dataByEvolution', methods=['GET'])
def get_data_by_evolu(current_user):
    evolution=calculate_percentage_evolution()
    return jsonify(evolution)