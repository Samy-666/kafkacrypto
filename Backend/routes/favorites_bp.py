from flask import Blueprint
from controllers.FavoritesController import index, get_favorite_by_id, create_favorite, update_favorite, delete_favorite

favorites_bp = Blueprint('favorites_bp', __name__)

@favorites_bp.route('/', methods=['GET'])
def get_favorites():
    return index()

@favorites_bp.route('/<id>', methods=['GET'])
def get_favorite(id):
    return get_favorite_by_id(id)

@favorites_bp.route('/', methods=['POST'])
def add_favorite():
    return create_favorite()

@favorites_bp.route('/<id>', methods=['PUT'])
def change_favorite(id):
    return update_favorite(id)

@favorites_bp.route('/<id>', methods=['DELETE'])
def remove_favorite(id):
    return delete_favorite(id)


